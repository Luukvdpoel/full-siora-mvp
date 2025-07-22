import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/instagram/callback`;

  try {
    const { data } = await axios.get(
      `https://graph.facebook.com/v19.0/oauth/access_token`,
      {
        params: {
          client_id: process.env.NEXT_PUBLIC_IG_APP_ID,
          client_secret: process.env.IG_APP_SECRET,
          redirect_uri: redirectUri,
          code,
        },
      }
    );

    const accessToken = data.access_token;

    res.redirect(`/api/instagram/profile?access_token=${accessToken}`);
  } catch (err) {
    console.error('OAuth error:', err);
    res.status(500).send('OAuth failed');
  }
}
