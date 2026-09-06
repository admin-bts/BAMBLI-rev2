export interface NewsletterSubscribePayload {
  email: string;
  source: string;
  gameId?: string;
  gameTitle?: string;
  consent?: boolean;
}

// Fire-and-forget: newsletter signup should never block the game download/play flow.
export async function subscribeToNewsletter(payload: NewsletterSubscribePayload): Promise<void> {
  try {
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[Bambli Newsletter] Subscription request failed:', err);
  }
}
