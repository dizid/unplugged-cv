import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations, userProfiles } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { ApplicationCard, EmptyState } from "@/components/dashboard";

const FREE_LIMIT = 3;

export default async function DashboardPage() {
  const { data: session } = await authServer.getSession();

  if (!session?.user) {
    return null;
  }

  const db = getDb();

  const [apps, profileResult] = await Promise.all([
    db
      .select()
      .from(cvGenerations)
      .where(eq(cvGenerations.userId, session.user.id))
      .orderBy(desc(cvGenerations.createdAt)),
    db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, session.user.id))
      .limit(1),
  ]);

  const profile = profileResult[0];
  const hasPaid = profile?.hasPaid || false;
  const appCount = apps.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Applications
          </h1>
          {!hasPaid && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {appCount} of {FREE_LIMIT} free applications used
            </p>
          )}
        </div>
        <Link
          href="/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          New Application
        </Link>
      </div>

      {/* Application List */}
      {apps.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}

      {/* Upgrade Banner */}
      {!hasPaid && appCount >= FREE_LIMIT && (
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Upgrade to Pro
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            Get unlimited applications, PDF exports, cover letters, and more.
          </p>
          <Link
            href="/new"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Upgrade for $19
          </Link>
        </div>
      )}
    </div>
  );
}
