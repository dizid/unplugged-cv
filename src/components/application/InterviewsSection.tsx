"use client";

import { useState, useEffect } from "react";
import type { Interview } from "@/lib/db/schema";
import { InterviewCard } from "./InterviewCard";
import { InterviewModal } from "./InterviewModal";

interface InterviewsSectionProps {
  applicationId: string;
}

export function InterviewsSection({ applicationId }: InterviewsSectionProps) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

  useEffect(() => {
    fetchInterviews();
  }, [applicationId]);

  const fetchInterviews = async () => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/interviews`);
      if (res.ok) {
        const data = await res.json();
        setInterviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (interview: Interview) => {
    setEditingInterview(interview);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this interview?")) return;

    try {
      const res = await fetch(
        `/api/applications/${applicationId}/interviews?interviewId=${id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setInterviews((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete interview:", error);
    }
  };

  const handleSave = (interview: Interview) => {
    if (editingInterview) {
      setInterviews((prev) =>
        prev.map((i) => (i.id === interview.id ? interview : i))
      );
    } else {
      setInterviews((prev) => [interview, ...prev]);
    }
    setShowModal(false);
    setEditingInterview(null);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingInterview(null);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 dark:text-white">Interviews</h3>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>

      {interviews.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No interviews scheduled
        </p>
      ) : (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <InterviewModal
          applicationId={applicationId}
          interview={editingInterview}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
