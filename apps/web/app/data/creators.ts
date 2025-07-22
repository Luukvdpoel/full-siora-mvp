export type TopPost = {
  type: string;
  title: string;
  link: string;
  stats: string;
};

export type CreatorPerformance = {
  avgReach: number;
  engagementRate: number;
  followerGrowth: number;
  topPosts: TopPost[];
};

export type Creator = {
  id: string;
  name: string;
  handle: string;
  niche: string;
  platform: string;
  summary: string;
  followers: number;
  engagementRate: number;
  tags: string[];
  tone: string;
  vibe?: string;
  formats?: string[];
  fitScore?: number;
  markdown?: string;
  verified?: boolean;
  completedCollabs?: number;
  avgResponseMinutes?: number;
  performance?: CreatorPerformance;
  /** Preferred deal structure e.g. 'value_based', 'reject_affiliate_only' */
  deal_preference?: string;
  /** Minimum flat fee the creator expects */
  min_expected_fee?: number;
  /** Acceptable revenue share percentage if doing commission */
  revenue_share_tolerance?: number;
};

export const creators = [
  {
    id: "1",
    handle: "@livelaughluxe",
    name: "Sophie Tan",
    niche: "Beauty & Lifestyle",
    tone: "Warm & Aspirational",
    platform: "Instagram",
    tags: ["skincare", "wellness", "selfcare"],
    summary: "Beauty creator focused on skincare and wellness for Gen Z.",
    followers: 120000,
    engagementRate: 3.8,
    vibe: "cozy wellness",
    formats: ["Reels", "Stories"],
    fitScore: 85,
    brandFit: "High",
    location: "Los Angeles, USA",
    language: "English",
    markdown: `
## 🌸 About Me
I'm Sophie — I share skincare rituals, cozy routines, and self-care tips to help Gen Z feel more confident in their skin.

## 💼 Past Brand Work
- GlowUp Skincare (UGC reels)
- Rituals Cosmetics (ambassador deal)
- Sephora Squad 2024

## 📊 Audience Breakdown
- 87% women aged 18–24
- Top regions: US, UK, CA

## 🔍 Ideal Brand Collabs
- Clean beauty
- Wellness supplements
- Cozy fashion brands
    `,
    verified: true,
    completedCollabs: 4,
    avgResponseMinutes: 30,
    performance: {
      avgReach: 5500,
      engagementRate: 3.8,
      followerGrowth: 4.0,
      topPosts: [
        {
          type: "Reel",
          title: "Glow routine",
          link: "https://example.com/post1",
          stats: "8k views",
        },
        {
          type: "Story",
          title: "Skincare Q&A",
          link: "https://example.com/post2",
          stats: "5k views",
        },
      ],
    },
    deal_preference: "value_based",
    min_expected_fee: 500,
    revenue_share_tolerance: 20,
  },
  {
    id: "2",
    handle: "@techdad.eth",
    name: "Marc Venter",
    niche: "Tech & Web3",
    tone: "Witty & Analytical",
    platform: "YouTube",
    tags: ["crypto", "AI", "smartphones"],
    summary: "Web3 content creator breaking down trends for normies.",
    followers: 45000,
    engagementRate: 6.2,
    vibe: "analytical tech",
    formats: ["Long-form video", "Short clips"],
    fitScore: 70,
    brandFit: "Medium",
    location: "Berlin, Germany",
    language: "English, German",
    markdown: `
## 🤖 About Me
Tech explainer meets crypto nerd. My YouTube channel covers AI, gadgets, and decentralized tech — made simple.

## 🔧 Recent Collabs
- Ledger Wallet
- Notion AI campaign
- LlamaIndex explainer series

## 📈 Channel Stats
- Avg views: 12–18K
- 60% mobile viewers
- Comments full of devs & curious minds

## 🚀 Looking for
- AI-powered tools
- Tech startups
- Secure wallet brands
    `,
    verified: true,
    completedCollabs: 3,
    avgResponseMinutes: 45,
    performance: {
      avgReach: 15000,
      engagementRate: 6.2,
      followerGrowth: 2.0,
      topPosts: [
        {
          type: "Video",
          title: "AI Gadgets Review",
          link: "https://example.com/post3",
          stats: "20k views",
        },
        {
          type: "Short",
          title: "Crypto Basics",
          link: "https://example.com/post4",
          stats: "15k views",
        },
      ],
    },
    deal_preference: "reject_affiliate_only",
    min_expected_fee: 750,
    revenue_share_tolerance: 15,
  },
  {
    id: "3",
    handle: "@plantgirlpaola",
    name: "Paola Mendes",
    niche: "Home & Plants",
    tone: "Soft & Visual",
    platform: "TikTok",
    tags: ["plantcare", "interiordecor", "boho"],
    summary:
      "Urban jungle queen helping you green your home, one reel at a time.",
    followers: 82000,
    engagementRate: 4.7,
    vibe: "aesthetic nature",
    formats: ["Reels", "Tutorials"],
    fitScore: 90,
    brandFit: "High",
    location: "São Paulo, Brazil",
    language: "Portuguese, English",
    markdown: `
## 🌿 Welcome to My Jungle
I teach aesthetic plant care, budget-friendly home decor, and cozy vibes — all on TikTok.

## 📷 Favorite Formats
- Transformation reels (before/after)
- “What I water on Wednesdays”
- Collabs with pot brands

## 💚 Brands I’d Love
- Local gardening stores
- Home decor kits
- Organic fertilizers

## 🌍 Followers
- Mostly Brazil, but US & Spain growing!
- Strong LGBTQ+ & design community
    `,
    verified: false,
    completedCollabs: 2,
    avgResponseMinutes: 90,
    performance: {
      avgReach: 9000,
      engagementRate: 4.7,
      followerGrowth: -1.0,
      topPosts: [
        {
          type: "Reel",
          title: "Plant Shelf Tour",
          link: "https://example.com/post5",
          stats: "11k views",
        },
        {
          type: "Tutorial",
          title: "Potting Basics",
          link: "https://example.com/post6",
          stats: "8k views",
        },
      ],
    },
    deal_preference: "value_based",
    min_expected_fee: 400,
    revenue_share_tolerance: 10,
  },
];
