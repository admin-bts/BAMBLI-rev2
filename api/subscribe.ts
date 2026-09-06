import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SubscribeRequestBody {
  email?: string;
  source?: string;
  gameId?: string;
  gameTitle?: string;
  consent?: boolean;
}

// "Kids Games Newsletter Contacts" database, shared with our Notion integration.
const NOTION_DATABASE_ID = '4c68892d-8e66-4d18-b36c-ade7ab5b71de';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

interface SyncResult {
  skipped?: true;
  ok: boolean;
  error?: string;
}

async function syncToBrevo(email: string, source: string, gameId: string, gameTitle: string, consent: boolean): Promise<SyncResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey || !listId) {
    return { skipped: true, ok: false, error: 'Brevo is not configured' };
  }

  if (Number.isNaN(Number(listId))) {
    console.error('[subscribe] BREVO_LIST_ID is not a valid number:', listId);
    return { ok: false, error: 'BREVO_LIST_ID is misconfigured' };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        listIds: [Number(listId)],
        updateEnabled: true,
        attributes: {
          SOURCE: source,
          GAME_ID: gameId,
          GAME_TITLE: gameTitle,
          NEWSLETTER_CONSENT: consent,
        },
      }),
    });

    // Brevo returns 201 for a new contact, 204 for an update (updateEnabled: true)
    if (response.status === 201 || response.status === 204) {
      return { ok: true };
    }

    const errorBody = await response.json().catch(() => ({}));
    console.error('[subscribe] Brevo rejected the request', { status: response.status, body: errorBody });
    return { ok: false, error: errorBody?.message || `Brevo returned ${response.status}` };
  } catch (err) {
    console.error('[subscribe] Failed to reach Brevo', err);
    return { ok: false, error: 'Failed to reach Brevo' };
  }
}

async function syncToNotion(email: string, source: string, gameId: string, gameTitle: string, consent: boolean): Promise<SyncResult> {
  const apiKey = process.env.NOTION_API_KEY;

  if (!apiKey) {
    return { skipped: true, ok: false, error: 'Notion is not configured' };
  }

  const notes = gameTitle
    ? `Signed up via ${source} on bambli.online (game: ${gameTitle} / ${gameId}).`
    : `Signed up via ${source} on bambli.online.`;

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties: {
          Name: { title: [{ text: { content: email } }] },
          Email: { email },
          'Marketing Consent': { checkbox: consent },
          Source: { select: { name: 'Website' } },
          Notes: { rich_text: [{ text: { content: notes } }] },
        },
      }),
    });

    if (response.ok) {
      return { ok: true };
    }

    const errorBody = await response.json().catch(() => ({}));
    console.error('[subscribe] Notion rejected the request', { status: response.status, body: errorBody });
    return { ok: false, error: errorBody?.message || `Notion returned ${response.status}` };
  } catch (err) {
    console.error('[subscribe] Failed to reach Notion', err);
    return { ok: false, error: 'Failed to reach Notion' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const { email, source, gameId, gameTitle, consent }: SubscribeRequestBody = req.body || {};

  if (!email || !isValidEmail(email)) {
    res.status(400).json({ ok: false, error: 'A valid email is required' });
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanSource = source || 'website';
  const cleanGameId = gameId || '';
  const cleanGameTitle = gameTitle || '';
  const cleanConsent = consent !== false;

  const [brevo, notion] = await Promise.all([
    syncToBrevo(cleanEmail, cleanSource, cleanGameId, cleanGameTitle, cleanConsent),
    syncToNotion(cleanEmail, cleanSource, cleanGameId, cleanGameTitle, cleanConsent),
  ]);

  const succeeded = brevo.ok || notion.ok;
  res.status(succeeded ? 200 : 502).json({ ok: succeeded, brevo, notion });
}
