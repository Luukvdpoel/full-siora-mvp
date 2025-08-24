import { getBrandForUser } from "@/lib/guards";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default async function Pricing() {
  const brand = await getBrandForUser();

  return (
    <section className="mx-auto max-w-3xl py-14">
      <h1 className="text-3xl font-semibold">Pricing</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 p-5">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mt-1 text-white/70">Browse sample creators</p>
          <a href="/dashboard" className="mt-4 inline-block rounded-xl border border-white/15 px-4 py-2 hover:bg-white/5">
            Continue
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 p-5">
          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="mt-1 text-white/70">Full search, shortlist, export</p>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="mt-4 rounded-xl bg-white/90 px-4 py-2 text-gray-900">Sign in to upgrade</button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {brand?.plan === "PRO" ? (
              <form action="/api/billing/portal" method="POST">
                <button className="mt-4 rounded-xl border border-white/15 bg-white/5 px-4 py-2 hover:bg-white/10">
                  Manage billing
                </button>
              </form>
            ) : (
              <form action="/api/checkout" method="POST">
                <button className="mt-4 rounded-xl bg-white/90 px-4 py-2 text-gray-900">Upgrade</button>
              </form>
            )}
          </SignedIn>
        </div>
      </div>
    </section>
  );
}
