interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  CONTACT_RATE_LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };
}
const services: Record<string, string> = {
  presentation: 'Sajtovi i landing stranice', commerce: 'Online prodavnice', applications: 'Web aplikacije i poslovni sistemi', integrations: 'Integracije i unapređenja', other: 'Drugo',
};
const json = (body: object, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/api/contact') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
    if (request.headers.get('Origin') !== url.origin) return json({ error: 'Invalid origin' }, 403);
    if (!request.headers.get('Content-Type')?.includes('application/json')) return json({ error: 'JSON required' }, 415);
    const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
    if (!(await env.CONTACT_RATE_LIMITER.limit({ key: ip })).success) return json({ error: 'Too many requests' }, 429);
    if (Number(request.headers.get('Content-Length')) > 32768) return json({ error: 'Too large' }, 413);
    let data: Record<string, unknown>;
    try {
      // Bound streamed bodies too, even when Content-Length is absent.
      const reader = request.body?.getReader();
      if (!reader) return json({ error: 'Missing body' }, 400);
      const chunks: Uint8Array[] = [];
      let total = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > 32768) { await reader.cancel(); return json({ error: 'Too large' }, 413); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(total);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      data = JSON.parse(new TextDecoder().decode(bytes));
      if (!data || typeof data !== 'object' || Array.isArray(data)) return json({ error: 'Invalid body' }, 400);
    } catch { return json({ error: 'Invalid body' }, 400); }
    if (data['website']) return json({ error: 'Invalid submission' }, 400);
    const email = typeof data['email'] === 'string' ? data['email'].trim() : '';
    const description = typeof data['description'] === 'string' ? data['description'].trim() : '';
    const service = typeof data['service'] === 'string' && Object.hasOwn(services, data['service']) ? services[data['service']] : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !service || description.length > 5000) {
      return json({ error: 'Invalid fields' }, 400);
    }
    if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) return json({ error: 'Email not configured' }, 503);
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL, to: ['dev@bazzium.com'], reply_to: email,
          subject: `Bazzium Dev — ${service}`, text: `Email: ${email}\nUsluga: ${service}\n\n${description}`,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) return json({ error: 'Email provider unavailable' }, 502);
      const result = await response.json() as { id?: string };
      if (!result.id) return json({ error: 'Email provider unavailable' }, 502);
      return json({ ok: true });
    } catch { return json({ error: 'Email provider unavailable' }, 502); }
  },
};


