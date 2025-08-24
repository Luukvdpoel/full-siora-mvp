export function scoreMatch(params: {
  semantic01: number;
  toneMatch01: number;
  nicheMatch01: number;
  audienceFit01: number;
  engagement01: number;
}) {
  const { semantic01, toneMatch01, nicheMatch01, audienceFit01, engagement01 } = params;
  const s =
    0.55 * semantic01 +
    0.20 * toneMatch01 +
    0.10 * nicheMatch01 +
    0.10 * audienceFit01 +
    0.05 * engagement01;
  return Math.round(Math.max(0, Math.min(1, s)) * 100);
}

export function oneIfEqual(a?: string | null, b?: string | null) {
  if (!a || !b) return 0;
  return a.trim().toLowerCase() === b.trim().toLowerCase() ? 1 : 0;
}

export function softSetOverlap(a: string[] = [], b: string[] = []) {
  if (!a.length || !b.length) return 0;
  const A = new Set(a.map((x) => x.toLowerCase()));
  const B = new Set(b.map((x) => x.toLowerCase()));
  let inter = 0;
  for (const k of A) if (B.has(k)) inter++;
  return inter / Math.max(A.size, B.size);
}
