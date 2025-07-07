import { NextResponse } from 'next/server'
import { marked } from 'marked'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const { markdown } = await req.json()
    if (!markdown || typeof markdown !== 'string') {
      return NextResponse.json({ error: 'Markdown string required' }, { status: 400 })
    }

    const htmlContent = marked.parse(markdown)

    const cssPath = path.join(process.cwd(), 'apps', 'creator', 'app', 'api', 'export-lead-magnet', 'pdf.css')
    const css = fs.readFileSync(cssPath, 'utf8')

    // Resolve logo path relative to the current working directory so it works
    // when the app is started from the `apps/creator` workspace
    const logoPath = path.join(process.cwd(), 'public', 'siora-logo.svg')
    const logoSvg = fs.readFileSync(logoPath)
    const logoData = Buffer.from(logoSvg).toString('base64')

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>${css}</style>
</head>
<body>
<div class="logo"><img src="data:image/svg+xml;base64,${logoData}" alt="usesiora.com logo" width="120" /></div>
${htmlContent}
<footer class="footer">Created with Siora – the smart platform for modern creators</footer>
</body>
</html>`

    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: 'new' })
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const buffer = await page.pdf({ format: 'A4', printBackground: true })
    await browser.close()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="lead-magnet.pdf"'
      }
    })
  } catch (err) {
    console.error('lead magnet pdf export failed', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
