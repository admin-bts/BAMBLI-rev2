import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GAMES_CATALOGUE } from '../src/data/games.js';
import { getAppUrl, getBillTransactions, refGameId } from './_lib/toyyibpay.js';

// Best-effort in-memory de-dupe for repeated webhook deliveries. Not durable
// across cold starts or multiple concurrent instances — accepted low-harm
// tradeoff of this repo's stateless, no-database design (a buyer could very
// rarely get two identical emails, never zero).
const recentlyProcessed = new Map<string, number>();
const DEDUPE_WINDOW_MS = 10 * 60 * 1000;

function alreadyProcessed(billCode: string): boolean {
  const now = Date.now();
  for (const [code, ts] of recentlyProcessed) {
    if (now - ts > DEDUPE_WINDOW_MS) recentlyProcessed.delete(code);
  }
  if (recentlyProcessed.has(billCode)) return true;
  recentlyProcessed.set(billCode, now);
  return false;
}

async function sendGameEmail(
  toEmail: string,
  toName: string,
  game: (typeof GAMES_CATALOGUE)[number]
): Promise<{ ok: boolean }> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'Bambli Games';
  const appUrl = getAppUrl();

  if (!apiKey || !senderEmail || !appUrl || !game.offlineDownloadUrl) {
    console.error('[toyyibpay-callback] Email delivery is not fully configured, skipping');
    return { ok: false };
  }

  try {
    const fileResponse = await fetch(`${appUrl}${game.offlineDownloadUrl}`);
    if (!fileResponse.ok) {
      console.error('[toyyibpay-callback] Could not fetch game file for attachment', fileResponse.status);
      return { ok: false };
    }
    const htmlText = await fileResponse.text();
    const base64Content = Buffer.from(htmlText, 'utf-8').toString('base64');

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: toEmail, name: toName || 'Parent' }],
        subject: `Your Bambli game is ready — ${game.title}`,
        htmlContent: `<p>Thank you for your purchase! Your copy of <strong>${game.title}</strong> is attached to this email as a single file.</p><p>Save it anywhere on your Android phone, laptop, or desktop computer, then double-click it to play — no internet needed.</p><p>Keep this email safe — it's how you can always get the game back if you ever lose the file.</p>`,
        attachment: [
          {
            name: game.offlineDownloadFileName || `${game.slug}.html`,
            content: base64Content,
          },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      console.error('[toyyibpay-callback] Brevo rejected the email', { status: response.status, body });
      return { ok: false };
    }

    return { ok: true };
  } catch (err) {
    console.error('[toyyibpay-callback] Failed to send game email', err);
    return { ok: false };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const billCode: string | undefined = body.billcode || body.billCode;

  if (!billCode) {
    res.status(200).json({ ok: true, skipped: 'missing billcode' });
    return;
  }

  if (alreadyProcessed(billCode)) {
    res.status(200).json({ ok: true, skipped: 'already processed' });
    return;
  }

  try {
    // Never trust req.body's own status/status_id field — always re-verify
    // directly against ToyyibPay's API before sending anything.
    const transactions = await getBillTransactions(billCode);
    const tx = transactions[0];

    if (!tx || tx.billpaymentStatus !== '1') {
      res.status(200).json({ ok: true, skipped: 'not paid' });
      return;
    }

    const gameId = refGameId(tx.billExternalReferenceNo);
    const game = GAMES_CATALOGUE.find((g) => g.id === gameId);

    if (!game) {
      console.error('[toyyibpay-callback] Paid transaction references an unknown game', { gameId, billCode });
      res.status(200).json({ ok: true, skipped: 'unknown game' });
      return;
    }

    const result = await sendGameEmail(tx.billEmail, tx.billTo, game);
    res.status(200).json({ ok: true, emailed: result.ok });
  } catch (err) {
    console.error('[toyyibpay-callback] Failed to process callback', err);
    // Still respond 200 to avoid aggressive retry storms from ToyyibPay.
    res.status(200).json({ ok: false, error: 'Failed to process callback' });
  }
}
