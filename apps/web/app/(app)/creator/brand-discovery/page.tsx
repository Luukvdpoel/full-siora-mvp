'use client';
import React from 'react';

import { useEffect, useMemo, useState } from 'react'
import BrandDiscoveryCard from '@creator/components/BrandDiscoveryCard'
import { discoveryBrands, DiscoveryBrand } from '@creator/data/discoveryBrands'
import { loadPersonasFromLocal, StoredPersona } from '@creator/lib/localPersonas'

export default function BrandDiscoveryPage() {
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('')
  const [value, setValue] = useState('')
  const [vibe, setVibe] = useState('')
  const [campaign, setCampaign] = useState('')
  const [personas, setPersonas] = useState<StoredPersona[]>([])
  const [personaIndex, setPersonaIndex] = useState(0)

  useEffect(() => {
    setPersonas(loadPersonasFromLocal())
  }, [])

  const industries = useMemo(
    () => Array.from(new Set(discoveryBrands.map(b => b.industry))),
    []
  )
  const values = useMemo(
    () => Array.from(new Set(discoveryBrands.flatMap(b => b.values))),
    []
  )
  const vibes = useMemo(
    () => Array.from(new Set(discoveryBrands.flatMap(b => b.vibes))),
    []
  )
  const campaigns = useMemo(
    () => Array.from(new Set(discoveryBrands.flatMap(b => b.pastCampaigns))),
    []
  )

  const filtered = useMemo(() => {
    return discoveryBrands.filter(b => {
      if (industry && b.industry !== industry) return false
      if (value && !b.values.includes(value)) return false
      if (vibe && !b.vibes.includes(vibe)) return false
      if (campaign && !b.pastCampaigns.includes(campaign)) return false
      const term = search.toLowerCase()
      if (term && !b.name.toLowerCase().includes(term) && !b.industry.toLowerCase().includes(term)) {
        return false
      }
      return true
    })
  }, [industry, value, vibe, campaign, search])

  const suggested = useMemo(() => {
    const persona = personas[personaIndex]?.persona
    if (!persona) return [] as DiscoveryBrand[]
    const keywords = [
      persona.personality,
      persona.brandFit ?? '',
      ...(persona.interests || [])
    ].join(' ').toLowerCase()
    return discoveryBrands.filter(b => {
      return (
        keywords.includes(b.industry.toLowerCase()) ||
        b.vibes.some(v => keywords.includes(v.toLowerCase())) ||
        b.values.some(v => keywords.includes(v.toLowerCase()))
      )
    })
  }, [personaIndex, personas])

  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Discover Brands</h1>

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

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Search by name or industry"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
          />
          <select
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={industry}
            onChange={e => setIndustry(e.target.value)}
          >
            <option value="">All Industries</option>
            {industries.map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <select
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={value}
            onChange={e => setValue(e.target.value)}
          >
            <option value="">All Values</option>
            {values.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={vibe}
            onChange={e => setVibe(e.target.value)}
          >
            <option value="">All Vibes</option>
            {vibes.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select
            className="w-full p-2 rounded-md bg-zinc-800 text-white"
            value={campaign}
            onChange={e => setCampaign(e.target.value)}
          >
            <option value="">Past Campaigns</option>
            {campaigns.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {suggested.length > 0 && (
          <div>
            <h2 className="font-semibold mb-2">Suggested for You</h2>
            <div className="space-y-2">
              {suggested.map(b => (
                <BrandDiscoveryCard key={b.id} brand={b} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map(b => (
          <BrandDiscoveryCard key={b.id} brand={b} />
        ))}
      </div>
    </main>
  )
}
