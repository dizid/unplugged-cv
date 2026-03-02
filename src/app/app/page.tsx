import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations, userProfiles, reminders, interviews } from "@/lib/db";
import { eq, desc, inArray } from "drizzle-orm";
import Link from "next/link";
import {
  ApplicationCard,
  EmptyState,
  DashboardStats,
  PipelineView,
} from "@/components/dashboard";
import { ViewToggle } from "./ViewToggle";

const FREE_LIMIT = 5;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { data: session } = await authServer.getSession();

  if (!session?.user) {
    return null;
  }

  const params = await searchParams;
  const view = params.view || "list";
  const db = getDb();

  // Get all application IDs for the user first
  const apps = await db
    .select()
    .from(cvGenerations)
    .where(eq(cvGenerations.userId, session.user.id))
    .orderBy(desc(cvGenerations.createdAt));

  const appIds = apps.map((a) => a.id);

  // Fetch profile, reminders, and interviews in parallel
  const [profileResult, userReminders, userInterviews] = await Promise.all([
    db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, session.user.id))
      .limit(1),
    db.select().from(reminders).where(eq(reminders.userId, session.user.id)),
    appIds.length > 0
      ? db.select().from(interviews).where(inArray(interviews.applicationId, appIds))
      : Promise.resolve([]),
  ]);

  const profile = profileResult[0];
  const hasPaid = profile?.hasPaid || false;
  const isSubscribed = profile?.subscriptionStatus === "active";
  const appCount = apps.length;

  // Filter non-archived apps for display
  const visibleApps = apps.filter((app) => !app.archived);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Applications
          </h1>
          {!hasPaid && !isSubscribed && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {appCount} of {FREE_LIMIT} free applications used
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle currentView={view} />
          <Link
            href="/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            New Application
          </Link>
        </div>
      </div>

      {/* Stats */}
      {visibleApps.length > 0 && (
        <DashboardStats
          applications={apps}
          reminders={userReminders}
          interviews={userInterviews}
        />
      )}

      {/* Application List/Pipeline */}
      {visibleApps.length === 0 ? (
        <EmptyState />
      ) : view === "pipeline" ? (
        <PipelineView applications={visibleApps} />
      ) : (
        <div className="space-y-3">
          {visibleApps.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}

      {/* Upgrade Banner */}
      {!hasPaid && !isSubscribed && appCount >= FREE_LIMIT && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Upgrade to Pro
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            Get unlimited applications, pipeline view, interview tracking,
            reminders, and more.
          </p>
          <Link
            href="/new"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      )}
    </div>
  );
}
