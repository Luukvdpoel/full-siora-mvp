import { PrismaClient, Campaign, Application } from '@prisma/client';
import { readJson } from '../tools/readJson.ts';


const prisma = new PrismaClient();

async function main() {
  // Create a dummy user
  const user = await prisma.user.upsert({
    where: { email: 'dummy@user.com' },
    update: {},
    create: {
      email: 'dummy@user.com',
      name: 'Dummy User',
      role: 'creator',
    },
  });

  console.log('✅ Created user:', user.email);

  // PERSONAS
  const personasRaw = await readJson('personas.json');
  if (personasRaw.length > 0) {
    const personaData = personasRaw.map((p: any) => ({
      userId: user.id,
      title: p.title || 'Dummy Persona',
      data: {
        name: p.name,
        category: p.category,
        audience: p.audience,
      },
    }));

    await prisma.persona.createMany({
      data: personaData,
      skipDuplicates: true,
    });
    console.log(`✅ Seeded ${personaData.length} personas`);
  }

    // REAL CREATORS
    const realCreatorsRaw = await readJson('db/real_creators_seed.json');
    if (realCreatorsRaw.length > 0) {
      const creators = realCreatorsRaw.map((c: any) => ({
        userId: user.id,
        title: `${c.name} Persona`,
        data: {
          name: c.name,
          instagramHandle: c.username,
          category: c.category,
          followers: c.followers,
          platform: 'Instagram',
        },
      }));
  
      await prisma.persona.createMany({
        data: creators,
        skipDuplicates: true,
      });
  
      console.log(`✅ Seeded ${creators.length} real Instagram creators`);
    }

  // CAMPAIGNS
  const campaignsRaw = await readJson('campaigns.json');
  let campaignRecords: Campaign[] = [];

  if (campaignsRaw.length > 0) {
    campaignRecords = await Promise.all(
      campaignsRaw.map((c: any) =>
        prisma.campaign.create({
          data: {
            brandId: user.id,
            title: c.title,
            description: c.description,
            deliverables: c.deliverables,
            deadline: new Date(c.deadline),
            platform: c.platform,
            niche: c.niche,
            budgetMin: c.budgetMin,
            budgetMax: c.budgetMax,
          },
        })
      )
    );
    console.log(`✅ Seeded ${campaignRecords.length} campaigns`);
  }

  // APPLICATIONS
  const applicationsRaw = await readJson('applications.json');
  let applicationRecords: Application[] = [];

  if (applicationsRaw.length > 0 && campaignRecords.length > 0) {
    applicationRecords = await Promise.all(
      applicationsRaw.map((a: any, i: number) =>
        prisma.application.create({
          data: {
            creatorId: user.id,
            campaignId: campaignRecords[i % campaignRecords.length].id,
            message: a.message,
            status: a.status || 'pending',
          },
        })
      )
    );
    console.log(`✅ Seeded ${applicationRecords.length} applications`);
  }

  // MATCHES
  const matchesRaw = await readJson('matches.json');
  if (
    matchesRaw.length > 0 &&
    campaignRecords.length > 0 &&
    applicationRecords.length > 0
  ) {
    const matchData = matchesRaw.map((m: any, i: number) => ({
      campaignId: campaignRecords[i % campaignRecords.length].id,
      creatorId: user.id,
      applicationId: applicationRecords[i % applicationRecords.length].id,
      brandId: user.id,
      status: m.status || 'new',
      isShortlisted: false,
    }));

    await prisma.match.createMany({
      data: matchData,
      skipDuplicates: true,
    });

    console.log(`✅ Seeded ${matchesRaw.length} matches`);
  }

  console.log('✅ Done seeding.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



