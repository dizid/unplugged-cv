import { authServer } from "@/lib/auth/server";
import { getDb, userProfiles, cvGenerations } from "@/lib/db";
import { eq, count } from "drizzle-orm";
import Link from "next/link";
import { CareerBackgroundEditor } from "@/components/CareerBackgroundEditor";
import { SignOutButton } from "@/components/SignOutButton";
import { TIER_LIMITS } from "@/lib/stripe";

const FREE_LIMIT = TIER_LIMITS.free.applications;

export default async function AccountPage() {
  let session;
  try {
    const result = await authServer.getSession();
    session = result.data;
  } catch {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">
            Unable to load account. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // Fetch user profile and application count
  let userProfile;
  let actualAppCount = 0;
  try {
    const db = getDb();
    const [profile, appCountResult] = await Promise.all([
      db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.id, session.user.id))
        .limit(1),
      db
        .select({ count: count() })
        .from(cvGenerations)
        .where(eq(cvGenerations.userId, session.user.id)),
    ]);
    userProfile = profile[0];
    actualAppCount = appCountResult[0]?.count || 0;
  } catch {
    userProfile = null;
  }

  const hasPaid = userProfile?.hasPaid || false;
  const applicationCount = actualAppCount;
  const careerBackground = userProfile?.careerBackground || "";
  const memberSince = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          {session.user.email?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {session.user.email}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Member since {memberSince}
          </p>
        </div>
      </div>

      {/* Subscription Card */}
      <section className="mb-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <div
          className={`p-6 ${
            hasPaid
              ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
              : "bg-white dark:bg-gray-900"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {hasPaid ? "Pro Plan" : "Free Plan"}
                </h2>
                {hasPaid && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-500 text-white">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {hasPaid ? "Lifetime access to all features" : "Basic features with limits"}
              </p>
            </div>
            {hasPaid && (
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">One-time</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">$19</p>
              </div>
            )}
          </div>

          {/* Usage Progress for Free Users */}
          {!hasPaid && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Applications used</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {applicationCount} / {FREE_LIMIT}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    applicationCount >= FREE_LIMIT
                      ? "bg-red-500"
                      : applicationCount >= 2
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${Math.min((applicationCount / FREE_LIMIT) * 100, 100)}%` }}
                />
              </div>
              {applicationCount >= FREE_LIMIT && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  You&apos;ve reached the free limit
                </p>
              )}
            </div>
          )}
        </div>

        {/* Upgrade CTA for Free Users */}
        {!hasPaid && (
          <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <p className="font-medium">Upgrade to Pro</p>
                <p className="text-sm opacity-90">Unlimited apps, PDF export & more</p>
              </div>
              <Link
                href="/new"
                className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm"
              >
                Get Pro - $19
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{applicationCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {applicationCount === 1 ? "Application" : "Applications"} created
          </p>
        </div>
        <Link
          href="/app"
          className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
        >
          <p className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            View All
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your applications</p>
        </Link>
      </div>

      {/* Features List */}
      <section className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          {hasPaid ? "Your Features" : "Available with Pro"}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "Unlimited applications", free: false },
            { name: "PDF export", free: false },
            { name: "Cover letters", free: false },
            { name: "Match analysis", free: false },
            { name: "Publish CV online", free: false },
            { name: "Priority support", free: false },
          ].map((feature) => (
            <div
              key={feature.name}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              {hasPaid ? (
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              {feature.name}
            </div>
          ))}
        </div>
      </section>

      {/* Career Background */}
      <CareerBackgroundEditor initialBackground={careerBackground} />

      {/* Account Actions */}
      <section className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Account
        </h2>
        <SignOutButton />
      </section>
    </div>
  );
}
