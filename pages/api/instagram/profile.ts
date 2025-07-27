import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { access_token } = req.query;

  try {
    const userRes = await axios.get("https://graph.instagram.com/me", {
      params: {
        fields: "id,username,account_type,media_count",
        access_token,
      },
    });

    const profile = userRes.data;

    // Store to DB if needed here

    res.status(200).json(profile);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch Instagram profile" });
  }
}
