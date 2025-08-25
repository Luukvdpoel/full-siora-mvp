import fs from 'fs/promises';
import path from 'path';
import type { PitchResult } from "@creator/types/pitch";
import { callOpenAI } from 'shared-utils';

export async function POST(req: Request) {
  try {
    const { creatorId, persona } = await req.json();
    let data: any = persona;

    if (!data && creatorId) {
      const file = path.join(process.cwd(), 'db', 'personas.json');
      const content = await fs.readFile(file, 'utf8');
      const list = JSON.parse(content);
      data = list.find((p: any) => p.id === creatorId || p.id === Number(creatorId));
      if (!data) {
        return new Response(
          JSON.stringify({ error: 'Creator not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    if (!data || typeof data !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Persona data is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const messages = [
      {
        role: 'system',
        content: [
          'You craft short brand partnership pitches from the creator\'s point of view.',
          'Respond in Markdown with clear sections:',
          'Intro line, What makes me unique, My audience, Why I\'m a great fit for your brand, CTA to connect or collab.',
        ].join('\n'),
      },
      { role: 'user', content: JSON.stringify(data) },
    ];

    const content = await callOpenAI({ messages, temperature: 0.8, fallback: '' });
    const pitch: PitchResult = { pitch: content };

    return new Response(JSON.stringify(pitch), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
