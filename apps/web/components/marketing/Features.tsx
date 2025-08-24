import { Briefcase, Search, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Smart briefs",
    desc: "Kick off collaborations with structured briefs that clarify goals, deliverables, timelines, and usage rights.",
  },
  {
    icon: Search,
    title: "Creator discovery",
    desc: "Find the right fit with filters for audience, values, and performance — not just follower counts.",
  },
  {
    icon: BarChart3,
    title: "Shared analytics",
    desc: "Track content performance across channels with transparent, privacy-safe metrics both sides can trust.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Designed for people and brands to meet in the middle
        </h2>
        <p className="mt-3 text-white/70">
          Reduce friction, increase signal, and collaborate with clarity.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <article
            key={f.title}
            className="rounded-xl border border-Siora-border bg-gray-900/50 p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-Siora-accent/10 text-Siora-accent">
              <f.icon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-white/70">{f.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Features;
