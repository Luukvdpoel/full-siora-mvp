import { Mic2, ShieldCheck, WandSparkles } from "lucide-react";

const features = [
  {
    icon: Mic2,
    title: "Match by voice & values",
    desc: "Reach partners who sound like you. Siora looks beyond audience stats to find true fit.",
  },
  {
    icon: ShieldCheck,
    title: "Creator-first fairness checks",
    desc: "Our safeguards keep deals transparent and respectful for every creator.",
  },
  {
    icon: WandSparkles,
    title: "Briefs & personas generated for you",
    desc: "AI drafts what you need so you can skip the busywork and start collaborating.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Why Siora
        </h2>
        <p className="mt-3 text-white/70">
          Premium tools for campaigns that actually resonate.
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
