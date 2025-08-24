import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const runtime = "nodejs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST() {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const email = (await currentUser())?.emailAddresses?.[0]?.emailAddress;
  if (!email) return new Response("No email", { status: 400 });
  const brand = await prisma.brand.findFirst({
    where: { owner: { email } },
    select: { id: true, stripeCustomerId: true },
  });
  if (!brand?.stripeCustomerId) return new Response("No customer", { status: 400 });

  const portal = await stripe.billingPortal.sessions.create({
    customer: brand.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return Response.json({ url: portal.url });
}
