import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';
import type { Context } from './context';
import { prisma } from '@/lib/auth';

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const appRouter = t.router({
  getCreators: t.procedure
    .input(
      z.object({
        search: z.string().optional(),
        tone: z.string().optional(),
        values: z.array(z.string()).optional(),
        minFollowers: z.number().optional(),
        maxFollowers: z.number().optional(),
        niche: z.string().optional(),
        persona: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const where: any = {};
      if (input.tone) where.tone = { contains: input.tone, mode: 'insensitive' };
      if (input.niche) where.niche = { contains: input.niche, mode: 'insensitive' };
      if (input.persona)
        where.brandPersona = { contains: input.persona, mode: 'insensitive' };
      if (input.minFollowers || input.maxFollowers)
        where.followers = {
          gte: input.minFollowers ?? undefined,
          lte: input.maxFollowers ?? undefined,
        };

      const creators = await prisma.creatorProfile.findMany({ where });

      const search = input.search?.toLowerCase();
      const values = input.values?.map((v) => v.toLowerCase());

      const scored = creators.map((c) => {
        let score = 0;
        if (search) {
          if (c.name.toLowerCase().includes(search)) score += 2;
          if (c.handle.toLowerCase().includes(search)) score += 3;
          if (c.niche.toLowerCase().includes(search)) score += 1;
        }
        if (values && Array.isArray(c.values)) {
          const match = values.filter((v) => (c.values as string[]).some((cv) => cv.toLowerCase().includes(v))).length;
          score += match;
        }
        return { c, score };
      });

      scored.sort((a, b) => b.score - a.score);

      return scored.map((s) => s.c);
    }),
});

export type AppRouter = typeof appRouter;
