import { NextResponse } from "next/server";
import { getStripe, PRICE_AMOUNT, PRICE_CURRENCY } from "@/lib/stripe";
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

    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      customer_email: session.user.email,
      line_items: [
        {
          price_data: {
            currency: PRICE_CURRENCY,
            product_data: {
              name: "CV Builder Premium",
              description:
                "PDF download, public CV page, save history - lifetime access",
            },
            unit_amount: PRICE_AMOUNT,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        cvId: cvId || "",
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: checkoutSession.client_secret });
  } catch (error) {
    console.error("Embedded checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
