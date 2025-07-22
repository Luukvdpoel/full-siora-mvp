export interface ChatCompletionParams {
  messages: { role: string; content: string }[];
  model?: string;
  temperature?: number;
  maxRetries?: number;
  fallback?: string;
}

export async function callOpenAI({
  messages,
  model = 'gpt-4',
  temperature = 0.7,
  maxRetries = 2,
  fallback,
}: ChatCompletionParams): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
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

export async function getEmbedding(text: string, model = 'text-embedding-ada-002'): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ input: text, model }),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const data = await res.json();
  return data.data[0].embedding as number[];
}
