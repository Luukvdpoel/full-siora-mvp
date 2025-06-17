export type MonetizationStep = {
  step: string;
};

export type MonetizationStream = {
  title: string;
  steps: string[];
  platform: { label: string; url: string };
};

export type MonetizationPlan = MonetizationStream[];
