const testimonials = [
  {
    quote: "Siora connected us with creators who truly get our brand.",
    name: "Alex R.",
    role: "Brand marketer",
  },
  {
    quote: "Finally, deals that respect my work and audience.",
    name: "Jamie L.",
    role: "Lifestyle creator",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2 px-4">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-xl"
          >
            <p className="text-lg italic">“{t.quote}”</p>
            <p className="mt-4 text-sm text-white/70">— {t.name}, {t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
