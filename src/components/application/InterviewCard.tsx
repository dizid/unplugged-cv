"use client";

import type { Interview } from "@/lib/db/schema";

const interviewTypeLabels: Record<string, string> = {
  phone: "Phone Screen",
  video: "Video Call",
  onsite: "On-site",
  technical: "Technical",
  behavioral: "Behavioral",
};

const outcomeStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  passed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  rescheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
};

interface InterviewCardProps {
  interview: Interview;
  onEdit: (interview: Interview) => void;
  onDelete: (id: string) => void;
}

export function InterviewCard({ interview, onEdit, onDelete }: InterviewCardProps) {
  const scheduledDate = new Date(interview.scheduledAt);
  const isPast = scheduledDate < new Date();
  const isToday = scheduledDate.toDateString() === new Date().toDateString();

  return (
    <div
      className={`p-4 rounded-lg border ${
        isToday
          ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {interviewTypeLabels[interview.interviewType] || interview.interviewType}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                outcomeStyles[interview.outcome || "pending"]
              }`}
            >
              {interview.outcome || "pending"}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {scheduledDate.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            at{" "}
            {scheduledDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {isToday && (
              <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                Today
              </span>
            )}
          </p>
          {interview.interviewerName && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              With: {interview.interviewerName}
              {interview.interviewerRole && ` (${interview.interviewerRole})`}
            </p>
          )}
          {interview.location && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate max-w-xs">
              {interview.location.startsWith("http") ? (
                <a
                  href={interview.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Join meeting
                </a>
              ) : (
                interview.location
              )}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(interview)}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(interview.id)}
            className="p-1.5 text-gray-400 hover:text-red-500"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {interview.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 border-t border-gray-100 dark:border-gray-700 pt-2">
          {interview.notes}
        </p>
      )}
    </div>
  );
}
