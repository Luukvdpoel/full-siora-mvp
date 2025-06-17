import Link from 'next/link';
import type { Campaign } from '@/app/data/campaigns';

interface Props {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: Props) {
  return (
    <div className="border border-white/10 bg-background p-4 rounded-lg space-y-2">
      <h3 className="text-lg font-semibold">{campaign.title}</h3>
      <p className="text-sm text-foreground/80">{campaign.brand}</p>
      <p className="text-sm">Platform: {campaign.platform}</p>
      <p className="text-sm">Niche: {campaign.niche}</p>
      <p className="text-sm">Budget: ${campaign.budgetMin} - ${campaign.budgetMax}</p>
      <Link
        href={`/explore/${campaign.id}`}
        className="mt-2 inline-block px-3 py-1 bg-indigo-600 text-white rounded"
      >
        View Brief
      </Link>
    </div>
  );
}
