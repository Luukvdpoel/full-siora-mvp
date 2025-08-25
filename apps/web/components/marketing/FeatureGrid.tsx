import { Search, Sparkles, Scale } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Find creators who match your tone",
    desc: "Discover partners that share your brand’s vibe, not just demographics.",
  },
  {
    icon: Sparkles,
    title: "AI match scoring",
    desc: "Go beyond follower counts with smart relevance scoring.",
  },
  {
    icon: Scale,
    title: "Built for fair value",
    desc: "No affiliate-only nonsense—collaborate on equal footing.",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3 px-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-8 shadow-xl"
          >
            <f.icon className="h-8 w-8 text-indigo-500" />
            <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-white/70">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
