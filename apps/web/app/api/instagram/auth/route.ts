import { NextResponse } from "next/server";
import { exchangeCodeForToken, fetchInstagramUserProfile } from "@/lib/instagram";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }
    const redirectUri = `${process.env.NEXTAUTH_URL}/instagram/callback`;
    const token = await exchangeCodeForToken(code, redirectUri);
    const profile = await fetchInstagramUserProfile(token.access_token);
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Instagram auth error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
