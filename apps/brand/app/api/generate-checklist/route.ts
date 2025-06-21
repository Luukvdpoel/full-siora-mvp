import { NextResponse } from 'next/server'
import markdownpdf from 'markdown-pdf'
import path from 'path'

interface ChecklistRequest {
  creatorName: string
  format?: 'markdown' | 'pdf'
}

export async function POST(req: Request) {
  try {
    const { creatorName, format } = (await req.json()) as Partial<ChecklistRequest>

    if (!creatorName) {
      return NextResponse.json({ error: 'creatorName required' }, { status: 400 })
    }

    const items = [
      `Review ${creatorName}'s engagement metrics`,
      'Check audience demographics for brand fit',
      'Look at previous brand collaborations',
      'Assess content quality and consistency',
    ]
    const markdown = `# Evaluation Checklist for ${creatorName}\n\n` + items
      .map((i, idx) => `${idx + 1}. ${i}`)
      .join('\n')

    if (format === 'pdf') {
      const cssPath = path.join(
        process.cwd(),
        'apps',
        'brand',
        'app',
        'api',
        'generate-checklist',
        'pdf.css',
      )
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
          'Content-Disposition': 'attachment; filename="checklist.pdf"',
        },
      })
    }

    return NextResponse.json({ markdown })
  } catch (err) {
    console.error('generate checklist error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
