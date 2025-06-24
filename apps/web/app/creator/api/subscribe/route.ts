import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@creator/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { plan } = await req.json();
  const priceId = plan === "pro" ? process.env.PRO_PRICE_ID : process.env.STARTER_PRICE_ID;
  if (!priceId) {
    return new Response("Price not configured", { status: 500 });
  }
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email || undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    cancel_url: `${process.env.NEXTAUTH_URL}/subscribe?canceled=1`,
    metadata: { userId: session.user.id, plan },
  });
  return new Response(JSON.stringify({ url: checkout.url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
