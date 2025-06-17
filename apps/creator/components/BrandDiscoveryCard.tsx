import Image from 'next/image'
import { DiscoveryBrand } from '@/data/discoveryBrands'
import { Badge } from 'shared-ui'
import { getBrandBadges } from 'shared-utils'

interface Props {
  brand: DiscoveryBrand
  onAction?: () => void
}

export default function BrandDiscoveryCard({ brand, onAction }: Props) {
  const badges = getBrandBadges({
    verified: brand.verified,
    pastCampaigns: brand.pastCampaigns.length,
  })

  return (
    <div className="p-4 rounded-lg border border-white/10 bg-background space-y-2">
      <div className="flex items-center space-x-3">
        <Image
          src={brand.logo}
          alt={brand.name}
          width={40}
          height={40}
          unoptimized
          className="rounded-full"
        />
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            {brand.name}
            {badges.map((b) => (
              <Badge key={b.id} label={b.label} />
            ))}
          </h3>
          <p className="text-sm text-foreground/70">{brand.tagline}</p>
        </div>
      </div>
      <p className="text-sm">Industry: {brand.industry}</p>
      <div className="flex flex-wrap gap-1">
        {brand.vibes.map((v) => (
          <span key={v} className="px-2 py-0.5 text-xs bg-zinc-800 rounded">
            {v}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={onAction}
        className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded"
      >
        View Brand
      </button>
    </div>
  )
}
