import React from 'react';
export default function MarketingPage() {
  return (
    <main className="min-h-screen text-gray-900 dark:text-white bg-white dark:bg-gradient-radial dark:from-Siora-dark dark:via-Siora-mid dark:to-Siora-light">
      <section className="flex flex-col items-center justify-center text-center gap-6 px-4 py-24 sm:py-32 bg-gradient-to-b from-white via-zinc-50 to-zinc-100 dark:from-transparent dark:via-Siora-mid/50 dark:to-transparent">
        <h1 className="text-4xl sm:text-6xl font-extrabold max-w-3xl">
          Match with aligned creators or brands using AI personas
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-300">
          Siora learns your unique vibe and connects you with partners that share your values.
        </p>
        <div className="flex gap-4">
          <a href="/signup" className="px-6 py-3 rounded-full bg-Siora-accent text-white font-semibold hover:bg-Siora-hover">Sign Up</a>
          <a href="/auth/login" className="px-6 py-3 rounded-full border border-Siora-accent text-Siora-accent hover:bg-Siora-accent hover:text-white">Log In</a>
        </div>
      </section>

      <section className="py-24 px-4 space-y-16">
        <div className="max-w-5xl mx-auto grid gap-12 md:grid-cols-3 text-center">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Craft your persona</h3>
            <p className="text-zinc-600 dark:text-zinc-300">Our AI analyzes your content and goals to shape an authentic profile that stands out.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Find perfect matches</h3>
            <p className="text-zinc-600 dark:text-zinc-300">Discover creators or brands that resonate with your audience and aesthetic.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Grow together</h3>
            <p className="text-zinc-600 dark:text-zinc-300">Build lasting partnerships and track results with our simple collaboration tools.</p>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 text-center bg-gradient-to-r from-Siora-accent to-Siora-accent-soft text-white">
        <h2 className="text-3xl font-bold mb-6">Ready to find your perfect match?</h2>
        <a href="/signup" className="inline-block px-8 py-4 bg-white text-Siora-accent font-semibold rounded-full">Create Your Account</a>
      </section>
    </main>
  );
}
