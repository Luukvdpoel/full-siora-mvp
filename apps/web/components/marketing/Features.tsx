import { Heart, ShieldCheck, FileText, Pencil, Search, Handshake } from "lucide-react";

const valueProps = [
  { icon: Heart, title: "Match by voice & values", desc: "Find partners who align beyond metrics." },
  { icon: ShieldCheck, title: "Creator-first fairness checks", desc: "Every brief passes a fairness baseline." },
  { icon: FileText, title: "Briefs & personas generated for you", desc: "Skip the busywork with AI-drafted docs." },
];

const steps = [
  { icon: Pencil, title: "Create", desc: "Tell us what you’re about." },
  { icon: Search, title: "Match", desc: "We surface fits that share your values." },
  { icon: Handshake, title: "Collaborate", desc: "Run campaigns that feel right." },
];

const Features = () => {
  return (
    <section id="features" className="py-16 space-y-16">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Why Siora
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {valueProps.map((f) => (
          <article
            key={f.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 text-center"
          >
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-500">
              <f.icon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-white/70">{f.desc}</p>
          </article>
        ))}
      </div>
      <div className="text-center">
        <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">How it works</h3>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {steps.map((s) => (
          <article
            key={s.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 text-center"
          >
            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-500">
              <s.icon className="size-5" />
            </div>
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-white/70">{s.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Features;
