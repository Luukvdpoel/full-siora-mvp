import { NextResponse } from 'next/server'
import { markdownToPdf } from '@/lib/pdf'

export async function POST(req: Request) {
  try {
    const { markdown } = await req.json()
    if (!markdown || typeof markdown !== 'string') {
      return NextResponse.json({ error: 'Markdown string required' }, { status: 400 })
    }

    const buffer = await markdownToPdf(markdown)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="persona.pdf"',
      },
    })
  } catch (err) {
    console.error('PDF export failed', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
