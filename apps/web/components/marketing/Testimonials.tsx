const testimonials = [
  {
    quote: 'Siora connected us with creators that truly matched our vibe. Our campaign ROI doubled.',
    name: 'Lena – Brand Marketer',
  },
  {
    quote: 'Finally a platform that values creative fit over follower counts.',
    name: 'Marco – Content Creator',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-black/40 py-24">
      <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-2">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl">
            <p className="text-white/80">“{t.quote}”</p>
            <p className="mt-4 text-sm text-white/60">{t.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
