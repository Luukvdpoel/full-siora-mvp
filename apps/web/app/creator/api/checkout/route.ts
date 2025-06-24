import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.plan !== "pro") {
    return new Response("Forbidden", { status: 403 });
  }
  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: 499,
          product_data: {
            name: "Media kit PDF",
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/media-kit?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/media-kit?canceled=1`,
  });

  return new Response(JSON.stringify({ url: checkout.url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
