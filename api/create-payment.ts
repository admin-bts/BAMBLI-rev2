import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GAMES_CATALOGUE } from '../src/data/games.js';
import { createBillEndpoint, encodeReturnToken, getAppUrl, hostedPaymentUrl, makeExternalReferenceNo } from './_lib/toyyibpay.js';

interface CreatePaymentRequestBody {
  gameId?: string;
  email?: string;
  name?: string;
  phone?: string;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const { gameId, email, name, phone }: CreatePaymentRequestBody = req.body || {};

  if (!gameId || typeof gameId !== 'string') {
    res.status(400).json({ ok: false, error: 'gameId is required' });
    return;
  }
  if (!email || !isValidEmail(email)) {
    res.status(400).json({ ok: false, error: 'A valid email is required' });
    return;
  }
  if (!phone || phone.trim().length < 7) {
    res.status(400).json({ ok: false, error: 'A valid phone number is required' });
    return;
  }

  const game = GAMES_CATALOGUE.find((g) => g.id === gameId || g.slug === gameId);
  if (!game) {
    res.status(404).json({ ok: false, error: 'Game not found' });
    return;
  }
  if (game.isFree || game.status !== 'available') {
    res.status(400).json({ ok: false, error: 'This game is not available for purchase' });
    return;
  }

  const secretKey = process.env.TOYYIBPAY_SECRET_KEY;
  const categoryCode = process.env.TOYYIBPAY_CATEGORY_CODE;
  const appUrl = getAppUrl();

  if (!secretKey || !categoryCode || !appUrl) {
    console.error('[create-payment] ToyyibPay is not fully configured');
    res.status(500).json({ ok: false, error: 'Payment is not configured' });
    return;
  }

  const ref = makeExternalReferenceNo(game.id);
  const billReturnUrl = `${appUrl}/?bambli_pay=${encodeReturnToken(game.id, ref)}`;
  const billCallbackUrl = `${appUrl}/api/toyyibpay-callback`;
  const billAmount = Math.round(game.priceMYR * 100);

  const params = new URLSearchParams({
    userSecretKey: secretKey,
    categoryCode,
    billName: game.title.slice(0, 30),
    billDescription: `Bambli - ${game.title} (offline game download)`.slice(0, 100),
    billPriceSetting: '1',
    billPayorInfo: '1',
    billAmount: String(billAmount),
    billReturnUrl,
    billCallbackUrl,
    billExternalReferenceNo: ref,
    billTo: (name || 'Parent').slice(0, 100),
    billEmail: email.trim().toLowerCase(),
    billPhone: phone.trim(),
  });

  try {
    const response = await fetch(createBillEndpoint(), {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json().catch(() => null);
    const billCode = Array.isArray(data) ? data[0]?.BillCode : undefined;

    if (!billCode) {
      console.error('[create-payment] ToyyibPay createBill did not return a BillCode', { status: response.status, data });
      res.status(502).json({ ok: false, error: 'Failed to create payment bill' });
      return;
    }

    res.status(200).json({ ok: true, billCode, paymentUrl: hostedPaymentUrl(billCode) });
  } catch (err) {
    console.error('[create-payment] Failed to reach ToyyibPay', err);
    res.status(502).json({ ok: false, error: 'Failed to reach payment provider' });
  }
}
