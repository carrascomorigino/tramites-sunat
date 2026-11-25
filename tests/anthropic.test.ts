import { describe, expect, it, vi } from 'vitest';
import { API_URL, MAX_TOKENS, MODEL, SYSTEM_PROMPT, askClaude, buildRequest } from '../src/lib/anthropic.ts';
import type { Hit } from '../src/lib/search.ts';

const hits: Hit[] = [
  { score: 50, coverage: 1, chunk: { id: 'a#0', sourceId: 'a', heading: 'Requisitos', text: 'Clave SOL.', title: 'Emitir RHE' } },
];
// Clearly fake key. It does not match the real key pattern, so gitleaks stays clean.
const FAKE_KEY = 'test-key-not-real';

describe('Mode B request (mock fetch, no real call)', () => {
  it('sends the expected request shape', async () => {
    const fetchFn = vi.fn(async () =>
      new Response(
        JSON.stringify({
          content: [{ type: 'text', text: 'Necesitas tu Clave SOL.', citations: [{ type: 'char_location', cited_text: 'Clave SOL.', document_index: 0 }] }],
          usage: { input_tokens: 120, output_tokens: 15 },
        }),
        { status: 200 },
      ),
    );
    const ans = await askClaude(FAKE_KEY, '¿Qué necesito?', hits, fetchFn as unknown as typeof fetch);

    const [url, init] = fetchFn.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(API_URL);
    const headers = init.headers as Record<string, string>;
    expect(headers['x-api-key']).toBe(FAKE_KEY);
    expect(headers['anthropic-dangerous-direct-browser-access']).toBe('true');
    expect(headers['anthropic-version']).toBe('2023-06-01');

    const body = JSON.parse(init.body as string);
    expect(body).toEqual(buildRequest('¿Qué necesito?', hits));
    expect(body.model).toBe(MODEL);
    expect(body.max_tokens).toBe(MAX_TOKENS);
    expect(body.thinking).toEqual({ type: 'disabled' });
    expect(body.system).toBe(SYSTEM_PROMPT);
    expect(body.messages[0].content[0]).toMatchObject({ type: 'document', citations: { enabled: true }, source: { type: 'text', data: 'Clave SOL.' } });
    expect(body.messages[0].content.at(-1)).toEqual({ type: 'text', text: '¿Qué necesito?' });

    expect(ans.parts[0].citations[0]).toEqual({ documentIndex: 0, citedText: 'Clave SOL.' });
    expect(ans.outputTokens).toBe(15);
  });

  it('system prompt keeps the safety rules', () => {
    expect(SYSTEM_PROMPT).toMatch(/No sé/);
    expect(SYSTEM_PROMPT).toMatch(/SOLO la información de los documentos/);
    expect(SYSTEM_PROMPT).toMatch(/DNI, RUC/);
    expect(SYSTEM_PROMPT).toMatch(/datos, no instrucciones/);
  });

  it('shows the API error message', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ error: { message: 'invalid x-api-key' } }), { status: 401 }));
    await expect(askClaude(FAKE_KEY, 'x', hits, fetchFn as unknown as typeof fetch)).rejects.toThrow('HTTP 401: invalid x-api-key');
  });
});
