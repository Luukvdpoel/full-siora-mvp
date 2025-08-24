import { prisma } from "@/lib/prisma";
import { addCredits } from "@/lib/credits";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const text = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(text, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription") {
          const subId = session.subscription as string | null;
          const brandId =
            (session.metadata?.brandId as string) ||
            (session.subscription && (await stripe.subscriptions.retrieve(session.subscription as string)).metadata?.brandId);
          if (brandId && subId) {
            const sub = await stripe.subscriptions.retrieve(subId);
            await prisma.brand.update({
              where: { id: brandId },
              data: {
                plan: "PRO",
                stripeSubscriptionId: sub.id,
                currentPeriodEnd: new Date(sub.current_period_end * 1000),
              },
            });
          }
        }

        if (session.mode === "payment") {
          const brandId = session.metadata?.brandId as string | undefined;
          const pack = session.metadata?.pack as string | undefined;
          let credits = 0;
          if (pack === "100") credits = 100;
          else if (pack === "500") credits = 500;
          else if (pack === "2000") credits = 2000;
          if (brandId && credits > 0) {
            await addCredits(brandId, credits, `Stripe payment ${session.id}`);
          }
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const brandId = sub.metadata?.brandId as string | undefined;
        if (brandId) {
          await prisma.brand.update({
            where: { id: brandId },
            data: {
              plan: "PRO",
              stripeSubscriptionId: sub.id,
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
            },
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const brandId = sub.metadata?.brandId as string | undefined;
        if (brandId) {
          await prisma.brand.update({
            where: { id: brandId },
            data: {
              plan: "FREE",
              stripeSubscriptionId: null,
              currentPeriodEnd: null,
            },
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (e: any) {
    return new Response(`Webhook handler error: ${e.message}`, { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
