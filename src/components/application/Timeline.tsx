"use client";

import { useEffect, useState } from "react";
import type { ApplicationEvent, Interview } from "@/lib/db/schema";

interface TimelineProps {
  applicationId: string;
}

interface TimelineItem {
  id: string;
  type: "event" | "interview";
  date: Date;
  data: ApplicationEvent | Interview;
}

const eventLabels: Record<string, string> = {
  status_change: "Status changed",
  note_added: "Note added",
  interview_scheduled: "Interview scheduled",
  interview_updated: "Interview updated",
  reminder_created: "Reminder created",
  application_created: "Application created",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  saved: "Saved",
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

function EventIcon({ eventType }: { eventType: string }) {
  switch (eventType) {
    case "status_change":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      );
    case "interview_scheduled":
    case "interview_updated":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case "note_added":
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

export function Timeline({ applicationId }: TimelineProps) {
  const [events, setEvents] = useState<ApplicationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/applications/${applicationId}/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [applicationId]);

  if (error) {
    return (
      <p className="text-sm text-red-500 text-center py-4">
        Failed to load activity
      </p>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
        No activity yet
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-3">
          {/* Timeline line and dot */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <EventIcon eventType={event.eventType} />
            </div>
            {index < events.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 my-1" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white text-sm">
                {eventLabels[event.eventType] || event.eventType}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(new Date(event.createdAt))}
              </span>
            </div>
            {event.eventType === "status_change" && event.fromStatus && event.toStatus && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                {statusLabels[event.fromStatus] || event.fromStatus} →{" "}
                {statusLabels[event.toStatus] || event.toStatus}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
