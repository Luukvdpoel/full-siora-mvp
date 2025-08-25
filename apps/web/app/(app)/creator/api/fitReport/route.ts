export type { FitReport } from "@creator/types/fitReport";

import { NextResponse } from "next/server";

function wordSet(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
  );
}

function overlap(a: Set<string>, b: Set<string>): number {
  let count = 0;
  a.forEach((w) => {
    if (b.has(w)) count++;
  });
  return count;
}

export async function POST(req: Request) {
  try {
    const { persona, brand } = await req.json();

    if (!persona || typeof persona !== "object") {
      return NextResponse.json(
        { error: "Persona data is required" },
        { status: 400 }
      );
    }
    if (!brand || typeof brand !== "string") {
      return NextResponse.json(
        { error: "Brand brief is required" },
        { status: 400 }
      );
    }

    const briefWords = wordSet(brand);
    const vibeWords = wordSet((persona.personality ?? "") as string);
    const interestWords = wordSet((persona.interests ?? []).join(" "));
    const summaryWords = wordSet((persona.summary ?? "") as string);

    const vibeScore = overlap(vibeWords, briefWords);
    const audienceScore = overlap(interestWords, briefWords);
    const toneScore = overlap(summaryWords, briefWords);

    const vibeMatch = vibeScore > 0 ? "Strong" : "Weak";
    const audienceMatch = audienceScore > 0 ? "Good" : "Limited";
    const toneMatch = toneScore > 0 ? "Similar" : "Different";

    const summary = `Vibe alignment is ${vibeMatch.toLowerCase()}, audience overlap is ${audienceMatch.toLowerCase()}, and tone match is ${toneMatch.toLowerCase()}.`;

    const result = {
      vibeMatch,
      audienceMatch,
      toneMatch,
      summary,
    };

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
