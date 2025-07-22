export interface OfferTerms {
  paymentType: 'flat' | 'affiliate' | 'mixed';
  flatFee?: number;
  commissionRate?: number; // 0-1
}

export function detectAffiliateOnlyOffer(offer: OfferTerms): { unfair: boolean; reason: string } {
  if (offer.paymentType === 'affiliate' || (!offer.flatFee && (offer.commissionRate ?? 0) < 0.1)) {
    return { unfair: true, reason: 'Affiliate-only compensation detected' };
  }
  return { unfair: false, reason: '' };
}

import { callOpenAI } from './openai';

export async function generateNegotiationPrompt({
  brand,
  creator,
  currentOffer,
}: {
  brand: string;
  creator: string;
  currentOffer: string;
}): Promise<string> {
  const messages = [
    {
      role: 'system',
      content:
        'You craft short counter-offer messages for creators negotiating brand deals.',
    },
    {
      role: 'user',
      content: `Brand: ${brand}\nCreator: ${creator}\nCurrent offer: ${currentOffer}\nReply with a friendly one-paragraph counter-offer requesting improved terms.`,
    },
  ];
  return callOpenAI({ messages, temperature: 0.7, fallback: '' });
}
