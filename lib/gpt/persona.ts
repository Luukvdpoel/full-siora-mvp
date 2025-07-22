import { callOpenAI, safeJson } from 'shared-utils';

export interface PersonaPrompt {
  captions: string[];
  tone?: string;
  audience?: string;
  platform?: string;
  previousCampaigns?: string[];
}

export interface PersonaProfile {
  name: string;
  personality: string;
  interests: string[];
  summary: string;
}

function buildSystemPrompt(data: PersonaPrompt) {
  const lines = [
    'You analyze influencer content and craft concise persona summaries.',
    'Respond ONLY with JSON matching { name: string; personality: string; interests: string[]; summary: string }.'
  ];
  if (data.tone) lines.push(`Creator prefers a ${data.tone} tone.`);
  if (data.previousCampaigns && data.previousCampaigns.length)
    lines.push(`Past campaigns include: ${data.previousCampaigns.join(', ')}`);
  return lines.join('\n');
}

function buildUserMessage(data: PersonaPrompt) {
  return [
    data.captions.join('\n'),
    data.audience ? `Audience: ${data.audience}` : undefined,
    data.platform ? `Platform: ${data.platform}` : undefined
  ]
    .filter(Boolean)
    .join('\n');
}

export async function generatePersona(data: PersonaPrompt): Promise<PersonaProfile> {
  const messages = [
    { role: 'system', content: buildSystemPrompt(data) },
    { role: 'user', content: 'I love fitness tips!\nTone hint: energetic' },
    { role: 'assistant', content: '{"name":"FitFan","personality":"upbeat","interests":["fitness"],"summary":"Shares energetic workout advice"}' },
    { role: 'user', content: buildUserMessage(data) }
  ];

  const content = await callOpenAI({ messages, temperature: 0.7, fallback: '{}' });
  return safeJson(content, {} as PersonaProfile);
}
