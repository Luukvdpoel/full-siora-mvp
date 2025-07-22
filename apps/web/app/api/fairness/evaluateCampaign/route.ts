import { evaluateCampaign } from '@/lib/fairness/evaluateCampaign';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await evaluateCampaign(body);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    console.error('fairness evaluate error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
