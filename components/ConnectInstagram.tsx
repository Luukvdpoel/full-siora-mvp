'use client';
import React from 'react';

export function ConnectInstagramButton() {
  const handleClick = () => {
    const clientId = process.env.NEXT_PUBLIC_IG_APP_ID!;
    const redirectUri = encodeURIComponent(`${process.env.NEXTAUTH_URL}/api/instagram/callback`);

    const oauthUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=instagram_basic,user_profile&response_type=code`;

    window.location.href = oauthUrl;
  };

  return (
    <button onClick={handleClick} className="px-4 py-2 bg-indigo-600 text-white rounded">
      Connect Instagram
    </button>
  );
}
