import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json().catch(() => ({}));
  const pack = String(body.pack || "100");
  const priceMap: Record<string, string | undefined> = {
    "100": process.env.STRIPE_PRICE_PACK_100,
    "500": process.env.STRIPE_PRICE_PACK_500,
    "2000": process.env.STRIPE_PRICE_PACK_2000,
  };
  const price = priceMap[pack];
  if (!price) return new Response("Invalid pack", { status: 400 });

  const email = (await currentUser())?.emailAddresses?.[0]?.emailAddress;
  if (!email) return new Response("No email", { status: 400 });
  const brand = await prisma.brand.findFirst({ where: { owner: { email } } });
  if (!brand) return new Response("Brand not found", { status: 404 });

  let customerId = brand.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email, name: brand.name, metadata: { brandId: brand.id } });
    customerId = customer.id;
    await prisma.brand.update({ where: { id: brand.id }, data: { stripeCustomerId: customerId } });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?credits=${pack}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    metadata: { brandId: brand.id, kind: "CREDITS", pack },
  });

  return Response.json({ url: session.url });
}
