import Stripe from "stripe";

// Lazy initialization to avoid build-time errors when env vars aren't available
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
    });
  }
  return _stripe;
}

// Legacy one-time payment (still supported for existing users)
export const PRICE_AMOUNT = 1900; // $19.00 in cents
export const PRICE_CURRENCY = "usd";

// Subscription tiers (simplified: Free + Pro only)
export type SubscriptionTier = "free" | "pro";

export const SUBSCRIPTION_PRICES = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    amount: 1900, // $19/month
  },
};

// Tier limits (-1 = unlimited)
export const TIER_LIMITS = {
  free: {
    applications: 5,
    interviews: 3,
    reminders: 5,
    pdfExport: false,
    coverLetters: false,
    pipelineView: false,
  },
  pro: {
    applications: -1, // unlimited
    interviews: -1,
    reminders: -1,
    pdfExport: true,
    coverLetters: true,
    pipelineView: true,
  },
};

// Helper to get user's effective tier
export function getEffectiveTier(
  hasPaid: boolean,
  subscriptionStatus?: string | null
): SubscriptionTier {
  // Legacy one-time payment users get pro tier
  if (hasPaid) return "pro";

  // Active subscribers get pro tier
  if (subscriptionStatus === "active") return "pro";

  return "free";
}

// Check if user can perform action based on tier
export function canPerformAction(
  tier: SubscriptionTier,
  action: keyof (typeof TIER_LIMITS)["free"],
  currentCount?: number
): boolean {
  const limits = TIER_LIMITS[tier];
  const limit = limits[action];

  // Boolean features
  if (typeof limit === "boolean") return limit;

  // Numeric limits (-1 = unlimited)
  if (limit === -1) return true;
  if (currentCount === undefined) return true;

  return currentCount < limit;
}
