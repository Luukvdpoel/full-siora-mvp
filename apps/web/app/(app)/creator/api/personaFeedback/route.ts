import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { PersonaProfile } from '@creator/types/persona';
import { callOpenAI, safeJson } from 'shared-utils';

interface FeedbackRequest {
  persona: PersonaProfile;
  rating: number;
  notes?: string;
  tone?: string;
  audience?: string;
  platform?: string;
}

interface FeedbackEntry extends FeedbackRequest {
  id: string;
  timestamp: string;
}

export async function POST(req: Request) {
  try {
    const { persona, rating, notes, tone, audience, platform } = (await req.json()) as FeedbackRequest & {
      tone?: string;
      audience?: string;
      platform?: string;
    };
    if (!persona || typeof persona !== 'object') {
      return NextResponse.json({ error: 'Invalid persona' }, { status: 400 });
    }
    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5 || Number.isNaN(numRating)) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
    }
    const dbPath = path.join(process.cwd(), '..', '..', 'db', 'persona_feedback.json');
    let data: FeedbackEntry[] = [];
    try {
      const file = await fs.readFile(dbPath, 'utf8');
      data = JSON.parse(file);
      if (!Array.isArray(data)) data = [];
    } catch {
      data = [];
    }
    const entry: FeedbackEntry = {
      id: randomUUID(),
      persona,
      rating: numRating,
      notes: notes ?? '',
      timestamp: new Date().toISOString(),
    };
    data.push(entry);
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));

    const messages = [
      {
        role: 'system',
        content: [
          'You are an influencer coach refining creator personas.',
          'Use the feedback and any provided tone, audience or platform info to make improvements.',
          'Respond ONLY with JSON matching the PersonaProfile TypeScript interface: { name: string; personality: string; interests: string[]; summary: string; postingFrequency?: string; toneConfidence?: number; brandFit?: string; growthSuggestions?: string }',
        ].join('\n'),
      },
      {
        role: 'user',
        content: [
          `Existing persona: ${JSON.stringify(persona)}`,
          `Feedback: needs clearer mission`,
          'Tone: professional',
        ].join('\n'),
      },
      {
        role: 'assistant',
        content:
          '{"name":"Sample","personality":"professional","interests":[],"summary":"Refined mission"}',
      },
      {
        role: 'user',
        content: [
          `Existing persona: ${JSON.stringify(persona)}`,
          `Feedback: ${notes ?? ''}`,
          tone ? `Tone: ${tone}` : undefined,
          audience ? `Audience: ${audience}` : undefined,
          platform ? `Platform: ${platform}` : undefined,
        ]
          .filter(Boolean)
          .join('\n'),
      },
    ];

    const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });
    const improved: PersonaProfile = safeJson(content, {} as PersonaProfile);

    return NextResponse.json({ improved });
  } catch (err) {
    console.error('Failed to store feedback', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
