const steps = [
  { title: "Create", desc: "Set up your profile and goals." },
  { title: "Match", desc: "We pair brands and creators by values." },
  { title: "Collaborate", desc: "Run fair deals with shared tools." },
];

const HowItWorks = () => {
  return (
    <section className="py-16">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">How it works</h2>
      </div>
      <ol className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="text-center">
            <div className="mb-4 text-3xl text-indigo-500">{i + 1}</div>
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-white/70">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default HowItWorks;
