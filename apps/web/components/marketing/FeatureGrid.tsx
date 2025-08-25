import { Users, Gauge, Handshake } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Find creators who match your tone',
    desc: 'Discover partners by vibe, not vanity metrics.',
  },
  {
    icon: Gauge,
    title: 'AI match scoring (not just follower counts)',
    desc: 'We analyze values, style and audience fit.',
  },
  {
    icon: Handshake,
    title: 'Built for fair value — no affiliate-only nonsense',
    desc: 'Transparent collaborations that respect everyone.',
  },
];

export default function FeatureGrid() {
  return (
    <section id="how" className="mx-auto mt-24 max-w-6xl px-4">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 text-left shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <f.icon className="mb-4 h-8 w-8 text-indigo-500" />
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
