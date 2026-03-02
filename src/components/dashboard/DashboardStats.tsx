"use client";

import { useMemo, useState } from "react";
import type { CvGeneration, Reminder, Interview } from "@/lib/db/schema";

interface DashboardStatsProps {
  applications: CvGeneration[];
  reminders: Reminder[];
  interviews: Interview[];
}

export function DashboardStats({
  applications,
  reminders,
  interviews,
}: DashboardStatsProps) {
  // Calculate stats
  const activeApps = applications.filter(
    (app) => !app.archived && app.status !== "rejected"
  );

  const appliedCount = applications.filter(
    (app) => ["applied", "screening", "interview", "offer"].includes(app.status)
  ).length;

  const respondedCount = applications.filter(
    (app) => ["screening", "interview", "offer", "rejected"].includes(app.status)
  ).length;

  const responseRate = appliedCount > 0
    ? Math.round((respondedCount / appliedCount) * 100)
    : 0;

  // Get stable time references (useState initializer is allowed to be impure)
  const [timeRefs] = useState(() => ({
    now: new Date(),
    tomorrow: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }));

  const upcomingInterviews = useMemo(() => {
    return interviews.filter(
      (i) => new Date(i.scheduledAt) > timeRefs.now && i.outcome === "pending"
    );
  }, [interviews, timeRefs.now]);

  const dueReminders = useMemo(() => {
    return reminders.filter(
      (r) => !r.isCompleted && new Date(r.dueAt) <= timeRefs.tomorrow
    );
  }, [reminders, timeRefs.tomorrow]);

  const stats = [
    {
      label: "Active",
      value: activeApps.length,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Response Rate",
      value: `${responseRate}%`,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Interviews",
      value: upcomingInterviews.length,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Due Today",
      value: dueReminders.length,
      color: dueReminders.length > 0
        ? "text-orange-600 dark:text-orange-400"
        : "text-gray-600 dark:text-gray-400",
      bg: dueReminders.length > 0
        ? "bg-orange-50 dark:bg-orange-900/20"
        : "bg-gray-50 dark:bg-gray-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} rounded-lg p-4 border border-transparent`}
        >
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
