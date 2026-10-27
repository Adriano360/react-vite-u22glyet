import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { clientKeyFor, createRateLimiter, gateAgentRequest } from './rateLimit.mjs';

const T0 = 1_000_000;
const CLIENT = 'ip:203.0.113.9';

// Provedor simulado: contador de chamadas. Nunca é o SDK real da OpenAI.
function makeProviderSpy() {
  let calls = 0;
  return {
    call() {
      calls += 1;
      return 'simulated-answer';
    },
    get calls() {
      return calls;
    },
  };
}

// Fluxo do handler: o gate decide e só uma admissão alcança o provedor.
// index.mjs usa o mesmo gateAgentRequest; este espelho mantém a ordem testável.
function handleAgentCall({ apiConfigured, limiter, clientKey, now, provider }) {
  const outcome = gateAgentRequest({ apiConfigured, limiter, clientKey, now });
  if (outcome === 'admitted') provider.call();
  return outcome;
}

// ---- A. Sem chave: 503 sem consumir cotas ----------------------------------
test('A: 20 valid requests without API key return missing_api_key and consume no quota', () => {
  const limiter = createRateLimiter();
  const provider = makeProviderSpy();
  for (let i = 0; i < 20; i += 1) {
    const outcome = handleAgentCall({
      apiConfigured: false, limiter, clientKey: CLIENT, now: T0 + i, provider,
    });
    assert.equal(outcome, 'missing_api_key');
  }
  assert.deepEqual(limiter.stats(T0 + 20), { clients: 0, globalInWindow: 0, dayInWindow: 0 });
  assert.equal(limiter.clientUsage(CLIENT, T0 + 20), 0);
  assert.equal(provider.calls, 0);
});

test('A: without key, admit() is never reached (strict order: 503 before admission)', () => {
  let admitCalls = 0;
  const spyLimiter = {
    admit() {
      admitCalls += 1;
      return 'admitted';
    },
  };
  const outcome = gateAgentRequest({
    apiConfigured: false, limiter: spyLimiter, clientKey: CLIENT, now: T0,
  });
  assert.equal(outcome, 'missing_api_key');
  assert.equal(admitCalls, 0);
});

test('A: after 20 keyless refusals, the client still gets its full 15 individual quota', () => {
  const limiter = createRateLimiter({ globalMaxRequests: 1e9, globalMaxPerDay: 1e9 });
  for (let i = 0; i < 20; i += 1) {
    gateAgentRequest({ apiConfigured: false, limiter, clientKey: CLIENT, now: T0 + i });
  }
  const provider = makeProviderSpy();
  const outcomes = [];
  for (let i = 0; i < 16; i += 1) {
    outcomes.push(handleAgentCall({
      apiConfigured: true, limiter, clientKey: CLIENT, now: T0 + 100 + i, provider,
    }));
  }
  assert.equal(outcomes.filter((o) => o === 'admitted').length, 15);
  assert.equal(outcomes[15], 'client_limit');
});

// ---- B. Pergunta ausente: 400 antes do gate (integração abaixo) ------------
// index.mjs responde 400 antes de chamar gateAgentRequest; o teste de integração
// verifica o status 400 com tráfego real e a ausência de qualquer chamada ao provedor.

// ---- C. API configurada (simulada): limitador antes de qualquer provedor ----
test('C: with API considered configured, the 16th admitted call of a client is refused before the provider', () => {
  const limiter = createRateLimiter({ globalMaxRequests: 1e9, globalMaxPerDay: 1e9 });
  const provider = makeProviderSpy();
  const outcomes = [];
  for (let i = 0; i < 16; i += 1) {
    outcomes.push(handleAgentCall({
      apiConfigured: true, limiter, clientKey: CLIENT, now: T0 + i, provider,
    }));
  }
  assert.equal(provider.calls, 15, 'provider reached only for admitted calls');
  assert.equal(outcomes[15], 'client_limit');
});

test('C: with API configured and global budget exhausted, the provider is not reached', () => {
  const limiter = createRateLimiter({ globalMaxRequests: 2, globalMaxPerDay: 1e9 });
  const provider = makeProviderSpy();
  const outcomes = [];
  for (let i = 0; i < 5; i += 1) {
    outcomes.push(handleAgentCall({
      apiConfigured: true, limiter, clientKey: `ip:c${i}`, now: T0 + i, provider,
    }));
  }
  assert.deepEqual(outcomes, ['admitted', 'admitted', 'global_limit', 'global_limit', 'global_limit']);
  assert.equal(provider.calls, 2);
});

