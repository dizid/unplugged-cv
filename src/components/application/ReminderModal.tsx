"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Reminder } from "@/lib/db/schema";

interface ReminderModalProps {
  applicationId?: string;
  reminder?: Reminder | null;
  onClose: () => void;
  onSave: (reminder: Reminder) => void;
}

const reminderTypes = [
  { value: "follow_up", label: "Follow up" },
  { value: "interview_prep", label: "Interview prep" },
  { value: "deadline", label: "Deadline" },
  { value: "custom", label: "Custom" },
];

export function ReminderModal({
  applicationId,
  reminder,
  onClose,
  onSave,
}: ReminderModalProps) {
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    dueAt: "",
    reminderType: "follow_up",
  });

  useEffect(() => {
    setMounted(true);
    if (reminder) {
      const date = new Date(reminder.dueAt);
      setFormData({
        title: reminder.title,
        dueAt: date.toISOString().slice(0, 16),
        reminderType: reminder.reminderType,
      });
    } else {
      // Default to tomorrow at 9am
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      setFormData((prev) => ({
        ...prev,
        dueAt: tomorrow.toISOString().slice(0, 16),
      }));
    }
  }, [reminder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = reminder ? "PATCH" : "POST";
      const url = reminder ? `/api/reminders/${reminder.id}` : "/api/reminders";
      const body = reminder
        ? formData
        : { ...formData, applicationId };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const saved = await res.json();
        onSave(saved);
      }
    } catch (error) {
      console.error("Failed to save reminder:", error);
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
        className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {reminder ? "Edit Reminder" : "Add Reminder"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Follow up on application"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.dueAt}
                onChange={(e) =>
                  setFormData({ ...formData, dueAt: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={formData.reminderType}
                onChange={(e) =>
                  setFormData({ ...formData, reminderType: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {reminderTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
              {saving ? "Saving..." : reminder ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
