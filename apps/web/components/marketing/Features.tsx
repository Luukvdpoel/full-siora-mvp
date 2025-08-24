import { Briefcase, Search, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Briefcase,
    title: 'Smart briefs',
    desc: 'Kick off collaborations with structured briefs that clarify goals, deliverables, timelines, and usage rights.',
  },
  {
    icon: Search,
    title: 'Creator discovery',
    desc: 'Find the right fit with filters for audience, values, and performance — not just follower counts.',
  },
  {
    icon: BarChart3,
    title: 'Shared analytics',
    desc: 'Track content performance across channels with transparent, privacy-safe metrics both sides can trust.',
  },
]

const Features = () => {
  return (
    <section id="features" className="relative">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Designed for people and brands to meet in the middle
          </h2>
          <p className="mt-3 text-muted-foreground">
            Reduce friction, increase signal, and collaborate with clarity.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="group relative rounded-xl border border-[hsl(var(--brand)/0.2)] bg-card/50 p-6 shadow-sm backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_hsl(var(--brand)/0.35)]"
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-[hsl(var(--brand)/0.1)] text-[hsl(var(--brand))]">
                <f.icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
