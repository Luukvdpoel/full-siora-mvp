// 📁 /prisma/real_creators_seed.json
[
  {
    "name": "Emma Lifestyle",
    "username": "emma.living",
    "followers": 12400,
    "category": "Lifestyle"
  },
  {
    "name": "Max Urban",
    "username": "max.in.city",
    "followers": 17800,
    "category": "Lifestyle"
  },
  {
    "name": "Sophie Day",
    "username": "sophie.daylife",
    "followers": 14200,
    "category": "Lifestyle"
  },
  {
    "name": "Liam Style",
    "username": "liam.style",
    "followers": 20400,
    "category": "Lifestyle"
  },
  {
    "name": "Chloe Vibes",
    "username": "chloe.vibes",
    "followers": 18900,
    "category": "Lifestyle"
  },
  {
    "name": "Nina Echo",
    "username": "nina.echo",
    "followers": 9700,
    "category": "Lifestyle"
  },
  {
    "name": "Daniel Coast",
    "username": "daniel.coast",
    "followers": 15800,
    "category": "Lifestyle"
  },
  {
    "name": "Laura Zen",
    "username": "laura.zen",
    "followers": 13400,
    "category": "Lifestyle"
  },
  {
    "name": "Noah Flow",
    "username": "noah.flow",
    "followers": 21000,
    "category": "Lifestyle"
  },
  {
    "name": "Mila Grove",
    "username": "mila.grove",
    "followers": 9900,
    "category": "Lifestyle"
  },
  {
    "name": "Kevin Hustle",
    "username": "kevin.hustle",
    "followers": 22000,
    "category": "Business"
  },
  {
    "name": "Anna Startup",
    "username": "anna.startup",
    "followers": 26500,
    "category": "Business"
  },
  {
    "name": "Tommy Biz",
    "username": "tommy.biztalk",
    "followers": 17500,
    "category": "Business"
  },
  {
    "name": "Sasha Vision",
    "username": "sasha.vision",
    "followers": 14300,
    "category": "Business"
  },
  {
    "name": "Ben Builder",
    "username": "ben.builder",
    "followers": 19800,
    "category": "Business"
  },
  {
    "name": "Olivia Money",
    "username": "olivia.money",
    "followers": 18700,
    "category": "Business"
  },
  {
    "name": "Jasper Brand",
    "username": "jasper.brand",
    "followers": 15600,
    "category": "Business"
  },
  {
    "name": "Fay Scale",
    "username": "fay.scaleup",
    "followers": 23000,
    "category": "Business"
  },
  {
    "name": "Rick Founders",
    "username": "rick.founders",
    "followers": 25100,
    "category": "Business"
  },
  {
    "name": "Zoe Lean",
    "username": "zoe.leanops",
    "followers": 14400,
    "category": "Business"
  },
  {
    "name": "Lucas Fit",
    "username": "lucas.fitlife",
    "followers": 31000,
    "category": "Fitness"
  },
  {
    "name": "Hannah Gym",
    "username": "hannah.strong",
    "followers": 27500,
    "category": "Fitness"
  },
  {
    "name": "Alex Shred",
    "username": "alex.shredz",
    "followers": 24800,
    "category": "Fitness"
  },
  {
    "name": "Katie Wellness",
    "username": "katie.wellness",
    "followers": 19900,
    "category": "Fitness"
  },
  {
    "name": "Mike Core",
    "username": "mike.corefit",
    "followers": 16800,
    "category": "Fitness"
  },
  {
    "name": "Isla Moves",
    "username": "isla.moves",
    "followers": 13400,
    "category": "Fitness"
  },
  {
    "name": "Jack Stamina",
    "username": "jack.stamina",
    "followers": 20300,
    "category": "Fitness"
  },
  {
    "name": "Clara Flow",
    "username": "clara.flowmotion",
    "followers": 15900,
    "category": "Fitness"
  },
  {
    "name": "Dylan Power",
    "username": "dylan.powerfit",
    "followers": 22700,
    "category": "Fitness"
  },
  {
    "name": "Lea Sweat",
    "username": "lea.sweatlife",
    "followers": 18400,
    "category": "Fitness"
  }
]

// 📁 /prisma/seed.ts (partial)
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const creators = JSON.parse(fs.readFileSync('./prisma/real_creators_seed.json', 'utf8'));

async function main() {
  for (const creator of creators) {
    await prisma.creator.create({
      data: {
        name: creator.name,
        instagramHandle: creator.username,
        followerCount: creator.followers,
        category: creator.category,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// 🔁 Then run:
// npx prisma db seed
