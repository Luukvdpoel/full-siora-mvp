import type { InstagramAccessTokenResponse, InstagramUserProfile } from "@/types/instagram";

export const INSTAGRAM_REDIRECT_URI = "http://localhost:3000/instagram/callback";

export function generateInstagramAuthUrl() {
  const appId = process.env.NEXT_PUBLIC_IG_APP_ID;
  const redirect = encodeURIComponent(INSTAGRAM_REDIRECT_URI);
  return `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirect}&scope=user_profile&response_type=code`;
}

export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<InstagramAccessTokenResponse> {
  const params = new URLSearchParams();
  params.append("client_id", process.env.NEXT_PUBLIC_IG_APP_ID!);
  params.append("client_secret", process.env.IG_APP_SECRET!);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", redirectUri);
  params.append("code", code);

  const res = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    body: params,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch access token");
  }

  return (await res.json()) as InstagramAccessTokenResponse;
}

export async function fetchInstagramUserProfile(accessToken: string): Promise<InstagramUserProfile> {
  const res = await fetch(
    `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return (await res.json()) as InstagramUserProfile;
}
