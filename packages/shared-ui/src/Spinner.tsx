import React from 'react';
"use client";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-10" aria-label="Loading">
      <div className="h-6 w-6 border-4 border-current border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
