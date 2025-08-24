import { Handshake, Sparkles, Users } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Find creators who match your tone',
    desc: 'Search beyond follower counts to discover creators that fit your brand voice.',
  },
  {
    icon: Sparkles,
    title: 'AI match scoring',
    desc: 'Smart recommendations that focus on fit, not vanity metrics.',
  },
  {
    icon: Handshake,
    title: 'Built for fair value',
    desc: 'Transparent deals without affiliate-only nonsense.',
  },
];

export default function FeatureGrid() {
  return (
    <section id="how" className="mx-auto grid max-w-5xl gap-8 px-6 py-24 sm:grid-cols-3">
      {features.map((f) => (
        <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 text-center shadow-xl">
          <f.icon className="mx-auto h-10 w-10 text-indigo-500" />
          <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
          <p className="mt-2 text-sm text-white/70">{f.desc}</p>
        </div>
      ))}
    </section>
  );
}
