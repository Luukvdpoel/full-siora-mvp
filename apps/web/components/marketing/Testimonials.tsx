const testimonials = [
  {
    quote: 'Siora helped us find perfect creator matches without the hassle.',
    author: 'A happy brand',
  },
  {
    quote: 'Finally a platform that values creators fairly.',
    author: 'A grateful creator',
  },
];

export default function Testimonials() {
  return (
    <section id="creators" className="mx-auto mt-24 max-w-6xl px-4">
      <div className="grid gap-8 md:grid-cols-2">
        {testimonials.map((t) => (
          <div
            key={t.author}
            className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
          >
            <p className="text-lg italic text-zinc-300">“{t.quote}”</p>
            <p className="mt-4 text-sm text-zinc-400">— {t.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
