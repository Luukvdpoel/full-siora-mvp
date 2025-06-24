import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const appRouter = t.router({
  searchCreators: t.procedure
    .input(
      z.object({
        query: z.string().optional(),
        tone: z.string().optional(),
        values: z.array(z.string()).optional(),
        minFollowers: z.number().optional(),
        maxFollowers: z.number().optional(),
        niche: z.string().optional(),
        persona: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const all = await ctx.prisma.creatorProfile.findMany();
      const filterValues = (vals: any) =>
        Array.isArray(vals) ? vals.map((v) => String(v).toLowerCase()) : [];
      const filtered = all.filter((c) => {
        if (input.tone && !c.tone.toLowerCase().includes(input.tone.toLowerCase()))
          return false;
        if (input.niche && !c.niche.toLowerCase().includes(input.niche.toLowerCase()))
          return false;
        if (input.persona && !c.brandPersona.toLowerCase().includes(input.persona.toLowerCase()))
          return false;
        if (input.minFollowers && c.followers < input.minFollowers) return false;
        if (input.maxFollowers && c.followers > input.maxFollowers) return false;
        if (input.values && input.values.length > 0) {
          const cvals = filterValues(c.values);
          if (!input.values.some((v) => cvals.includes(v.toLowerCase()))) return false;
        }
        if (input.query) {
          const q = input.query.toLowerCase();
          if (
            !c.name.toLowerCase().includes(q) &&
            !c.handle.toLowerCase().includes(q)
          )
            return false;
        }
        return true;
      });
      const score = (c: typeof filtered[number]) => {
        let s = 0;
        if (input.query) {
          const q = input.query.toLowerCase();
          if (c.handle.toLowerCase() === q) s += 3;
          else if (c.handle.toLowerCase().includes(q)) s += 2;
          else if (c.name.toLowerCase().includes(q)) s += 1;
        }
        if (input.tone && c.tone.toLowerCase().includes(input.tone.toLowerCase())) s += 1;
        if (input.niche && c.niche.toLowerCase().includes(input.niche.toLowerCase())) s += 1;
        if (input.persona && c.brandPersona.toLowerCase().includes(input.persona.toLowerCase())) s += 1;
        if (input.values && input.values.length > 0) {
          const cvals = filterValues(c.values);
          input.values.forEach((v) => {
            if (cvals.includes(v.toLowerCase())) s += 1;
          });
        }
        return s;
      };
      return filtered
        .map((c) => ({ c, s: score(c) }))
        .sort((a, b) => b.s - a.s)
        .map(({ c }) => c);
    }),
});

export type AppRouter = typeof appRouter;
