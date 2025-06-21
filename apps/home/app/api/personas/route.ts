import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

interface PersonaEntry {
  id: string
  handle: string
  result: string
  tone?: string
  goal?: string
  platform?: string
  createdAt: string
  [key: string]: any
}

const DB_PATH = path.join(process.cwd(), '..', '..', 'data', 'personas.json')

async function readData(): Promise<PersonaEntry[]> {
  try {
    const file = await fs.readFile(DB_PATH, 'utf8')
    const data = JSON.parse(file)
    return Array.isArray(data) ? data as PersonaEntry[] : []
  } catch {
    return []
  }
}

async function writeData(data: PersonaEntry[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { handle, result, tone, goal, platform, createdAt } = body

    if (!handle || !result) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const data = await readData()
    const persona: PersonaEntry = {
      id: randomUUID(),
      handle,
      result,
      tone,
      goal,
      platform,
      createdAt: createdAt || new Date().toISOString(),
      ...body
    }
    data.push(persona)
    await writeData(data)

    return NextResponse.json({ id: persona.id })
  } catch (err) {
    console.error('personas POST error', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
