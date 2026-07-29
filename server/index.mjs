import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import express from 'express';
import OpenAI from 'openai';
import { createServer as createViteServer } from 'vite';

const app = express();
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..');
const localEnvPath = path.join(projectRoot, '.env');

if (!process.env.OPENAI_API_KEY && fs.existsSync(localEnvPath)) {
  loadEnvFile(localEnvPath);
}

const isProduction = process.argv.includes('--production');
const port = Number(process.env.PORT) || 5173;
const host = process.env.HOST || '0.0.0.0';
const rateLimits = new Map();

const AGENT_INSTRUCTIONS = `
Você é o Agente Light+, assistente educativo de um curso brasileiro para mantenedores de subestações.

Responda em português do Brasil, com clareza, tom de professor experiente e explicações adequadas a alunos de manutenção elétrica.

Você pode responder:
- perguntas sobre o conteúdo do curso Light+;
- dúvidas gerais sobre subestações, equipamentos, proteção, controle e automatismos;
- conceitos de relés, transformadores, disjuntores, TCs, TPs, diagramas e segurança.

Limites obrigatórios:
- Trate toda resposta como conteúdo educativo, nunca como autorização operacional.
- Não determine nem invente uma sequência de manobra para uma instalação real.
- Se faltarem diagrama, procedimento, identificação do equipamento, estado operativo ou regra local, diga exatamente qual informação falta.
- Para intervenção ou manobra real, oriente o aluno a seguir o procedimento oficial, o diagrama atualizado, a análise de risco e a orientação do despacho/supervisão.
- Não invente códigos, números de disjuntores, ajustes, intertravamentos ou estados de equipamentos.
- Quando houver conteúdo do curso no contexto fornecido, priorize-o e diferencie claramente informação do curso de conhecimento geral.
- Se não souber, diga que não tem dados suficientes.

Estilo:
- Comece pela resposta direta.
- Explique siglas na primeira ocorrência.
- Use passos ou tópicos somente quando melhorarem a compreensão.
- Seja conciso, mas preserve alertas técnicos importantes.
`.trim();

function loadCourseChunks() {
  try {
    const sourcePath = path.join(
      projectRoot,
      'src',
      'data',
      'cenariosProtecao.js'
    );
    const source = fs.readFileSync(sourcePath, 'utf8');

    return source
      .split(/\n  \{\n    id:/)
      .slice(1)
      .map((chunk, index) => `Cenário ${index + 1}:\n${chunk}`)
      .filter((chunk) => chunk.length > 80);
  } catch {
    return [];
  }
}

const courseChunks = loadCourseChunks();

function normalizeText(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function findCourseContext(question) {
  const terms = [...new Set(
    normalizeText(question)
      .split(/[^a-z0-9.-]+/)
      .filter((term) => term.length >= 2)
      .filter((term) => ![
        'ao',
        'aos',
        'como',
        'da',
        'das',
        'de',
        'do',
        'dos',
        'em',
        'para',
        'por',
        'qual',
        'quais',
        'que',
        'uma',
        'sobre',
        'funciona',
      ].includes(term))
  )];

  if (!terms.length) return '';

  const matches = courseChunks
    .map((chunk) => {
      const normalizedChunk = normalizeText(chunk);
      const score = terms.reduce(
        (total, term) => total + (normalizedChunk.includes(term) ? 1 : 0),
        0
      );
      return { chunk, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ chunk }) => chunk.slice(0, 2600));

  return matches.join('\n\n---\n\n').slice(0, 7000);
}

function sanitizeMessages(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (message) =>
        ['user', 'assistant'].includes(message?.role) &&
        typeof message?.content === 'string'
    )
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 4000),
    }))
    .filter((message) => message.content)
    .slice(-10);
}

function getSafetyIdentifier(sessionId = '') {
  const digest = crypto
    .createHash('sha256')
    .update(String(sessionId).slice(0, 200))
    .digest('hex')
    .slice(0, 32);

  return `light_plus_${digest}`;
}

