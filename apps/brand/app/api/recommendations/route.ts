import { creators, type Creator } from '@/app/data/creators'

interface RecommendRequest {
  industry?: string
  goal?: string
  audience?: string
  tone?: string
}

function scoreCreator(c: Creator, req: RecommendRequest) {
  let score = 0
  const reasons: string[] = []

  if (req.tone) {
    const match = c.tone.toLowerCase().includes(req.tone.toLowerCase())
    if (match) {
      score += 0.25
      reasons.push('Tone match')
    }
  }

  if (req.industry) {
    const norm = req.industry.toLowerCase()
    const text = `${c.niche} ${(c.tags || []).join(' ')} ${c.summary}`.toLowerCase()
    if (text.includes(norm)) {
      score += 0.35
      reasons.push('Industry relevance')
    }
  }

  if (req.audience) {
    const words = req.audience.toLowerCase().split(/[\s,]+/)
    const text = c.summary.toLowerCase()
    if (words.some(w => text.includes(w))) {
      score += 0.25
      reasons.push('Audience overlap')
    }
  }

  if (req.goal) {
    const words = req.goal.toLowerCase().split(/[\s,]+/)
    const text = `${c.summary} ${(c.tags || []).join(' ')} ${c.niche}`.toLowerCase()
    if (words.some(w => text.includes(w))) {
      score += 0.15
      reasons.push('Goal alignment')
    }
  }

  return { confidence: Math.min(score, 1), reasons }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RecommendRequest

    const scored = creators.map(c => {
      const { confidence, reasons } = scoreCreator(c, body)
      return { creator: c, confidence, reason: reasons.join('; ') }
    })

    scored.sort((a, b) => b.confidence - a.confidence)

    const results = scored.slice(0, Math.min(10, scored.length))

    return new Response(JSON.stringify({ recommendations: results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('recommendations error', err)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
