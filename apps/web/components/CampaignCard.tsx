import Link from 'next/link';
import type { Campaign } from '@/app/data/campaigns';
import { discoveryBrands } from '@/data/discoveryBrands';
import { getBrandTrustScore } from 'shared-utils';

interface Props {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: Props) {
  const brandInfo = discoveryBrands.find((b) => b.name === campaign.brand);
  const trust = brandInfo
    ? getBrandTrustScore({
        rating: brandInfo.rating,
        responseHours: brandInfo.responseHours,
        paymentDays: brandInfo.paymentDays,
        completionRate: brandInfo.completionRate,
      })
    : { score: 0, breakdown: { rating: 0, response: 0, payment: 0, completion: 0 } };
  const trustColor =
    trust.score >= 80 ? 'bg-green-600' : trust.score >= 50 ? 'bg-yellow-500' : 'bg-red-600';
  return (
    <div className="border border-white/10 bg-background p-4 rounded-lg space-y-2">
      <h3 className="text-lg font-semibold">{campaign.title}</h3>
      <p className="text-sm text-foreground/80 flex items-center gap-2">
        {campaign.brand}
        {brandInfo && (
          <span
            className={`px-1.5 py-0.5 text-xs rounded text-white ${trustColor}`}
            title={`Reviews: ${trust.breakdown.rating}/40\nResponse: ${trust.breakdown.response}/20\nPayment: ${trust.breakdown.payment}/20\nCompletion: ${trust.breakdown.completion}/20`}
          >
            {trust.score}
          </span>
        )}
      </p>
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
