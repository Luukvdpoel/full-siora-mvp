import React from 'react';
'use client';
import { useState } from 'react';

interface Persona {
  name: string;
  summary: string;
}

const sample: Persona = {
  name: 'Creative Casey',
  summary: 'A vibrant storyteller who mixes everyday adventures with a playful tone. Brands love Casey for genuine engagement and a fresh perspective.'
};

export default function PreviewPage() {
  const [show, setShow] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6">
      {!show ? (
        <form onSubmit={(e)=>{e.preventDefault(); setShow(true);}} className="space-y-4">
          <input type="text" placeholder="Your handle" className="border p-2 rounded" />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" type="submit">Generate</button>
        </form>
      ) : (
        <div className="max-w-lg border p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-2">{sample.name}</h2>
          <p>{sample.summary}</p>
        </div>
      )}
    </main>
  );
}
