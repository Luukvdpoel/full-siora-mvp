import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    async signIn({ user, profile }) {
      if (user.id) {
        await prisma.user.upsert({
          where: { id: user.id },
          update: {
            name: user.name ?? profile?.name ?? undefined,
            email: user.email ?? profile?.email ?? undefined,
            role: (user as { role?: string }).role ?? undefined,
          },
          create: {
            id: user.id,
            name: user.name ?? profile?.name ?? null,
            email: user.email ?? profile?.email ?? null,
            role: (user as { role?: string }).role ?? null,
          },
        });

        const existing = await prisma.user.findUnique({ where: { id: user.id } });
        if (existing?.role) return true;

        if (user.email) {
          const invite = await prisma.invite.findFirst({
            where: { email: user.email, used: false },
          });
          if (invite) {
            await prisma.user.update({
              where: { id: user.id },
              data: { role: invite.role },
            });
            await prisma.invite.update({
              where: { id: invite.id },
              data: { used: true },
            });
            return true;
          }
        }

        return false;
      }
      return false;
    },
    async session({ session, user }) {
      if (session.user) {
        (session.user as { id?: string; plan?: string; role?: string; billingStatus?: string }).id = user.id;
        (session.user as { id?: string; plan?: string; role?: string; billingStatus?: string }).plan = (user as { plan?: string }).plan ?? "free";
        (session.user as { id?: string; plan?: string; role?: string; billingStatus?: string }).role = (user as { role?: string | null }).role ?? undefined;
        (session.user as { id?: string; plan?: string; role?: string; billingStatus?: string }).billingStatus = (user as { billingStatus?: string }).billingStatus ?? "none";
      }
      return session;
    },
  },
};

export { prisma };
