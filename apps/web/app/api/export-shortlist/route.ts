import { NextResponse } from 'next/server'
import markdownpdf from 'markdown-pdf'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { markdown } = await req.json()
    if (!markdown || typeof markdown !== 'string') {
      return NextResponse.json({ error: 'Markdown string required' }, { status: 400 })
    }

    const cssPath = path.join(process.cwd(), 'apps', 'brand', 'app', 'api', 'export-shortlist', 'pdf.css')

    const buffer: Buffer = await new Promise((resolve, reject) => {
      markdownpdf({ cssPath })
        .from.string(markdown)
        .to.buffer((err, buff) => {
          if (err) reject(err)
          else resolve(buff)
        })
    })

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="shortlist.pdf"',
      },
    })
  } catch (err) {
    console.error('PDF export failed', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
