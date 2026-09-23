import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GAMES_CATALOGUE } from '../src/data/games';
import { getBillTransactions, refGameId } from './_lib/toyyibpay';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const billCode = Array.isArray(req.query.billCode) ? req.query.billCode[0] : req.query.billCode;
  const gameId = Array.isArray(req.query.gameId) ? req.query.gameId[0] : req.query.gameId;

  if (!billCode || !gameId) {
    res.status(400).json({ ok: false, error: 'billCode and gameId are required' });
    return;
  }

  const game = GAMES_CATALOGUE.find((g) => g.id === gameId);
  if (!game) {
    res.status(404).json({ ok: false, error: 'Game not found' });
    return;
  }

  try {
    const transactions = await getBillTransactions(billCode);
    const tx = transactions[0];

    if (!tx) {
      res.status(200).json({ ok: true, paid: false });
      return;
    }

    // Cross-check the gameId embedded in the transaction's own reference
    // number, not just the gameId the client happens to be asking about —
    // closes the gap where a valid paid billCode for one game could
    // otherwise be replayed against a different gameId in a hand-edited URL.
    const isPaid = tx.billpaymentStatus === '1' && refGameId(tx.billExternalReferenceNo) === game.id;

    res.status(200).json({
      ok: true,
      paid: isPaid,
      gameId: game.id,
      downloadUrl: isPaid ? game.offlineDownloadUrl : undefined,
      downloadFileName: isPaid ? game.offlineDownloadFileName : undefined,
    });
  } catch (err) {
    console.error('[verify-payment] Failed to verify with ToyyibPay', err);
    res.status(502).json({ ok: false, error: 'Failed to verify payment' });
  }
}
