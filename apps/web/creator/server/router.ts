import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';
import { prisma } from '@creator/lib/auth';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({ transformer: superjson });

export const appRouter = t.router({
  saveOnboarding: t.procedure
    .input(z.object({
      name: z.string(),
      handle: z.string(),
      followers: z.number(),
      niche: z.string(),
      tone: z.string(),
      values: z.array(z.string()),
      contentType: z.string(),
      brandPersona: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) throw new Error('Unauthorized');
      return prisma.creatorProfile.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name,
          handle: input.handle,
          followers: input.followers,
          niche: input.niche,
          tone: input.tone,
          values: input.values,
          contentType: input.contentType,
          brandPersona: input.brandPersona,
        },
      });
    }),
});

export type AppRouter = typeof appRouter;
