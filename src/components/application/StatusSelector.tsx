"use client";

import { useState } from "react";

const statuses = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
  { value: "saved", label: "Saved", color: "bg-blue-100 text-blue-700" },
  { value: "applied", label: "Applied", color: "bg-yellow-100 text-yellow-700" },
  { value: "screening", label: "Screening", color: "bg-purple-100 text-purple-700" },
  { value: "interview", label: "Interview", color: "bg-green-100 text-green-700" },
  { value: "offer", label: "Offer", color: "bg-emerald-100 text-emerald-700" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
];

interface StatusSelectorProps {
  currentStatus: string;
  applicationId: string;
  onStatusChange?: (newStatus: string) => void;
}

export function StatusSelector({
  currentStatus,
  applicationId,
  onStatusChange,
}: StatusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentStatusObj = statuses.find((s) => s.value === status) || statuses[0];

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    setIsOpen(false);

    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        onStatusChange?.(newStatus);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${currentStatusObj.color} hover:opacity-80 transition-opacity disabled:opacity-50`}
      >
        {isUpdating ? "Updating..." : currentStatusObj.label}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => handleStatusChange(s.value)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${
                  s.value === status
                    ? "bg-gray-50 dark:bg-gray-700 font-medium"
                    : ""
                }`}
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${s.color.split(" ")[0]}`}
                />
                {s.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
