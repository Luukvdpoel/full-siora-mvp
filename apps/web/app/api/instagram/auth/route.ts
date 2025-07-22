import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { exchangeCodeForToken, fetchInstagramUserProfile } from '@/utils/instagram';
import type { InstagramProfile } from '@/types/instagram';

const DB_PATH = path.join(process.cwd(), '..', '..', '..', '..', 'db', 'instagram_accounts.json');

async function readData(): Promise<Record<string, any>> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeData(data: Record<string, any>) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'code required' }, { status: 400 });
    }
    const tokenRes = await exchangeCodeForToken(code);
    const profile: InstagramProfile = await fetchInstagramUserProfile(tokenRes.access_token);

    const db = await readData();
    db[profile.id] = { ...profile, access_token: tokenRes.access_token };
    await writeData(db);

    return NextResponse.json({ profile });
  } catch (err) {
    console.error('Instagram auth error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
