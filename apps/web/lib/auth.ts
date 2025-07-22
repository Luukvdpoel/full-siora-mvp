import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
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
      }
      return true;
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
