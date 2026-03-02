import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getStripe } from "@/lib/stripe";
import { getDb, userProfiles, payments } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const db = getDb();

  try {
    switch (event.type) {
      // One-time payment completed (legacy)
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId && session.mode === "payment") {
          // Legacy one-time payment
          await db
            .update(userProfiles)
            .set({ hasPaid: true, updatedAt: new Date() })
            .where(eq(userProfiles.id, userId));

          await db.insert(payments).values({
            userId,
            amount: Math.round(session.amount_total! / 100),
            currency: session.currency?.toUpperCase() || "USD",
            status: "completed",
            provider: "stripe",
            providerPaymentId: session.payment_intent as string,
            paymentType: "one_time",
          });

          console.log(`User ${userId} completed one-time payment`);
        }
        break;
      }

      // Subscription created or updated
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          const status = subscription.status === "active" ? "active" : subscription.status;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Stripe clover API types don't expose current_period_end
          const periodEnd = (subscription as any).current_period_end as number | undefined;
          const endsAt = periodEnd ? new Date(periodEnd * 1000) : null;

          await db
            .update(userProfiles)
            .set({
              subscriptionStatus: status,
              subscriptionTier: "pro",
              stripeSubscriptionId: subscription.id,
              subscriptionEndsAt: endsAt,
              updatedAt: new Date(),
            })
            .where(eq(userProfiles.id, userId));

          console.log(`User ${userId} subscription ${event.type}: ${status} (pro)`);
        }
        break;
      }

      // Subscription canceled or deleted
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await db
            .update(userProfiles)
            .set({
              subscriptionStatus: "canceled",
              subscriptionEndsAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(userProfiles.id, userId));

          console.log(`User ${userId} subscription canceled`);
        }
        break;
      }

      // Payment failed
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Stripe clover API types don't expose subscription on Invoice
        const sub = (invoice as any).subscription;
        const subscriptionId = typeof sub === 'string' ? sub : sub?.id || null;

        if (subscriptionId) {
          // Get subscription to find user
          const stripe = getStripe();
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata?.userId;

          if (userId) {
            await db
              .update(userProfiles)
              .set({
                subscriptionStatus: "past_due",
                updatedAt: new Date(),
              })
              .where(eq(userProfiles.id, userId));

            console.log(`User ${userId} subscription payment failed`);
          }
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
