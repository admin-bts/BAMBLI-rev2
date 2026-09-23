// Shared ToyyibPay helpers used by api/create-payment.ts, api/verify-payment.ts,
// and api/toyyibpay-callback.ts. Filename is prefixed with `_` so Vercel does not
// turn this into its own routable Serverless Function.

const TOYYIBPAY_BASE_URL = (process.env.TOYYIBPAY_BASE_URL || 'https://dev.toyyibpay.com').replace(/\/+$/, '');

// Strips any trailing slash(es) from APP_URL — Vercel env vars are easy to set
// with a trailing slash (e.g. "https://www.bambli.online/"), which would
// otherwise produce double slashes ("...//api/toyyibpay-callback") in the
// return/callback URLs and the self-fetch of the game file for email delivery.
export function getAppUrl(): string {
  return (process.env.APP_URL || '').replace(/\/+$/, '');
}

export interface ToyyibBillTransaction {
  billpaymentStatus: string; // "1" = paid, "2" = pending, "3" = failed/unpaid
  billExternalReferenceNo: string;
  billTo: string;
  billEmail: string;
  [key: string]: unknown;
}

// Always re-derive payment truth from ToyyibPay's own API — never trust the
// status fields ToyyibPay sends back via the return-URL query string or the
// webhook POST body on their own, since neither is cryptographically signed.
export async function getBillTransactions(billCode: string): Promise<ToyyibBillTransaction[]> {
  const secretKey = process.env.TOYYIBPAY_SECRET_KEY;
  if (!secretKey) {
    throw new Error('TOYYIBPAY_SECRET_KEY is not configured');
  }

  const params = new URLSearchParams({ billCode, userSecretKey: secretKey });
  const response = await fetch(`${TOYYIBPAY_BASE_URL}/index.php/api/getBillTransactions`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`ToyyibPay getBillTransactions returned ${response.status}`);
  }

  const data = await response.json().catch(() => null);
  return Array.isArray(data) ? data : [];
}

export function hostedPaymentUrl(billCode: string): string {
  return `${TOYYIBPAY_BASE_URL}/${billCode}`;
}

export function createBillEndpoint(): string {
  return `${TOYYIBPAY_BASE_URL}/index.php/api/createBill`;
}

// Encodes {gameId, ref} into our own opaque token for billReturnUrl, since
// ToyyibPay appends its own billcode/status_id/order_id params on top of
// whatever return URL we give it — we only ever read this token back, plus
// their billcode (to re-verify), never their status_id/msg.
export function encodeReturnToken(gameId: string, ref: string): string {
  return Buffer.from(JSON.stringify({ gameId, ref })).toString('base64url');
}

export function decodeReturnToken(token: string): { gameId: string; ref: string } | null {
  try {
    const parsed = JSON.parse(Buffer.from(token, 'base64url').toString('utf-8'));
    if (parsed && typeof parsed.gameId === 'string' && typeof parsed.ref === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

// billExternalReferenceNo is "<gameId>::<timestamp>::<random>" — parsing the
// gameId back out lets us cross-check a paid billCode actually belongs to the
// game being unlocked, closing a replay gap against a hand-edited gameId query param.
export function refGameId(ref: string): string | null {
  const [gameId] = ref.split('::');
  return gameId || null;
}

export function makeExternalReferenceNo(gameId: string): string {
  const rand = Math.random().toString(16).slice(2, 10);
  return `${gameId}::${Date.now()}::${rand}`;
}
