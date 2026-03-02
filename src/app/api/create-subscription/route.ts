import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, userProfiles } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getStripe, SUBSCRIPTION_PRICES } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only one paid tier: Pro ($19/month)
    const priceId = SUBSCRIPTION_PRICES.pro.monthly;

    if (!priceId) {
      return NextResponse.json(
        { error: "Subscription pricing not configured" },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    const db = getDb();

    // Get or create Stripe customer
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, session.user.id))
      .limit(1);

    let customerId = profile?.stripeCustomerId;

    if (!customerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: session.user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID
      if (profile) {
        await db
          .update(userProfiles)
          .set({ stripeCustomerId: customerId, updatedAt: new Date() })
          .where(eq(userProfiles.id, session.user.id));
      } else {
        await db.insert(userProfiles).values({
          id: session.user.id,
          stripeCustomerId: customerId,
        });
      }
    }

    // Create checkout session for subscription
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/app?subscription=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/app?subscription=canceled`,
      metadata: {
        userId: session.user.id,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
