import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clientKeyFor, createRateLimiter } from './rateLimit.mjs';

const MIN = 60 * 1000;
const FIVE = 5 * MIN;
const DAY = 24 * 60 * MIN;
const T0 = 1_000_000;

// ---- A. Limite individual atingido: o global permanece intacto -------------
test('A: client limit reached does not consume global budget', () => {
  const rl = createRateLimiter({ clientMaxRequests: 2, globalMaxRequests: 10, globalMaxPerDay: 100 });
  assert.equal(rl.admit('ip:A', T0), 'admitted');
  assert.equal(rl.admit('ip:A', T0 + 1), 'admitted');
  assert.equal(rl.admit('ip:A', T0 + 2), 'client_limit');
  assert.equal(rl.admit('ip:A', T0 + 3), 'client_limit');
  assert.deepEqual(rl.stats(T0 + 3), { clients: 1, globalInWindow: 2, dayInWindow: 2 });
});

// ---- B. Limite global atingido: o individual permanece intacto -------------
test('B: global limit reached does not consume the refused client quota', () => {
  const rl = createRateLimiter({ globalMaxRequests: 1, globalMaxPerDay: 100 });
  assert.equal(rl.admit('ip:A', T0), 'admitted');
  assert.equal(rl.admit('ip:B', T0 + 1), 'global_limit');
  assert.equal(rl.admit('ip:B', T0 + 2), 'global_limit');
  assert.equal(rl.clientUsage('ip:B', T0 + 2), 0, 'B quota untouched');
  assert.equal(rl.stats(T0 + 2).clients, 1, 'only A has a client entry');
});

// ---- C. B bloqueado pelo global; após liberação usa a cota própria --------
test('C: after global frees, B still has its full individual quota', () => {
  const rl = createRateLimiter({ clientMaxRequests: 15, globalMaxRequests: 15, globalMaxPerDay: 1000 });
  // 15 clientes distintos lotam o global no mesmo intervalo.
  for (let i = 0; i < 15; i += 1) {
    assert.equal(rl.admit(`ip:c${i}`, T0 + i), 'admitted');
  }
  // B é recusado pelo global 15 vezes; nenhuma recusa consome cota de B.
  for (let i = 0; i < 15; i += 1) {
    assert.equal(rl.admit('ip:B', T0 + 100 + i), 'global_limit');
  }
  assert.equal(rl.clientUsage('ip:B', T0 + 115), 0);

  // Depois da liberação global (todas as entradas expiraram), B tem as 15 chamadas próprias.
  const later = T0 + FIVE + 100;
  for (let i = 0; i < 15; i += 1) {
    assert.equal(rl.admit('ip:B', later + i), 'admitted', `B admitted ${i + 1}`);
  }
  assert.equal(rl.admit('ip:B', later + 15), 'client_limit', 'B now limited by its own quota');
});

// ---- D. Chamadas admitidas: ambos os contadores aumentam ------------------
test('D: admitted calls increase both client and global counters', () => {
  const rl = createRateLimiter();
  assert.equal(rl.admit('ip:A', T0), 'admitted');
  assert.equal(rl.clientUsage('ip:A', T0), 1);
  assert.equal(rl.stats(T0).globalInWindow, 1);
  assert.equal(rl.stats(T0).dayInWindow, 1);

  assert.equal(rl.admit('ip:A', T0 + 1), 'admitted');
  assert.equal(rl.clientUsage('ip:A', T0 + 1), 2);
  assert.equal(rl.stats(T0 + 1).globalInWindow, 2);
  assert.equal(rl.stats(T0 + 1).dayInWindow, 2);
});

// ---- E. Limites exatos de 15, 30 e 100 ------------------------------------
test('E1: exactly 15 per client per window (default), 16th refused', () => {
  const rl = createRateLimiter({ globalMaxRequests: 1e9, globalMaxPerDay: 1e9 });
  for (let i = 0; i < 15; i += 1) assert.equal(rl.admit('ip:A', T0 + i), 'admitted', `call ${i + 1}`);
  assert.equal(rl.admit('ip:A', T0 + 15), 'client_limit');
});

test('E2: exactly 30 global per 5 minutes (default), 31st refused', () => {
  const rl = createRateLimiter({ globalMaxPerDay: 1e9 });
  for (let i = 0; i < 30; i += 1) assert.equal(rl.admit(`ip:c${i}`, T0 + i), 'admitted', `call ${i + 1}`);
  assert.equal(rl.admit('ip:c30', T0 + 30), 'global_limit');
});

test('E3: exactly 100 global per day (default), 101st refused', () => {
  const rl = createRateLimiter({ globalMaxRequests: 1e9 });
  for (let i = 0; i < 100; i += 1) {
    assert.equal(rl.admit(`ip:c${i}`, T0 + i * 10 * MIN), 'admitted', `call ${i + 1}`);
  }
  assert.equal(rl.admit('ip:c100', T0 + 100 * 10 * MIN), 'global_limit');
});

