import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SubscribeRequestBody {
  email?: string;
  source?: string;
  gameId?: string;
  gameTitle?: string;
  consent?: boolean;
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey || !listId) {
    res.status(500).json({ ok: false, error: 'Newsletter service is not configured' });
    return;
  }

  const { email, source, gameId, gameTitle, consent }: SubscribeRequestBody = req.body || {};

  if (!email || !isValidEmail(email)) {
    res.status(400).json({ ok: false, error: 'A valid email is required' });
    return;
  }

  try {
    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        listIds: [Number(listId)],
        updateEnabled: true,
        attributes: {
          SOURCE: source || 'website',
          GAME_ID: gameId || '',
          GAME_TITLE: gameTitle || '',
          NEWSLETTER_CONSENT: consent !== false,
        },
      }),
    });

    // Brevo returns 201 for a new contact, 204 for an update (updateEnabled: true)
    if (brevoResponse.status === 201 || brevoResponse.status === 204) {
      res.status(200).json({ ok: true });
      return;
    }

    const errorBody = await brevoResponse.json().catch(() => ({}));
    res.status(502).json({ ok: false, error: errorBody?.message || 'Failed to subscribe' });
  } catch {
    res.status(502).json({ ok: false, error: 'Failed to reach newsletter service' });
  }
}