function isRateLimited(identifier) {
  const now = Date.now();
  const windowDuration = 5 * 60 * 1000;
  const maxRequests = 15;
  const existing = rateLimits.get(identifier);

  if (!existing || now - existing.startedAt > windowDuration) {
    rateLimits.set(identifier, { startedAt: now, count: 1 });
    return false;
  }

  existing.count += 1;
  return existing.count > maxRequests;
}

function hasConfiguredApiKey() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  return Boolean(
    apiKey &&
      apiKey !== 'cole_sua_chave_aqui' &&
      apiKey.startsWith('sk-')
  );
}

function getPublicAgentError(error) {
  const status = Number(error?.status);
  const errorCode = error?.code || error?.error?.code;

  if (status === 401) {
    return {
      status: 503,
      code: 'invalid_api_key',
      message:
        'A chave da IA não foi aceita. Verifique a OPENAI_API_KEY configurada no servidor.',
    };
  }

  if (status === 403 || status === 404) {
    return {
      status: 503,
      code: 'model_unavailable',
      message:
        'O modelo do Agente Light+ não está disponível para este projeto da OpenAI. Verifique a permissão e a variável OPENAI_MODEL.',
    };
  }

  if (status === 429 || errorCode === 'insufficient_quota') {
    return {
      status: 503,
      code: 'openai_limit',
      message:
        'O limite de uso da IA foi atingido. Verifique os créditos e os limites do projeto da OpenAI.',
    };
  }

  return {
    status: 502,
    code: 'agent_unavailable',
    message:
      'O Agente Light+ não conseguiu responder agora. Verifique a conexão do servidor e tente novamente.',
  };
}

app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));

app.get('/api/assistant/status', (_request, response) => {
  response.json({ configured: hasConfiguredApiKey() });
});

app.post('/api/assistant', async (request, response) => {
  const messages = sanitizeMessages(request.body?.messages);
  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === 'user');

  if (!lastUserMessage) {
    return response.status(400).json({
      message: 'Digite uma pergunta para conversar com o Agente Light+.',
    });
  }

  const safetyIdentifier = getSafetyIdentifier(
    request.body?.sessionId || request.ip
  );

  if (isRateLimited(safetyIdentifier)) {
    return response.status(429).json({
      message:
        'Muitas perguntas foram enviadas em pouco tempo. Aguarde alguns minutos e tente novamente.',
    });
  }

  if (!hasConfiguredApiKey()) {
    return response.status(503).json({
      code: 'missing_api_key',
      message:
        'O Agente Light+ ainda precisa da chave de IA no servidor. Configure OPENAI_API_KEY para ativar as respostas.',
    });
  }

  const courseContext = findCourseContext(lastUserMessage.content);
  const studentName =
    typeof request.body?.studentName === 'string'
      ? request.body.studentName.trim().slice(0, 80)
      : '';

  const contextMessage = [
    studentName ? `Nome do aluno: ${studentName}.` : '',
    courseContext
      ? `Trechos relevantes do curso Light+:\n${courseContext}`
      : 'Nenhum trecho específico do curso foi encontrado para esta pergunta. Responda com conhecimento geral e deixe essa origem clara.',
  ]
    .filter(Boolean)
    .join('\n\n');

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 1,
      timeout: 30_000,
    });
    const modelResponse = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.6-terra',
      instructions: AGENT_INSTRUCTIONS,
      input: [
        { role: 'developer', content: contextMessage },
        ...messages,
      ],
      reasoning: { effort: 'low' },
      text: { verbosity: 'medium' },
      max_output_tokens: 900,
      safety_identifier: safetyIdentifier,
    });

    const answer = modelResponse.output_text?.trim();

    if (!answer) {
      throw new Error('Empty model response');
    }

    return response.json({ answer });
  } catch (error) {
    console.error('Agent request failed:', error?.status || error?.name || 'error');
    const publicError = getPublicAgentError(error);

    return response.status(publicError.status).json({
      code: publicError.code,
      message: publicError.message,
    });
  }
});

if (isProduction) {
  const distPath = path.join(projectRoot, 'dist');
  app.use(express.static(distPath));
  app.use((_request, response) => {
    response.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  const vite = await createViteServer({
    root: projectRoot,
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(port, host, () => {
  console.log(`Light+ disponível em http://${host}:${port}`);
});