// ---- F. Expiração nas fronteiras das janelas ------------------------------
test('F1: client window boundary is inclusive at 5 min and resets after', () => {
  const rl = createRateLimiter({ clientMaxRequests: 1, globalMaxRequests: 1e9, globalMaxPerDay: 1e9 });
  assert.equal(rl.admit('ip:A', T0), 'admitted');
  assert.equal(rl.admit('ip:A', T0 + FIVE), 'client_limit', 'exactly 5 min is still inside');
  assert.equal(rl.admit('ip:A', T0 + FIVE + 1), 'admitted', 'after 5 min window resets');
  assert.equal(rl.clientUsage('ip:A', T0 + FIVE + 1), 1);
});

test('F2: global minute window boundary is inclusive at 5 min', () => {
  const rl = createRateLimiter({ globalMaxRequests: 1, globalMaxPerDay: 1e9 });
  assert.equal(rl.admit('ip:x', T0), 'admitted');
  assert.equal(rl.admit('ip:y', T0 + FIVE), 'global_limit', 'exactly 5 min still counts');
  assert.equal(rl.admit('ip:y', T0 + FIVE + 1), 'admitted', 'expired after 5 min');
});

test('F3: global day window boundary is inclusive at 24 h', () => {
  const rl = createRateLimiter({ globalMaxRequests: 1e9, globalMaxPerDay: 1 });
  assert.equal(rl.admit('ip:x', T0), 'admitted');
  assert.equal(rl.admit('ip:y', T0 + DAY), 'global_limit', 'exactly 24 h still counts');
  assert.equal(rl.admit('ip:y', T0 + DAY + 1), 'admitted', 'expired after 24 h');
});

test('F4: sweep removes expired client entries and keeps active ones', () => {
  const rl = createRateLimiter();
  rl.admit('ip:a', T0);
  rl.admit('ip:b', T0 + 4 * MIN);
  assert.equal(rl.sweep(T0 + FIVE + 1), 1, 'only ip:a expired');
  assert.equal(rl.stats(T0 + FIVE + 1).clients, 1);
});

// ---- G. sessionId não contorna o limite individual ------------------------
test('G: client key ignores sessionId sent in the body', () => {
  const a = clientKeyFor({ ip: '203.0.113.7', body: { sessionId: 'sess-1' } });
  const b = clientKeyFor({ ip: '203.0.113.7', body: { sessionId: 'sess-2' } });
  const c = clientKeyFor({ ip: '203.0.113.7' });
  assert.equal(a, b);
  assert.equal(a, c);
  assert.equal(a, 'ip:203.0.113.7');
});

test('G: many sessionIds from the same IP share one individual quota', () => {
  const rl = createRateLimiter({ clientMaxRequests: 15, globalMaxRequests: 1e9, globalMaxPerDay: 1e9 });
  let admitted = 0;
  for (let i = 0; i < 20; i += 1) {
    const key = clientKeyFor({ ip: '203.0.113.7', body: { sessionId: `s-${i}` } });
    if (rl.admit(key, T0 + i) === 'admitted') admitted += 1;
  }
  assert.equal(admitted, 15);
});

test('G: keys without an IP fall back to a shared unknown key, not to sessionId', () => {
  assert.equal(clientKeyFor({ body: { sessionId: 'x' } }), 'ip:unknown');
  assert.equal(clientKeyFor(undefined), 'ip:unknown');
});

// ---- H. Chamadas recusadas repetidamente não aumentam nenhum contador ----
test('H1: repeated client-limit refusals leave all counters unchanged', () => {
  const rl = createRateLimiter({ clientMaxRequests: 15, globalMaxRequests: 1e9, globalMaxPerDay: 1e9 });
  for (let i = 0; i < 15; i += 1) rl.admit('ip:A', T0 + i);
  const before = { usage: rl.clientUsage('ip:A', T0 + 20), stats: rl.stats(T0 + 20) };
  for (let i = 0; i < 100; i += 1) assert.equal(rl.admit('ip:A', T0 + 20 + i), 'client_limit');
  assert.equal(rl.clientUsage('ip:A', T0 + 200), before.usage);
  assert.deepEqual(rl.stats(T0 + 200), before.stats);
});

test('H2: repeated global-limit refusals leave all counters unchanged', () => {
  const rl = createRateLimiter({ globalMaxRequests: 1, globalMaxPerDay: 100 });
  rl.admit('ip:A', T0);
  const before = rl.stats(T0 + 10);
  for (let i = 0; i < 100; i += 1) assert.equal(rl.admit(`ip:n${i}`, T0 + 10 + i), 'global_limit');
  assert.deepEqual(rl.stats(T0 + 200), before);
  assert.equal(rl.clientUsage('ip:n0', T0 + 200), 0);
});

// ---- Reinício zera a memória (documentado) --------------------------------
test('restart resets memory (documented limitation)', () => {
  const first = createRateLimiter({ clientMaxRequests: 1 });
  first.admit('ip:a', T0);
  assert.equal(first.admit('ip:a', T0 + 1), 'client_limit');

  const restarted = createRateLimiter({ clientMaxRequests: 1 });
  assert.equal(restarted.admit('ip:a', T0 + 2), 'admitted', 'new process has no memory');
});
