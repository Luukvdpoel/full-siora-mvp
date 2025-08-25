import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const csvPath = path.join(process.cwd(), '..', '..', 'db', 'emails.csv');
    try {
      await fs.access(csvPath);
    } catch {
      await fs.writeFile(csvPath, 'email,timestamp\n');
    }
    const line = `"${email.replace(/"/g, '""')}",${new Date().toISOString()}\n`;
    await fs.appendFile(csvPath, line);

    const doc = new PDFDocument();
    const chunks: Buffer[] = [];
    doc.fontSize(20).text('Thanks for signing up!', { align: 'center' });
    doc.end();
    for await (const chunk of doc) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="lead-magnet.pdf"',
      },
    });
  } catch (err) {
    console.error('collect-email POST error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
