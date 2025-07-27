import React from 'react';
import { Hero } from 'shared-ui';
export default function Page() {
  return (
    <main className="min-h-screen text-center text-gray-900 space-y-32">
      <Hero
        title="Match with brands based on your vibe, not your follower count"
        ctaLabel="Learn how"
        ctaHref="#story"
        fullHeight
        className="bg-gradient-to-b from-white to-indigo-50"
      />

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
      <footer className="py-16 bg-gradient-to-b from-Siora-dark via-Siora-mid to-Siora-light text-white">
        <a
          href="/signup"
          className="inline-block px-8 py-4 bg-Siora-accent hover:bg-Siora-accent-soft rounded-full font-semibold"
        >
          Join the Waitlist
        </a>
      </footer>
    </main>
  );
}
