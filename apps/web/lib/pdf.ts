import PDFDocument from 'pdfkit';

export async function markdownToPdf(markdown: string): Promise<Buffer> {
  const doc = new PDFDocument();
  const chunks: Buffer[] = [];
  doc.text(markdown);
  doc.end();
  for await (const chunk of doc) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}
