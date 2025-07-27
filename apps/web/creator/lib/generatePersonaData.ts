import type { PersonaProfile } from '@creator/types/persona';

export interface PersonaInput {
  captions: string[];
  tone?: string;
  audience?: string;
  platform?: string;
}

export async function generatePersonaData(input: PersonaInput): Promise<PersonaProfile | null> {
  try {
    const res = await fetch('/creator/api/generatePersona', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate');
    }
    return data as PersonaProfile;
  } catch (err) {
    console.error('generatePersonaData error:', err);
    return null;
  }
}
