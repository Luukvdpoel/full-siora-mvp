export default function BillingSuccess() {
  return (
    <section className="mx-auto max-w-3xl py-14">
      <h1 className="text-3xl font-semibold">Thanks for upgrading!</h1>
      <p className="mt-2 text-white/70">Your subscription is active.</p>
      <a href="/dashboard" className="mt-4 inline-block rounded-xl border border-white/15 px-4 py-2 hover:bg-white/5">
        Go to dashboard
      </a>
    </section>
  );
}
