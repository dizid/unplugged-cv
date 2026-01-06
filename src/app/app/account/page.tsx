import { authServer } from "@/lib/auth/server";
import { getDb, userProfiles, payments } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function AccountPage() {
  const { data: session } = await authServer.getSession();

  if (!session?.user) {
    return null;
  }

  const db = getDb();

  const [profile, paymentRecords] = await Promise.all([
    db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, session.user.id))
      .limit(1),
    db
      .select()
      .from(payments)
      .where(eq(payments.userId, session.user.id))
      .orderBy(desc(payments.createdAt))
      .limit(1),
  ]);

  const userProfile = profile[0];
  const hasPaid = userProfile?.hasPaid || false;
  const applicationCount = userProfile?.applicationCount || 0;
  const lastPayment = paymentRecords[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">
        Account
      </h1>

      {/* User Info */}
      <section className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          Email
        </h2>
        <p className="text-lg text-gray-900 dark:text-white">
          {session.user.email}
        </p>
      </section>

      {/* Subscription Status */}
      <section className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Subscription
        </h2>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {hasPaid ? "Pro" : "Free"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {hasPaid ? "Lifetime access" : "Limited features"}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              hasPaid
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {hasPaid ? "Active" : "Free Tier"}
          </span>
        </div>

        {!hasPaid && (
          <Link
            href="/new"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Upgrade to Pro - $19
          </Link>
        )}

        {hasPaid && lastPayment && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Purchased on{" "}
            {new Date(lastPayment.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </section>

      {/* Usage Stats */}
      <section className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Usage
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">
              Applications created
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {applicationCount}
              {!hasPaid && (
                <span className="text-gray-400 dark:text-gray-500"> / 3</span>
              )}
            </span>
          </div>

          {!hasPaid && applicationCount >= 3 && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              You&apos;ve reached the free limit. Upgrade to continue creating
              applications.
            </p>
          )}
        </div>
      </section>

      {/* Pro Features */}
      <section className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          {hasPaid ? "Your Pro Features" : "Pro Features"}
        </h2>

        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className={hasPaid ? "text-green-500" : "text-gray-400"}>
              {hasPaid ? "✓" : "○"}
            </span>
            Unlimited applications
          </li>
          <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className={hasPaid ? "text-green-500" : "text-gray-400"}>
              {hasPaid ? "✓" : "○"}
            </span>
            PDF export
          </li>
          <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className={hasPaid ? "text-green-500" : "text-gray-400"}>
              {hasPaid ? "✓" : "○"}
            </span>
            Cover letter generation
          </li>
          <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className={hasPaid ? "text-green-500" : "text-gray-400"}>
              {hasPaid ? "✓" : "○"}
            </span>
            Match score analysis
          </li>
          <li className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className={hasPaid ? "text-green-500" : "text-gray-400"}>
              {hasPaid ? "✓" : "○"}
            </span>
            Publish CV online
          </li>
        </ul>
      </section>
    </div>
  );
}
