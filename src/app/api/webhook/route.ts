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

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      const db = getDb();

      try {
        // Update user to has_paid = true
        await db
          .update(userProfiles)
          .set({ hasPaid: true, updatedAt: new Date() })
          .where(eq(userProfiles.id, userId));

        // Log the payment
        await db.insert(payments).values({
          userId,
          amount: Math.round(session.amount_total! / 100),
          currency: session.currency?.toUpperCase() || "USD",
          status: "completed",
          provider: "stripe",
          providerPaymentId: session.payment_intent as string,
          paymentType: "one_time",
        });

        console.log(`User ${userId} upgraded to premium`);
      } catch (error) {
        console.error("Failed to update user payment status:", error);
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
