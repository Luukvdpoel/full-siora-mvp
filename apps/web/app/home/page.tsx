import React from 'react';
export default function Page() {
  return (
    <main className="min-h-screen text-center text-gray-900 space-y-32">
      <section className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-indigo-50 px-4">
        <h1 className="text-4xl sm:text-6xl font-extrabold max-w-2xl">Match with brands based on your vibe, not your follower count</h1>
        <a href="#story" className="mt-10 px-6 py-3 bg-black text-white rounded-full">Learn how</a>
      </section>

      <section id="story" className="space-y-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p>Create your persona in minutes. We analyse your content style and goals to craft an authentic profile brands love.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold">Creator Proof</h2>
          <p>Thousands of creators use Siora personas to stand out and attract deals that actually fit their vibe.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold">Brand Wins</h2>
          <p>Brands save hours searching and connect with personalities that truly resonate with their audience.</p>
        </div>
        <div className="text-center">
          <a href="/preview" className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-full">Preview My Persona</a>
        </div>
      </section>
    </main>
  );
}
