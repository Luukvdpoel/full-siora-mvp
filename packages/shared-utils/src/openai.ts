export interface ChatCompletionParams {
  messages: { role: string; content: string }[];
  model?: string;
  temperature?: number;
  maxRetries?: number;
  fallback?: string;
}

const cache = new Map<string, { ts: number; value: string }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const callTimestamps: number[] = [];
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_CALLS_PER_WINDOW = 60;

function registerCall() {
  const now = Date.now();
  callTimestamps.push(now);
  while (callTimestamps.length && now - callTimestamps[0] > WINDOW_MS) {
    callTimestamps.shift();
  }
  return callTimestamps.length <= MAX_CALLS_PER_WINDOW;
}

export async function callOpenAI({
  messages,
  model = 'gpt-4',
  temperature = 0.7,
  maxRetries = 2,
  fallback,
}: ChatCompletionParams): Promise<string> {
  const key = JSON.stringify({ model, messages, temperature });
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.value;
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (!registerCall()) {
        await new Promise(res => setTimeout(res, 1000));
      }
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ model, messages, temperature }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content ?? '';
      cache.set(key, { ts: Date.now(), value: content });
      logPromptResponse(messages, content);
      return content;
    } catch (err) {
      lastError = err;
    }
  }
  console.error('OpenAI call failed', lastError);
  if (fallback !== undefined) return fallback;
  throw lastError;
}

export function safeJson<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function getEmbedding(
  input: string,
  model = 'text-embedding-ada-002'
): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ input, model }),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const data = await res.json();
  const vector = (data.data?.[0]?.embedding ?? []) as number[];
  logEmbedding(input.length);
  return vector;
}

async function logPromptResponse(messages: any, content: string) {
  const key = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST;
  if (!key || !host) return;
  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, event: 'gpt_interaction', properties: { messages, content } }),
    });
  } catch {}
}

async function logEmbedding(length: number) {
  const key = process.env.POSTHOG_API_KEY;
  const host = process.env.POSTHOG_HOST;
  if (!key || !host) return;
  try {
    await fetch(`${host}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, event: 'embedding_generated', properties: { length } }),
    });
  } catch {}
}
