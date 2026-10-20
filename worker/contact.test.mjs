import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';

const code = ts.transpileModule(readFileSync(new URL('./index.ts', import.meta.url), 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
}).outputText;
const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const env = { ASSETS: { fetch: async () => new Response('asset') }, CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) } };
const body = { email: 'test@example.com', service: 'other', description: 'Ovo je test opisa novog projekta.' };
const request = (data = body, origin = 'https://dev.bazzium.com') => new Request('https://dev.bazzium.com/api/contact', {
  method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(data),
});
assert.equal((await worker.fetch(request(body, 'https://other.example'), env)).status, 403);
assert.equal((await worker.fetch(request(null), env)).status, 400);
assert.equal((await worker.fetch(request({ ...body, service: '__proto__' }), env)).status, 400);
assert.equal((await worker.fetch(request({ ...body, email: 'bad' }), env)).status, 400);
assert.equal((await worker.fetch(request({ ...body, description: 'a'.repeat(5001) }), env)).status, 400);
assert.equal((await worker.fetch(request({ ...body, description: 'a'.repeat(33000) }), env)).status, 413);
assert.equal((await worker.fetch(request(), env)).status, 503);
assert.equal((await worker.fetch(request(), { ...env, CONTACT_RATE_LIMITER: { limit: async () => ({ success: false }) } })).status, 429);
const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async (_url, options) => {
    const sent = JSON.parse(options.body);
    assert.deepEqual(sent.to, ['dev@bazzium.com']);
    assert.equal(sent.reply_to, body.email);
    assert.match(sent.text, /Drugo/);
    return Response.json({ id: 'mock-email-id' });
  };
  const configured = { ...env, RESEND_API_KEY: 'test-only', RESEND_FROM_EMAIL: 'website@example.com' };
  assert.deepEqual(await (await worker.fetch(request(), configured)).json(), { ok: true });
  for (const [service, label] of Object.entries({
    presentation: 'Sajtovi i landing stranice',
    commerce: 'Online prodavnice',
    applications: 'Web aplikacije i poslovni sistemi',
    integrations: 'Integracije i unapređenja',
  })) {
    globalThis.fetch = async (_url, options) => {
      const sent = JSON.parse(options.body);
      assert.equal(sent.subject, `Bazzium Dev — ${label}`);
      assert.ok(sent.text.includes(`Usluga: ${label}`));
      return Response.json({ id: 'mock-email-id' });
    };
    assert.equal((await worker.fetch(request({ ...body, service }), configured)).status, 200);
  }
  globalThis.fetch = async () => Response.json({ id: 'mock-optional-description' });
  for (const description of ['', 'Kratak opis', undefined]) {
    assert.equal((await worker.fetch(request({ ...body, description }), configured)).status, 200);
  }
  globalThis.fetch = async () => new Response(null, { status: 500 });
  assert.equal((await worker.fetch(request(), configured)).status, 502);
} finally { globalThis.fetch = originalFetch; }
console.log('17 contact checks passed; no real email sent.');

