import { initTRPC } from '@trpc/server';
import { prisma } from '@/lib/auth';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  filterCreators: t.procedure
    .input(
      z.object({
        query: z.string().optional(),
        tone: z.string().optional(),
        platform: z.string().optional(),
        values: z.array(z.string()).optional(),
        minFollowers: z.number().optional(),
        maxFollowers: z.number().optional(),
        niche: z.string().optional(),
        persona: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const creators = await prisma.creator.findMany();

      const results = creators.filter((c) => {
        const q = input.query?.toLowerCase() || '';
        const matchQuery =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q);
        const matchTone = !input.tone || c.tone.toLowerCase().includes(input.tone.toLowerCase());
        const matchPlatform = !input.platform || c.platform.toLowerCase().includes(input.platform.toLowerCase());
        const matchNiche = !input.niche || c.niche.toLowerCase().includes(input.niche.toLowerCase());
        const matchFollowers =
          (input.minFollowers ? c.followers >= input.minFollowers : true) &&
          (input.maxFollowers ? c.followers <= input.maxFollowers : true);
        const matchPersona = !input.persona || (c.persona ?? '').toLowerCase().includes(input.persona.toLowerCase());
        const matchValues =
          !input.values ||
          (Array.isArray(c.values) &&
            input.values.every((v) => JSON.stringify(c.values).toLowerCase().includes(v.toLowerCase())));
        return (
          matchQuery &&
          matchTone &&
          matchPlatform &&
          matchNiche &&
          matchFollowers &&
          matchPersona &&
          matchValues
        );
      });

      results.sort((a, b) => b.followers - a.followers);
      return results;
    }),
});

export type AppRouter = typeof appRouter;
