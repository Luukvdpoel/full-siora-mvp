import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: DefaultSession["user"] & { id: string; plan?: string };
  }
}
