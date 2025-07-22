import { InstagramTokenResponse, InstagramProfile } from '@/types/instagram';

export function generateInstagramAuthUrl() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const redirectUri = encodeURIComponent(`${baseUrl}/instagram/callback`);
  const clientId = process.env.NEXT_PUBLIC_IG_APP_ID;
  return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=instagram_basic,user_profile&response_type=code`;
}

export async function exchangeCodeForToken(code: string): Promise<InstagramTokenResponse> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/instagram/callback`;
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_IG_APP_ID ?? '',
    client_secret: process.env.IG_APP_SECRET ?? '',
    redirect_uri: redirectUri,
    code,
  });
  const res = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to exchange code');
  }
  return res.json() as Promise<InstagramTokenResponse>;
}

export async function fetchInstagramUserProfile(accessToken: string): Promise<InstagramProfile> {
  const params = new URLSearchParams({
    fields: 'id,username,account_type,media_count',
    access_token: accessToken,
  });
  const res = await fetch(`https://graph.instagram.com/me?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch profile');
  }
  return res.json() as Promise<InstagramProfile>;
}
