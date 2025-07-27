import fs from 'fs/promises'
import path from 'path'

const filesToPatch = ['personas.json', 'campaigns.json', 'matches.json']

async function patchFile(filename: string) {
  const filePath = path.join('db', filename)
  const data = JSON.parse(await fs.readFile(filePath, 'utf8'))

  const patched = data.map((entry: any) => {
    const cleaned = { ...entry }

    // Normalize IDs
    if (typeof cleaned.id === 'number') delete cleaned.id

    // Remove unused keys
    delete cleaned.brand
    delete cleaned.createdAt
    delete cleaned.updatedAt

    // Add status fallback for matches
    if (filename === 'matches.json' && !cleaned.status) {
      cleaned.status = 'pending'
    }

    // Add description/deliverables fallback for campaigns
    if (filename === 'campaigns.json') {
      if (!cleaned.description) cleaned.description = 'N/A'
      if (!cleaned.deliverables) cleaned.deliverables = 'N/A'
    }

    return cleaned
  })

  await fs.writeFile(filePath, JSON.stringify(patched, null, 2))
  console.log(`✅ Patched ${filename}`)
}

async function main() {
  for (const file of filesToPatch) {
    await patchFile(file)
  }
}
main()