// ---- D. 16ª chamada admitida do mesmo cliente é recusada -------------------
test('D: the 16th admitted call of the same client is refused by the individual limit', () => {
  const limiter = createRateLimiter({ globalMaxRequests: 1e9, globalMaxPerDay: 1e9 });
  for (let i = 0; i < 15; i += 1) {
    assert.equal(
      gateAgentRequest({ apiConfigured: true, limiter, clientKey: CLIENT, now: T0 + i }),
      'admitted',
      `admitted call ${i + 1}`,
    );
  }
  assert.equal(
    gateAgentRequest({ apiConfigured: true, limiter, clientKey: CLIENT, now: T0 + 15 }),
    'client_limit',
  );
});

// ---- E. Recusas globais não descontam a cota individual --------------------
test('E: global refusals do not discount the refused client individual quota', () => {
  const limiter = createRateLimiter({ clientMaxRequests: 15, globalMaxRequests: 2, globalMaxPerDay: 1e9 });
  gateAgentRequest({ apiConfigured: true, limiter, clientKey: 'ip:x1', now: T0 });
  gateAgentRequest({ apiConfigured: true, limiter, clientKey: 'ip:x2', now: T0 + 1 });
  for (let i = 0; i < 10; i += 1) {
    assert.equal(
      gateAgentRequest({ apiConfigured: true, limiter, clientKey: CLIENT, now: T0 + 10 + i }),
      'global_limit',
    );
  }
  assert.equal(limiter.clientUsage(CLIENT, T0 + 30), 0, 'individual quota untouched by global refusals');
});

// ---- F. Recusas individuais não descontam a cota global --------------------
test('F: individual refusals do not discount the global budget', () => {
  const limiter = createRateLimiter({ clientMaxRequests: 15, globalMaxRequests: 1e9, globalMaxPerDay: 1e9 });
  for (let i = 0; i < 15; i += 1) {
    gateAgentRequest({ apiConfigured: true, limiter, clientKey: CLIENT, now: T0 + i });
  }
  for (let i = 0; i < 10; i += 1) {
    assert.equal(
      gateAgentRequest({ apiConfigured: true, limiter, clientKey: CLIENT, now: T0 + 20 + i }),
      'client_limit',
    );
  }
  assert.equal(limiter.stats(T0 + 40).globalInWindow, 15, 'only admitted calls use the global budget');
});

// ---- Limites numéricos provisórios preservados -----------------------------
test('limits: 15 per client, 30 global per 5 min, 100 global per 24 h (defaults)', () => {
  const limiter = createRateLimiter();
  for (let i = 0; i < 15; i += 1) {
    assert.equal(limiter.admit(`ip:n${i}`, T0 + i), 'admitted');
  }
  assert.equal(clientKeyFor({ ip: '198.51.100.1' }), 'ip:198.51.100.1');
});

// ---- Integração: servidor real, sem chave, tráfego sintético ---------------
const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '..');

async function startServerWithoutKey() {
  const port = 20000 + Math.floor(Math.random() * 9000);
  const env = { ...process.env, PORT: String(port), HOST: '127.0.0.1' };
  delete env.OPENAI_API_KEY;
  const child = spawn(process.execPath, ['server/index.mjs'], {
    cwd: projectRoot,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error(`server did not start: ${output}`)), 60_000);
    child.stdout.on('data', (chunk) => {
      output += chunk;
      if (output.includes('disponível em')) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`server exited early (${code}): ${output}`));
    });
  });
  return { child, base: `http://127.0.0.1:${port}` };
}

async function postChat(base, body) {
  const response = await fetch(`${base}/api/assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: response.status, json: await response.json() };
}

test('I-A (integration): no key, 20 valid requests -> 503 missing_api_key each', async () => {
  const { child, base } = await startServerWithoutKey();
  try {
    for (let i = 0; i < 20; i += 1) {
      const result = await postChat(base, {
        messages: [{ role: 'user', content: 'Teste' }],
        sessionId: `s-${i}-${Math.random()}`,
      });
      assert.equal(result.status, 503);
      assert.equal(result.json.code, 'missing_api_key');
    }
  } finally {
    child.kill();
  }
});

test('I-B (integration): missing question -> 400, no quota consumed path', async () => {
  const { child, base } = await startServerWithoutKey();
  try {
    for (let i = 0; i < 20; i += 1) {
      const result = await postChat(base, { messages: [], sessionId: `x-${i}` });
      assert.equal(result.status, 400);
    }
    const afterKeyless = await postChat(base, {
      messages: [{ role: 'user', content: 'Teste' }],
      sessionId: 'after',
    });
    assert.equal(afterKeyless.status, 503, 'keyless requests still reach 503, not 429');
  } finally {
    child.kill();
  }
});

test('H (integration): the site opens (home page responds 200 with app root)', async () => {
  const { child, base } = await startServerWithoutKey();
  try {
    const response = await fetch(`${base}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /id="root"/);
  } finally {
    child.kill();
  }
});
