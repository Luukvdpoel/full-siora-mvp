import { PrismaClient, Role, Platform } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Ensure one owner brand user
  const owner = await prisma.user.upsert({
    where: { email: "founder@siora.dev" },
    update: {},
    create: { email: "founder@siora.dev", name: "Siora Founder", role: Role.ADMIN },
  });

  const brand = await prisma.brand.upsert({
    where: { id: "brand-1" },
    update: {},
    create: { id: "brand-1", ownerId: owner.id, name: "Acme Skincare", website: "https://acme.co", plan: "FREE" },
  });

  // Creators
  const creators = await prisma.$transaction([
    prisma.creator.upsert({
      where: { handle: "@maya.moves" },
      update: {},
      create: {
        name: "Maya Flores",
        handle: "@maya.moves",
        platform: Platform.INSTAGRAM,
        niche: "Fitness",
        tone: "Aspirational",
        values: ["Consistency", "Body-positivity", "Discipline"],
        followers: 182_000,
        avgViews: 54_000,
        engagement: 4.8,
        location: "NL",
        bio: "Fitness coach sharing daily routines and mindset.",
        tags: ["workouts", "health", "discipline"],
      },
    }),
    prisma.creator.upsert({
      where: { handle: "@uri.tech" },
      update: {},
      create: {
        name: "Tech with Uri",
        handle: "@uri.tech",
        platform: Platform.YOUTUBE,
        niche: "Tech",
        tone: "Educational",
        values: ["Open-source", "Transparency"],
        followers: 92_000,
        avgViews: 27_000,
        engagement: 3.2,
        location: "DE",
        bio: "Consumer tech reviews & tutorials.",
        tags: ["reviews", "gadgets"],
      },
    }),
    prisma.creator.upsert({
      where: { handle: "@sienna.travels" },
      update: {},
      create: {
        name: "Nomad Sienna",
        handle: "@sienna.travels",
        platform: Platform.TIKTOK,
        niche: "Travel",
        tone: "Playful",
        values: ["Sustainability", "Local-first", "Curiosity"],
        followers: 310_000,
        avgViews: 120_000,
        engagement: 2.4,
        location: "ES",
        bio: "Slow travel, local food, playful vlogs.",
        tags: ["eco", "europe", "vlogs"],
      },
    }),
  ]);

  // One example campaign + matches
  const campaign = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      title: "Eco-friendly Summer Launch",
      brief: "Looking for playful/educational creators aligned with sustainability.",
      budgetEUR: 5000,
      niche: "Travel",
      targetTone: "Playful",
    },
  });

  await prisma.match.createMany({
    data: [
      { campaignId: campaign.id, creatorId: creators[2].id, matchScore: 86, rationale: "Playful tone + sustainability fit" },
      { campaignId: campaign.id, creatorId: creators[0].id, matchScore: 72, rationale: "Aspirational tone; fitness x travel crossover" },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete");
}

main().finally(() => prisma.$disconnect());
