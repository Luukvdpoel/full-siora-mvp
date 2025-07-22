import { promises as fs } from 'fs';
import path from 'path';

interface FeedbackSummary {
  overallTone: string;
  collaborationHighlights: string;
  thingsToImprove: string;
}

const DB_PATH = path.join(process.cwd(), '..', '..', 'db', 'feedback.json');

async function readData() {
  try {
    const file = await fs.readFile(DB_PATH, 'utf8');
    const data = JSON.parse(file);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeData(data: any[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function POST(req: Request) {
  try {
    const { id, text } = await req.json();
    if (!id || !text) {
      return new Response(
        JSON.stringify({ error: 'id and text required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = [
      {
        role: 'system',
        content: [
          'You summarize user feedback about collaborations.',
          'Return ONLY JSON matching this TypeScript interface:',
          '{ overallTone: string; collaborationHighlights: string; thingsToImprove: string }',
        ].join('\n'),
      },
      { role: 'user', content: text },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model: 'gpt-4', messages, temperature: 0.7 }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: 'OpenAI error', details: errorText }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? '{}';
    const summary: FeedbackSummary = JSON.parse(content);

    const db = await readData();
    const idx = db.findIndex((f: any) => f.id === id);
    if (idx !== -1) {
      db[idx].summary = summary;
      await writeData(db);
    }

    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    console.error('feedback summary error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
