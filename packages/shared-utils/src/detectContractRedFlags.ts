export interface ContractWarning {
  flag: string;
  message: string;
}

const checks: { pattern: RegExp; flag: string; message: string }[] = [
  {
    pattern: /no payment/i,
    flag: 'no_payment',
    message: 'Contract states no payment to the creator.',
  },
  {
    pattern: /affiliate[- ]only/i,
    flag: 'affiliate_only',
    message: 'Affiliate-only compensation detected. This may be unfair to the creator.',
  },
  {
    pattern: /(all|perpetual) rights|rights without compensation|royalty[- ]free/i,
    flag: 'rights_without_compensation',
    message: 'Rights granted without additional compensation.',
  },
];

export function detectContractRedFlags(text: string): ContractWarning[] {
  const normalized = text.toLowerCase();
  return checks
    .filter((c) => c.pattern.test(normalized))
    .map((c) => ({ flag: c.flag, message: c.message }));
}
