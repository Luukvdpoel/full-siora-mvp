import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST() {
  try {
    const { userId } = auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const cu = await currentUser();
    const email = cu?.emailAddresses?.[0]?.emailAddress;
    if (!email) return new Response("No email", { status: 400 });

    // find the user's brand
    const user = await prisma.user.findUnique({ where: { email }, include: { brands: true } });
    if (!user || !user.brands[0]) return new Response("Brand not found", { status: 404 });
    const brand = user.brands[0];

    // ensure stripe customer
    let customerId = brand.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email, name: brand.name, metadata: { brandId: brand.id } });
      customerId = customer.id;
      await prisma.brand.update({ where: { id: brand.id }, data: { stripeCustomerId: customerId } });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: process.env.STRIPE_PRICE_PRO!, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      subscription_data: {
        metadata: { brandId: brand.id },
      },
      metadata: { brandId: brand.id, plan: "PRO" },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    Sentry.captureException(err);
    return new Response("Internal error", { status: 500 });
  }
}
