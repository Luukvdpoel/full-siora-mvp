import { NextResponse } from 'next/server'

interface ContractRequest {
  brandName?: string
  creatorName: string
  deliverables: string
  payment: string
  startDate?: string
  endDate?: string
}

export async function POST(req: Request) {
  try {
    const {
      brandName = 'Demo Brand',
      creatorName,
      deliverables,
      payment,
      startDate,
      endDate,
    } = (await req.json()) as Partial<ContractRequest>

    if (!creatorName || !deliverables || !payment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const lines = [
      `Contract between ${brandName} and ${creatorName}`,
      '',
      'Deliverables:',
      deliverables,
      '',
      'Payment Terms:',
      payment,
    ]
    if (startDate || endDate) {
      lines.push('', 'Timeline:')
      if (startDate) lines.push(`Start: ${startDate}`)
      if (endDate) lines.push(`End: ${endDate}`)
    }
    lines.push('', 'Both parties agree to these terms.')

    return NextResponse.json({ contract: lines.join('\n') })
  } catch (err) {
    console.error('contract generate error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
