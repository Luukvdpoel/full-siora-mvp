"use client"
import { useEffect, useMemo, useState } from 'react'
import { brandOpportunities, BrandOpportunity } from '@creator/data/brandOpportunities'
import { loadPersonasFromLocal, StoredPersona } from '@creator/lib/localPersonas'
import BrandOpportunityCard from '@creator/components/BrandOpportunityCard'

export default function DiscoverBrandsPage() {
  const [personas, setPersonas] = useState<StoredPersona[]>([])
  const [personaIndex, setPersonaIndex] = useState(0)

  useEffect(() => {
    setPersonas(loadPersonasFromLocal())
  }, [])

  const grouped = useMemo(() => {
    const groups: Record<string, BrandOpportunity[]> = {}
    for (const b of brandOpportunities) {
      if (!groups[b.industry]) groups[b.industry] = []
      groups[b.industry].push(b)
    }
    return groups
  }, [])

  const computeMatch = (brand: BrandOpportunity) => {
    const base = brand.id.charCodeAt(0) + personaIndex * 7
    return 60 + (base % 40) // mock 60-99
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 overflow-y-auto">
      <h1 className="text-2xl font-bold">Discover Brand Opportunities</h1>
      {personas.length > 0 && (
        <div>
          <label className="block text-sm font-semibold mb-1">Select Persona</label>
          <select
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={personaIndex}
            onChange={e => setPersonaIndex(parseInt(e.target.value, 10))}
          >
            {personas.map((p, idx) => (
              <option key={idx} value={idx}>
                {(p.persona as { name?: string }).name || `Persona ${idx + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="space-y-8">
        {Object.entries(grouped).map(([industry, brands]) => (
          <section key={industry} className="space-y-4">
            <h2 className="text-xl font-semibold">{industry}</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {brands.map(b => (
                <BrandOpportunityCard key={b.id} brand={b} match={computeMatch(b)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
