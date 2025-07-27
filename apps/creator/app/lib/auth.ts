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
    signIn: "/auth/login",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as { id?: string; plan?: string; role?: string }).id = user.id;
        (session.user as { id?: string; plan?: string; role?: string }).plan = (user as { plan?: string }).plan ?? "free";
        (session.user as { id?: string; plan?: string; role?: string }).role = (user as { role?: string | null }).role ?? undefined;
      }
      return session;
    },
  },
};

export { prisma };
