import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { authServer } from "@/lib/auth/server";

export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to purchase" },
        { status: 401 }
      );
    }

    const { cvId } = await request.json();

    const checkoutSession = await createCheckoutSession(
      session.user.id,
      session.user.email,
      cvId
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
