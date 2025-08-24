import CreditBadge from "../(components)/CreditBadge";
import { BuyCredits } from "@/components/BuyCredits";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function BillingPage() {
  return (
    <section className="mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-semibold">Billing</h1>
      <p className="mt-1 text-white/70">Manage your plan and credits.</p>

      <div className="mt-6 flex items-center gap-3">
        {/* @ts-expect-error Server Component */}
        <CreditBadge />
        <form action="/api/billing/portal" method="POST">
          <button className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
            Manage subscription
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Buy credits</h2>
        <SignedOut>
          <div className="mt-2">
            <SignInButton mode="modal">
              <button className="rounded-xl bg-white/90 px-4 py-2 text-gray-900">
                Sign in to purchase
              </button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="mt-3">
            <BuyCredits />
          </div>
        </SignedIn>
      </div>
    </section>
  );
}
