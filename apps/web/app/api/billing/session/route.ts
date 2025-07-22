import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { plan, portal } = await req.json();

  if (portal) {
    const customers = await stripe.customers.list({ email: session.user.email, limit: 1 });
    if (customers.data.length === 0) {
      return new Response("No customer", { status: 400 });
    }
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${process.env.NEXTAUTH_URL}/billing`,
    });
    return new Response(JSON.stringify({ url: portalSession.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const priceId = plan === "business" ? process.env.BRAND_BUSINESS_PRICE_ID : process.env.BRAND_PRO_PRICE_ID;
  if (!priceId) {
    return new Response("Price not configured", { status: 500 });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/billing`,
    cancel_url: `${process.env.NEXTAUTH_URL}/billing?canceled=1`,
    metadata: { userId: session.user.id, plan },
  });
  return new Response(JSON.stringify({ url: checkout.url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
