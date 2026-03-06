"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { StatusSelector } from "./StatusSelector";
import { Timeline } from "./Timeline";
import { InterviewsSection } from "./InterviewsSection";
import { ReminderModal } from "./ReminderModal";
import { GuidesTab } from "./GuidesTab";
import { CoverLetterActions } from "./CoverLetterActions";
import { printCV, printCoverLetter } from "@/lib/pdf";
import type { CvGeneration, Reminder } from "@/lib/db/schema";

interface ApplicationDetailProps {
  application: CvGeneration;
  hasPaid: boolean;
}

export function ApplicationDetail({
  application,
  hasPaid,
}: ApplicationDetailProps) {
  const [activeTab, setActiveTab] = useState<
    "cv" | "cover-letter" | "job" | "guides"
  >("cv");
  const [copied, setCopied] = useState(false);
  const [publishSlug, setPublishSlug] = useState(application.slug || "");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [showReminderModal, setShowReminderModal] = useState(false);
  // Lifted status state so guides tab reacts to status changes
  const [currentStatus, setCurrentStatus] = useState(
    application.status || "draft"
  );
  // Cover letter state — allows live updates from CoverLetterActions
  const [currentCoverLetter, setCurrentCoverLetter] = useState(
    application.coverLetter || ""
  );
  // CV state — allows live updates from inline editing
  const [currentCv, setCurrentCv] = useState(application.generatedCv || "");
  // Inline editing state
  const [isEditingCv, setIsEditingCv] = useState(false);
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);
  const [editedCv, setEditedCv] = useState(currentCv);
  const [editedCoverLetter, setEditedCoverLetter] = useState(currentCoverLetter);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  // Match score state
  const [matchScore, setMatchScore] = useState<number | null>(application.matchScore ?? null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const handlePublish = async () => {
    if (!publishSlug.trim()) return;

    setIsPublishing(true);
    setPublishError("");

    try {
      const res = await fetch("/api/publish-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvId: application.id,
          slug: publishSlug.toLowerCase().trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.error || "Failed to publish");
        return;
      }

      window.location.reload();
    } catch {
      setPublishError("Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveEdit = async (field: "cv" | "coverLetter") => {
    setIsSavingEdit(true);
    try {
      const payload =
        field === "cv"
          ? { generatedCv: editedCv }
          : { coverLetter: editedCoverLetter };
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        if (field === "cv") {
          setCurrentCv(editedCv);
          setIsEditingCv(false);
        } else {
          setCurrentCoverLetter(editedCoverLetter);
          setIsEditingCoverLetter(false);
        }
      }
    } catch {
      console.error("Failed to save edit");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleCancelEdit = (field: "cv" | "coverLetter") => {
    if (field === "cv") {
      setEditedCv(currentCv);
      setIsEditingCv(false);
    } else {
      setEditedCoverLetter(currentCoverLetter);
      setIsEditingCoverLetter(false);
    }
  };

  const handleAnalyzeMatch = async () => {
    if (!currentCv || !application.parsedJob) return;
    setIsAnalyzing(true);
    try {
      let parsedJob = application.parsedJob;
      if (typeof parsedJob === "string") {
        parsedJob = JSON.parse(parsedJob);
      }
      const res = await fetch("/api/match-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cv: currentCv,
          parsedJob,
          applicationId: application.id,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        setMatchScore(result.score);
      }
    } catch {
      console.error("Failed to analyze match");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/app"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-2 inline-block"
          >
            &larr; Back to Applications
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {application.jobTitle || application.title || "Untitled Application"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {application.companyName || "Company not specified"}
          </p>
        </div>
        <StatusSelector
          currentStatus={currentStatus}
          applicationId={application.id}
          onStatusChange={setCurrentStatus}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab("cv")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "cv"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          CV
        </button>
        <button
          onClick={() => setActiveTab("cover-letter")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "cover-letter"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Cover Letter
        </button>
        {application.jobDescription && (
          <button
            onClick={() => setActiveTab("job")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "job"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Job Description
          </button>
        )}
        <button
          onClick={() => setActiveTab("guides")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "guides"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Guides
        </button>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-[1fr,300px] gap-6">
        <div>
          {/* Main content panel */}
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 min-h-[500px] max-h-[70vh] overflow-y-auto">
            {activeTab === "cv" && currentCv && (
              isEditingCv ? (
                <textarea
                  value={editedCv}
                  onChange={(e) => setEditedCv(e.target.value)}
                  className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-0 resize-none focus:outline-none"
                />
              ) : (
                <div className="cv-prose">
                  <ReactMarkdown>{currentCv}</ReactMarkdown>
                </div>
              )
            )}
            {activeTab === "cover-letter" && currentCoverLetter && (
              isEditingCoverLetter ? (
                <textarea
                  value={editedCoverLetter}
                  onChange={(e) => setEditedCoverLetter(e.target.value)}
                  className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-0 resize-none focus:outline-none"
                />
              ) : (
                <div className="letter-prose">
                  <ReactMarkdown>{currentCoverLetter}</ReactMarkdown>
                </div>
              )
            )}
            {activeTab === "cover-letter" && !currentCoverLetter && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center max-w-md">
                  <svg
                    className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    No cover letter yet. Generate one tailored to this role.
                  </p>
                </div>
              </div>
            )}
            {activeTab === "job" && application.jobDescription && (
              <div className="prose dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm">
                  {application.jobDescription}
                </pre>
              </div>
            )}
            {activeTab === "guides" && (
              <GuidesTab currentStatus={currentStatus} />
            )}
          </div>

          {/* Cover letter actions — shown below main content when on cover letter tab */}
          {activeTab === "cover-letter" && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <CoverLetterActions
                applicationId={application.id}
                coverLetter={currentCoverLetter || null}
                generatedCv={application.generatedCv}
                parsedJob={application.parsedJob}
                hasPaid={hasPaid}
                onCoverLetterUpdate={setCurrentCoverLetter}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() =>
                  copyToClipboard(
                    activeTab === "cv"
                      ? currentCv || ""
                      : activeTab === "cover-letter"
                        ? currentCoverLetter || ""
                        : application.jobDescription || ""
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
              {/* Edit / Save / Cancel buttons for CV and Cover Letter tabs */}
              {activeTab === "cv" && currentCv && (
                isEditingCv ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit("cv")}
                      disabled={isSavingEdit}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {isSavingEdit ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => handleCancelEdit("cv")}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditedCv(currentCv); setIsEditingCv(true); }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
                  >
                    Edit CV
                  </button>
                )
              )}
              {activeTab === "cover-letter" && currentCoverLetter && (
                isEditingCoverLetter ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit("coverLetter")}
                      disabled={isSavingEdit}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {isSavingEdit ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => handleCancelEdit("coverLetter")}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditedCoverLetter(currentCoverLetter); setIsEditingCoverLetter(true); }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
                  >
                    Edit Cover Letter
                  </button>
                )
              )}
              {hasPaid && activeTab === "cv" && currentCv && !isEditingCv && (
                <button
                  onClick={() => printCV(currentCv)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Download PDF
                </button>
              )}
              {hasPaid &&
                activeTab === "cover-letter" &&
                currentCoverLetter &&
                !isEditingCoverLetter && (
                  <button
                    onClick={() => printCoverLetter(currentCoverLetter)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Download PDF
                  </button>
                )}
              {/* Apply to Similar Role */}
              <Link
                href="/new"
                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300 text-center"
              >
                Apply to Similar Role
              </Link>
            </div>
          </div>

          {/* Match Score */}
          {hasPaid && application.parsedJob && (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                Match Score
              </h3>
              {matchScore !== null ? (
                <div className="flex items-center gap-3">
                  <div
                    className={`text-2xl font-bold ${
                      matchScore >= 75
                        ? "text-green-600 dark:text-green-400"
                        : matchScore >= 50
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {matchScore}%
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {matchScore >= 75
                      ? "Strong match"
                      : matchScore >= 50
                        ? "Moderate match"
                        : "Weak match"}
                  </span>
                </div>
              ) : null}
              <button
                onClick={handleAnalyzeMatch}
                disabled={isAnalyzing}
                className="w-full mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50"
              >
                {isAnalyzing
                  ? "Analyzing..."
                  : matchScore !== null
                    ? "Re-analyze"
                    : "Analyze Match"}
              </button>
            </div>
          )}

          {/* Publish */}
          {hasPaid && (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                Publish Online
              </h3>
              {application.isPublished && application.slug ? (
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                    Published at:
                  </p>
                  <a
                    href={`/cv/${application.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    unplugged.cv/cv/{application.slug}
                  </a>
                  {typeof application.viewCount === "number" && application.viewCount > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {application.viewCount} {application.viewCount === 1 ? "view" : "views"}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      unplugged.cv/cv/
                    </span>
                    <input
                      type="text"
                      value={publishSlug}
                      onChange={(e) => setPublishSlug(e.target.value)}
                      placeholder="your-name"
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  {publishError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {publishError}
                    </p>
                  )}
                  <button
                    onClick={handlePublish}
                    disabled={!publishSlug.trim() || isPublishing}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                  >
                    {isPublishing ? "Publishing..." : "Publish"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Interviews */}
          <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <InterviewsSection applicationId={application.id} />
          </div>

          {/* Notes & Reminder */}
          <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notes
              </h3>
              <button
                onClick={() => setShowReminderModal(true)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Remind
              </button>
            </div>
            <textarea
              defaultValue={application.notes || ""}
              placeholder="Add notes about this application..."
              className="w-full h-24 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
              onBlur={async (e) => {
                try {
                  await fetch(`/api/applications/${application.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notes: e.target.value }),
                  });
                } catch {
                  console.error("Failed to save notes");
                }
              }}
            />
          </div>

          {/* Timeline */}
          <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Activity
            </h3>
            <Timeline applicationId={application.id} />
          </div>
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <ReminderModal
          applicationId={application.id}
          onClose={() => setShowReminderModal(false)}
          onSave={() => setShowReminderModal(false)}
        />
      )}
    </div>
  );
}
