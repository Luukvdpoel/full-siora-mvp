'use client';
import { generateInstagramAuthUrl } from '@/utils/instagram';

export function InstagramLoginButton() {
  const handleClick = () => {
    window.location.href = generateInstagramAuthUrl();
  };
  return (
    <button onClick={handleClick} className="px-4 py-2 bg-pink-600 text-white rounded">
      Login with Instagram
    </button>
  );
}
