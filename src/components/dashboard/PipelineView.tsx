"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CvGeneration } from "@/lib/db/schema";

const STATUSES = [
  { key: "draft", label: "Draft", color: "bg-gray-400" },
  { key: "saved", label: "Saved", color: "bg-blue-500" },
  { key: "applied", label: "Applied", color: "bg-yellow-500" },
  { key: "screening", label: "Screening", color: "bg-purple-500" },
  { key: "interview", label: "Interview", color: "bg-green-500" },
  { key: "offer", label: "Offer", color: "bg-emerald-500" },
  { key: "rejected", label: "Rejected", color: "bg-red-500" },
];

function getDaysInStatus(app: CvGeneration): number {
  const date = new Date(app.updatedAt || app.createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

interface PipelineCardProps {
  app: CvGeneration;
  onStatusChange: (id: string, status: string) => void;
}

function PipelineCard({ app, onStatusChange }: PipelineCardProps) {
  const days = getDaysInStatus(app);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 group">
      <Link href={`/app/${app.id}`} className="block">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
          {app.jobTitle || "Untitled"}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {app.companyName || "No company"}
        </p>
      </Link>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400">
          {days === 0 ? "Today" : `${days}d`}
        </span>
        {app.priority && app.priority > 0 && (
          <span
            className={`w-2 h-2 rounded-full ${
              app.priority === 2 ? "bg-red-500" : "bg-yellow-500"
            }`}
            title={app.priority === 2 ? "Urgent" : "High priority"}
          />
        )}
      </div>
    </div>
  );
}

interface PipelineColumnProps {
  status: { key: string; label: string; color: string };
  apps: CvGeneration[];
  onStatusChange: (id: string, status: string) => void;
  onDrop: (appId: string, newStatus: string) => void;
}

function PipelineColumn({ status, apps, onStatusChange, onDrop }: PipelineColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const appId = e.dataTransfer.getData("applicationId");
    if (appId) {
      onDrop(appId, status.key);
    }
  };

  return (
    <div
      className={`flex-shrink-0 w-56 ${
        isDragOver ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${status.color}`} />
        <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm">
          {status.label}
        </h3>
        <span className="text-xs text-gray-400 ml-auto">{apps.length}</span>
      </div>
      <div className="space-y-2 min-h-[200px] bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
        {apps.map((app) => (
          <div
            key={app.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("applicationId", app.id);
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <PipelineCard app={app} onStatusChange={onStatusChange} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface PipelineViewProps {
  applications: CvGeneration[];
}

export function PipelineView({ applications }: PipelineViewProps) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    setUpdating(appId);
    try {
      await fetch(`/api/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(null);
    }
  };

  // Filter out archived applications
  const visibleApps = applications.filter((app) => !app.archived);

  // Group applications by status
  const appsByStatus = STATUSES.reduce(
    (acc, status) => {
      acc[status.key] = visibleApps.filter((app) => app.status === status.key);
      return acc;
    },
    {} as Record<string, CvGeneration[]>
  );

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {STATUSES.map((status) => (
          <PipelineColumn
            key={status.key}
            status={status}
            apps={appsByStatus[status.key] || []}
            onStatusChange={handleStatusChange}
            onDrop={handleStatusChange}
          />
        ))}
      </div>
      {updating && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-lg">
            Updating...
          </div>
        </div>
      )}
    </div>
  );
}
