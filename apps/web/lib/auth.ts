import { promises as fs } from 'fs';
import path from 'path';
import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

interface StoredUser {
  id: string;
  username: string;
  password: string;
}

async function loadUsers(): Promise<StoredUser[]> {
  try {
    const file = await fs.readFile(
      path.join(process.cwd(), '..', '..', 'data', 'users.json'),
      'utf8'
    );
    return JSON.parse(file) as StoredUser[];
  } catch {
    return [];
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const users = await loadUsers();
        const user = users.find(
          (u) =>
            u.username === credentials.username &&
            u.password === credentials.password
        );
        if (!user) return null;
        return { id: user.id, name: user.username } as User;
      },
    }),
  ],
  pages: { signIn: '/signin' },
};
