import React from 'react';
'use client';

export default function CopyLinkButton() {
  const handleCopy = () => {
    if (typeof window === 'undefined') return;
    navigator.clipboard.writeText(window.location.href).catch((err) => {
      console.error('Failed to copy', err);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="bg-indigo-600 hover:bg-indigo-500 transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-md"
    >
      Copy link
    </button>
  );
}
