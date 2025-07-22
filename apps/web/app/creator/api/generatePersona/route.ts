import { safeJson } from 'shared-utils';
import { generatePersona } from '../../../../../../lib/gpt';

export async function POST(req: Request) {
  try {
    const { captions, tone, audience, platform } = await req.json();

    // Validate that captions is an array of strings
    if (!Array.isArray(captions) || !captions.every((c) => typeof c === "string")) {
      return new Response(
        JSON.stringify({ error: "Invalid input: captions must be an array of strings." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const persona = await generatePersona({ captions, tone, audience, platform });

    return new Response(JSON.stringify(persona), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error", details: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
