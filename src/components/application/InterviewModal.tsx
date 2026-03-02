"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Interview } from "@/lib/db/schema";

interface InterviewModalProps {
  applicationId: string;
  interview?: Interview | null;
  onClose: () => void;
  onSave: (interview: Interview) => void;
}

const interviewTypes = [
  { value: "phone", label: "Phone Screen" },
  { value: "video", label: "Video Call" },
  { value: "onsite", label: "On-site" },
  { value: "technical", label: "Technical" },
  { value: "behavioral", label: "Behavioral" },
];

const outcomes = [
  { value: "pending", label: "Pending" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
  { value: "rescheduled", label: "Rescheduled" },
];

export function InterviewModal({
  applicationId,
  interview,
  onClose,
  onSave,
}: InterviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    scheduledAt: "",
    interviewType: "video",
    interviewerName: "",
    interviewerRole: "",
    location: "",
    notes: "",
    prepNotes: "",
    outcome: "pending",
  });

  useEffect(() => {
    setMounted(true);
    if (interview) {
      const date = new Date(interview.scheduledAt);
      setFormData({
        scheduledAt: date.toISOString().slice(0, 16),
        interviewType: interview.interviewType,
        interviewerName: interview.interviewerName || "",
        interviewerRole: interview.interviewerRole || "",
        location: interview.location || "",
        notes: interview.notes || "",
        prepNotes: interview.prepNotes || "",
        outcome: interview.outcome || "pending",
      });
    }
  }, [interview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = interview ? "PATCH" : "POST";
      const body = interview
        ? { ...formData, interviewId: interview.id }
        : formData;

      const res = await fetch(`/api/applications/${applicationId}/interviews`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const saved = await res.json();
        onSave(saved);
      }
    } catch (error) {
      console.error("Failed to save interview:", error);
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {interview ? "Edit Interview" : "Schedule Interview"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.scheduledAt}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledAt: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type *
              </label>
              <select
                value={formData.interviewType}
                onChange={(e) =>
                  setFormData({ ...formData, interviewType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {interviewTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Interviewer Name
              </label>
              <input
                type="text"
                value={formData.interviewerName}
                onChange={(e) =>
                  setFormData({ ...formData, interviewerName: e.target.value })
                }
                placeholder="e.g., John Smith"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <input
                type="text"
                value={formData.interviewerRole}
                onChange={(e) =>
                  setFormData({ ...formData, interviewerRole: e.target.value })
                }
                placeholder="e.g., Engineering Manager"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location / Meeting Link
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., https://zoom.us/... or 123 Main St"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Any notes about this interview..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prep Notes
            </label>
            <textarea
              value={formData.prepNotes}
              onChange={(e) =>
                setFormData({ ...formData, prepNotes: e.target.value })
              }
              placeholder="Things to prepare, questions to ask..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            />
          </div>

          {interview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Outcome
              </label>
              <select
                value={formData.outcome}
                onChange={(e) =>
                  setFormData({ ...formData, outcome: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {outcomes.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : interview ? "Update" : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
