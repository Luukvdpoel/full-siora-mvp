import { NextResponse } from "next/server";
import {
  exchangeCodeForToken,
  fetchInstagramUserProfile,
  INSTAGRAM_REDIRECT_URI,
} from "@/lib/instagram";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }
    const token = await exchangeCodeForToken(code, INSTAGRAM_REDIRECT_URI);
    const profile = await fetchInstagramUserProfile(token.access_token);
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Instagram auth error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
