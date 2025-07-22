import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch (err) {
    return new NextResponse("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const data = event.data.object as any;
    const userId = data.metadata?.userId as string | undefined;
    const plan = data.metadata?.plan as string | undefined;
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { plan: plan || "pro", billingStatus: "active" },
      });
    }
  } else if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as any;
    const email = invoice.customer_email as string | undefined;
    if (email) {
      await prisma.user.updateMany({ where: { email }, data: { billingStatus: "past_due" } });
    }
  }

  return NextResponse.json({ received: true });
}
