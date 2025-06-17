import { NextResponse } from 'next/server'
import markdownpdf from 'markdown-pdf'
import path from 'path'

interface ContractRequest {
  brandName: string
  creatorName: string
  deliverables: string
  startDate: string
  endDate: string
  paymentTerms: string
  platforms?: string
  format?: 'markdown' | 'pdf'
}

export async function POST(req: Request) {
  try {
    const {
      brandName,
      creatorName,
      deliverables,
      startDate,
      endDate,
      paymentTerms,
      platforms,
      format,
    } = (await req.json()) as Partial<ContractRequest>

    if (!brandName || !creatorName || !deliverables || !startDate || !endDate || !paymentTerms) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const markdown = `# Collaboration Agreement\n\n**Brand:** ${brandName}\n**Creator:** ${creatorName}\n\n## Deliverables\n${deliverables}\n\n## Platforms\n${platforms || 'N/A'}\n\n## Timeline\nStart: ${startDate}\nEnd: ${endDate}\n\n## Payment Terms\n${paymentTerms}\n\n---\n_Both parties agree to the terms outlined above._\n`

    if (format === 'pdf') {
      const cssPath = path.join(process.cwd(), 'apps', 'brand', 'app', 'api', 'generate-contract', 'pdf.css')
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
          'Content-Disposition': 'attachment; filename="contract.pdf"',
        },
      })
    }

    return NextResponse.json({ markdown })
  } catch (err) {
    console.error('generate contract error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
