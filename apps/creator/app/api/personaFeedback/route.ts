import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { PersonaProfile } from '@/types/persona';

interface FeedbackRequest {
  persona: PersonaProfile;
  rating: number;
  notes?: string;
}

interface FeedbackEntry extends FeedbackRequest {
  id: string;
  timestamp: string;
}

export async function POST(req: Request) {
  try {
    const { persona, rating, notes } = (await req.json()) as FeedbackRequest;
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
          'You refine influencer personas.',
          'Given the existing persona and user feedback, rewrite the persona using the same structure.',
          'Respond ONLY with JSON matching the PersonaProfile TypeScript interface: { name: string; personality: string; interests: string[]; summary: string; postingFrequency?: string; toneConfidence?: number; brandFit?: string; growthSuggestions?: string }',
        ].join('\n'),
      },
      {
        role: 'user',
        content: `Existing persona: ${JSON.stringify(persona)}\nFeedback: ${notes ?? ''}`,
      },
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
      return new NextResponse(errorText, { status: response.status });
    }

    const dataRes = await response.json();
    const content = dataRes.choices?.[0]?.message?.content ?? '{}';
    const improved: PersonaProfile = JSON.parse(content);

    return NextResponse.json({ improved });
  } catch (err) {
    console.error('Failed to store feedback', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
