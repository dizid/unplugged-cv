import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

// One-time payment for all premium features ($10)
export const PRICE_AMOUNT = 1000; // $10.00 in cents
export const PRICE_CURRENCY = "usd";

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  cvId?: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: PRICE_CURRENCY,
          product_data: {
            name: "CV Builder Premium",
            description: "PDF download, public CV page, save history - lifetime access",
          },
          unit_amount: PRICE_AMOUNT,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      cvId: cvId || "",
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}?canceled=true`,
  });

  return session;
}
