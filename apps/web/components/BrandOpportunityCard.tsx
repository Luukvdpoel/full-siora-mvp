import Image from 'next/image'
import { motion } from 'framer-motion'
import type { BrandOpportunity } from '@/data/brandOpportunities'
import { useRouter } from 'next/navigation'

interface Props {
  brand: BrandOpportunity
  match: number
}

export default function BrandOpportunityCard({ brand, match }: Props) {
  const router = useRouter()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 rounded-lg border border-white/10 bg-background flex flex-col space-y-2"
    >
      <div className="flex items-center gap-3">
        <Image
          src={brand.logo}
          alt={brand.name}
          width={40}
          height={40}
          className="rounded-full"
          unoptimized
        />
        <h3 className="font-semibold">{brand.name}</h3>
        <span className="ml-auto text-sm font-medium">{match}% match</span>
      </div>
      <p className="text-sm text-foreground/70">{brand.lookingFor}</p>
      <div className="flex flex-wrap gap-1">
        {brand.tags.map((t) => (
          <span key={t} className="px-2 py-0.5 text-xs bg-zinc-800 rounded">
            {t}
          </span>
        ))}
      </div>
      <button
        onClick={() => router.push(`/pitch?brand=${encodeURIComponent(brand.name)}`)}
        className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded self-start"
      >
        Pitch this Brand
      </button>
    </motion.div>
  )
}
