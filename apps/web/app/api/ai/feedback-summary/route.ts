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

import { callOpenAI, safeJson } from 'shared-utils';

export async function POST(req: Request) {
  try {
    const { id, text, role, tone, audience, platform } = await req.json();
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
          'You are a professional community manager summarizing collaboration feedback.',
          role === 'creator'
            ? 'Provide guidance for creators working with brands.'
            : role === 'brand'
            ? 'Provide guidance for brands working with creators.'
            : 'Offer balanced advice for both parties.',
          'Include tone, audience or platform insights when supplied.',
          'Return ONLY JSON matching this TypeScript interface:',
          '{ overallTone: string; collaborationHighlights: string; thingsToImprove: string }',
        ].join('\n'),
      },
      {
        role: 'user',
        content: [
          'Feedback: Great collab but response times were slow.',
          'Tone: casual',
          'Audience: fitness lovers',
          'Platform: Instagram',
        ].join('\n'),
      },
      {
        role: 'assistant',
        content:
          '{"overallTone":"positive","collaborationHighlights":"Great collab","thingsToImprove":"Faster replies"}',
      },
      {
        role: 'user',
        content: [
          `Feedback: ${text}`,
          tone ? `Tone: ${tone}` : undefined,
          audience ? `Audience: ${audience}` : undefined,
          platform ? `Platform: ${platform}` : undefined,
        ]
          .filter(Boolean)
          .join('\n'),
      },
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });
    const summary: FeedbackSummary = safeJson(content, { overallTone: '', collaborationHighlights: '', thingsToImprove: '' });

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
