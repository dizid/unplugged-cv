"use client";

import Link from "next/link";
import type { CvGeneration } from "@/lib/db/schema";

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  saved: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  applied: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  screening: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  interview: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  offer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function ApplicationCard({
  application,
}: {
  application: CvGeneration;
}) {
  const timeAgo = formatTimeAgo(
    new Date(application.updatedAt || application.createdAt)
  );
  const status = application.status || "draft";

  return (
    <Link
      href={`/app/${application.id}`}
      className="block p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {application.jobTitle || application.title || "Untitled Application"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {application.companyName || "Company not specified"}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[status] || statusStyles.draft}`}
        >
          {status}
        </span>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Updated {timeAgo}
      </p>
    </Link>
  );
}
