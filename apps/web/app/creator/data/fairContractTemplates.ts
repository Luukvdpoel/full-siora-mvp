export interface FairContractTemplate {
  title: string;
  text: string;
}

const templates: FairContractTemplate[] = [
  {
    title: 'Sponsored Post',
    text: `## Sponsored Post Agreement

- Payment: $500 upon content delivery
- Usage Rights: Brand may use content on social channels for 30 days.
- Termination: Either party may cancel with 7 days notice.`,
  },
  {
    title: 'UGC Partnership',
    text: `## UGC Partnership

- Payment: $300 per video
- Creator retains ownership of content.
- Brand granted non-exclusive paid ad usage for 60 days.`,
  },
];

export default templates;
