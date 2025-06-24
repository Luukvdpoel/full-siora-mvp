import { getServerSession } from 'next-auth';
import { authOptions, prisma } from '@/lib/auth';

export async function createContext() {
  const session = await getServerSession(authOptions);
  return { session, prisma };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
