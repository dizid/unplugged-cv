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
            {activeTab === "cv" && application.generatedCv && (
              <div className="cv-prose">
                <ReactMarkdown>{application.generatedCv}</ReactMarkdown>
              </div>
            )}
            {activeTab === "cover-letter" && currentCoverLetter && (
              <div className="letter-prose">
                <ReactMarkdown>{currentCoverLetter}</ReactMarkdown>
              </div>
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
                      ? application.generatedCv || ""
                      : activeTab === "cover-letter"
                        ? currentCoverLetter || ""
                        : application.jobDescription || ""
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </button>
              {hasPaid && activeTab === "cv" && application.generatedCv && (
                <button
                  onClick={() => printCV(application.generatedCv!)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Download PDF
                </button>
              )}
              {hasPaid &&
                activeTab === "cover-letter" &&
                currentCoverLetter && (
                  <button
                    onClick={() => printCoverLetter(currentCoverLetter)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Download PDF
                  </button>
                )}
            </div>
          </div>

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
