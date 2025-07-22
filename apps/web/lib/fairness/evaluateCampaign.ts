import { callOpenAI, safeJson } from 'shared-utils';

export interface CampaignDetails {
  name?: string;
  description?: string;
  deliverables?: string;
  compensation?: string;
}

export interface FairnessResult {
  fair: boolean;
  concerns: string[];
}

export async function evaluateCampaign(
  campaign: CampaignDetails
): Promise<FairnessResult> {
  const summary = [
    campaign.description ? `Description: ${campaign.description}` : undefined,
    campaign.deliverables ? `Deliverables: ${campaign.deliverables}` : undefined,
    campaign.compensation ? `Compensation: ${campaign.compensation}` : undefined,
  ]
    .filter(Boolean)
    .join('\n');

  const messages = [
    {
      role: 'system',
      content: [
        'You assess if influencer campaign offers are fair to creators.',
        'Consider if payment is adequate and deliverables reasonable.',
        'Return ONLY JSON matching this TypeScript interface:',
        '{ fair: boolean; concerns: string[] }',
        'Mark fair=false if compensation is too low or expectations unrealistic.',
      ].join('\n'),
    },
    { role: 'user', content: summary },
  ];

  const content = await callOpenAI({ messages, temperature: 0.2, fallback: '{"fair":true,"concerns":[]}' });
  return safeJson<FairnessResult>(content, { fair: true, concerns: [] });
}
