'use server'

import { prisma } from '@/lib/auth'

export async function getFilterOptions() {
  const tones = await prisma.creatorProfile.findMany({
    distinct: ['tone'],
    select: { tone: true },
  })
  const personas = await prisma.creatorProfile.findMany({
    distinct: ['brandPersona'],
    select: { brandPersona: true },
  })
  return {
    tones: tones.map(t => t.tone).filter(Boolean),
    personaTypes: personas.map(p => p.brandPersona).filter(Boolean)
  }
}

export interface FetchParams {
  tone?: string
  personaTypes?: string[]
  sort?: 'match' | 'name'
  page?: number
}

export async function fetchCreators({ tone, personaTypes, sort = 'match', page = 1 }: FetchParams) {
  const where: any = {}
  if (tone) where.tone = tone
  if (personaTypes && personaTypes.length > 0) where.brandPersona = { in: personaTypes }

  const orderBy = sort === 'name' ? { name: 'asc' } : { followers: 'desc' }

  const [creators, total] = await Promise.all([
    prisma.creatorProfile.findMany({ where, orderBy, take: 10, skip: (page - 1) * 10 }),
    prisma.creatorProfile.count({ where })
  ])

  return { creators, total }
}
