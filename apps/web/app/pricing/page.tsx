import Link from "next/link";

const plans = [
  {
    name: "Free",
    plan: "FREE",
    price: "€0",
    credits: "20 credits / mo",
    features: [
      "Matches & shortlist",
      "Watermarked CSV export",
      "Watermarked public shortlist",
    ],
    highlight: false,
    stripePriceId: null as string | null,
  },
  {
    name: "Starter",
    plan: "STARTER",
    price: "€29",
    credits: "200 credits / mo",
    features: ["Clean CSV export", "No shortlist watermark", "Email support"],
    highlight: false,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE!,
  },
  {
    name: "Pro",
    plan: "PRO",
    price: "€49",
    credits: "500 credits / mo",
    features: [
      "Priority AI matching",
      "Compare mode",
      "AI outreach drafts",
    ],
    highlight: true,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE!,
  },
  {
    name: "Growth",
    plan: "GROWTH",
    price: "€199",
    credits: "3000 credits / mo",
    features: [
      "Team seats (3 included)",
      "Slack support",
      "Early access to new features",
    ],
    highlight: false,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE!,
  },
];

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-center text-4xl font-bold">Pricing</h1>
      <p className="mt-3 text-center text-white/70">
        Start free. Upgrade when you need more reach.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`flex flex-col rounded-2xl border p-6 ${
              p.highlight
                ? "border-indigo-400 bg-indigo-500/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <div className="mt-1 text-3xl font-bold">{p.price}</div>
            <div className="text-sm text-white/70">{p.credits}</div>

            <ul className="mt-4 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/50" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              {p.stripePriceId ? (
                <form action="/api/stripe/checkout" method="POST">
                  <input type="hidden" name="priceId" value={p.stripePriceId} />
                  <input type="hidden" name="plan" value={p.plan} />
                  <button
                    className={`w-full rounded-xl py-2 font-semibold ${
                      p.highlight
                        ? "bg-indigo-500 text-white hover:bg-indigo-600"
                        : "bg-white text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    Choose {p.name}
                  </button>
                </form>
              ) : (
                <Link
                  href="/signup"
                  className="block w-full rounded-xl bg-white py-2 text-center font-semibold text-gray-900 hover:bg-gray-200"
                >
                  Get started
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

