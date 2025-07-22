import { generateNegotiationPrompt } from 'shared-utils';

export async function POST(req: Request) {
  try {
    const { brand, creator, offer } = await req.json();
    if (!brand || !creator || !offer) {
      return new Response(
        JSON.stringify({ error: 'brand, creator and offer are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const message = await generateNegotiationPrompt({
      brand,
      creator,
      currentOffer: offer,
    });

    return new Response(JSON.stringify({ message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unexpected error';
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: msg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
