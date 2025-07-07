export interface BrandTrustFactors {
  rating?: number;
  responseHours?: number;
  paymentDays?: number;
  completionRate?: number;
}

export function getBrandTrustScore(f: BrandTrustFactors) {
  const ratingScore = Math.min(Math.max(f.rating ?? 0, 0), 5) / 5 * 40;
  const responseScore = Math.max(0, Math.min(48, 48 - (f.responseHours ?? 48))) / 48 * 20;
  const paymentScore = Math.max(0, Math.min(30, 30 - (f.paymentDays ?? 30))) / 30 * 20;
  const completionScore = Math.min(Math.max(f.completionRate ?? 0, 0), 100) / 100 * 20;
  const score = Math.round(ratingScore + responseScore + paymentScore + completionScore);
  return {
    score,
    breakdown: {
      rating: Math.round(ratingScore),
      response: Math.round(responseScore),
      payment: Math.round(paymentScore),
      completion: Math.round(completionScore)
    }
  };
}
