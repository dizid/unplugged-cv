import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, userProfiles } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    // Get user's Stripe customer ID
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, session.user.id))
      .limit(1);

    if (!profile?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const stripe = getStripe();

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/app/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Failed to access billing portal" },
      { status: 500 }
    );
  }
}
