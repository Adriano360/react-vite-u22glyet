// Controle de chamadas do Agente Light+, mantido em memória.
//
// Limites deste módulo NÃO garantem orçamento financeiro:
// - reiniciar o processo zera todos os contadores;
// - múltiplos processos ou instâncias não compartilham contadores;
// - o limite por cliente depende do IP visto pelo servidor (request.ip).
// Para teto de gasto real, configure limite e alertas no projeto da OpenAI.

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Chave do cliente derivada só do IP visto pelo servidor.
// Não recebe sessionId nem qualquer campo do corpo da requisição.
export function clientKeyFor(request) {
  return `ip:${request?.ip || 'unknown'}`;
}

// Decide a admissão de uma requisição ao Agente.
// Sem chave configurada, retorna 'missing_api_key' sem tocar em nenhuma cota.
// Com chave configurada, delega à admissão única do limitador.
export function gateAgentRequest({ apiConfigured, limiter, clientKey, now }) {
  if (!apiConfigured) return 'missing_api_key';
  return limiter.admit(clientKey, now);
}

// Mantém somente os instantes ainda dentro da janela. A lista é crescente.
function pruneTimestamps(timestamps, windowMs, now) {
  let first = 0;
  while (first < timestamps.length && now - timestamps[first] > windowMs) {
    first += 1;
  }
  return first === 0 ? timestamps : timestamps.slice(first);
}

export function createRateLimiter({
  clientWindowMs = FIVE_MINUTES_MS,
  clientMaxRequests = 15,
  globalWindowMs = FIVE_MINUTES_MS,
  globalMaxRequests = 30,
  dayWindowMs = ONE_DAY_MS,
  globalMaxPerDay = 100,
} = {}) {
  const clients = new Map();
  let globalTimes = [];
  let dayTimes = [];

  // Admissão única e síncrona.
  // 1) Confere a cota do cliente sem incrementá-la.
  // 2) Confere as cotas globais (minuto e dia) sem consumi-las.
  // 3) Só se ambas permitirem, consome as duas.
  // Retorna 'admitted', 'client_limit' ou 'global_limit'.
  // Chamadas recusadas não alteram nenhum contador.
  function admit(key, now = Date.now()) {
    const entry = clients.get(key);
    const clientActive = Boolean(entry) && now - entry.startedAt <= clientWindowMs;

    if (clientActive && entry.count >= clientMaxRequests) {
      return 'client_limit';
    }

    globalTimes = pruneTimestamps(globalTimes, globalWindowMs, now);
    dayTimes = pruneTimestamps(dayTimes, dayWindowMs, now);

    if (globalTimes.length >= globalMaxRequests || dayTimes.length >= globalMaxPerDay) {
      return 'global_limit';
    }

    if (clientActive) {
      entry.count += 1;
    } else {
      clients.set(key, { startedAt: now, count: 1 });
    }
    globalTimes.push(now);
    dayTimes.push(now);

    return 'admitted';
  }

  // Uso admitido do cliente na janela atual (0 se não houver janela ativa).
  function clientUsage(key, now = Date.now()) {
    const entry = clients.get(key);
    return entry && now - entry.startedAt <= clientWindowMs ? entry.count : 0;
  }

  // Remove clientes com janela expirada e instantes globais fora da janela.
  // Retorna quantos clientes foram removidos.
  function sweep(now = Date.now()) {
    let removed = 0;

    for (const [key, entry] of clients) {
      if (now - entry.startedAt > clientWindowMs) {
        clients.delete(key);
        removed += 1;
      }
    }

    globalTimes = pruneTimestamps(globalTimes, globalWindowMs, now);
    dayTimes = pruneTimestamps(dayTimes, dayWindowMs, now);

    return removed;
  }

  function stats(now = Date.now()) {
    globalTimes = pruneTimestamps(globalTimes, globalWindowMs, now);
    dayTimes = pruneTimestamps(dayTimes, dayWindowMs, now);

    return {
      clients: clients.size,
      globalInWindow: globalTimes.length,
      dayInWindow: dayTimes.length,
    };
  }

  return { admit, clientUsage, sweep, stats };
}
