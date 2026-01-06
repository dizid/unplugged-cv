"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { StatusSelector } from "./StatusSelector";
import { printCV, printCoverLetter } from "@/lib/pdf";
import type { CvGeneration } from "@/lib/db/schema";

interface ApplicationDetailProps {
  application: CvGeneration;
  hasPaid: boolean;
}

export function ApplicationDetail({
  application,
  hasPaid,
}: ApplicationDetailProps) {
  const [activeTab, setActiveTab] = useState<"cv" | "cover-letter" | "job">("cv");
  const [copied, setCopied] = useState(false);
  const [publishSlug, setPublishSlug] = useState(application.slug || "");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

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
          currentStatus={application.status || "draft"}
          applicationId={application.id}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
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
        {application.coverLetter && (
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
        )}
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
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-[1fr,300px] gap-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 min-h-[500px] max-h-[70vh] overflow-y-auto">
          {activeTab === "cv" && application.generatedCv && (
            <div className="cv-prose">
              <ReactMarkdown>{application.generatedCv}</ReactMarkdown>
            </div>
          )}
          {activeTab === "cover-letter" && application.coverLetter && (
            <div className="letter-prose">
              <ReactMarkdown>{application.coverLetter}</ReactMarkdown>
            </div>
          )}
          {activeTab === "job" && application.jobDescription && (
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm">
                {application.jobDescription}
              </pre>
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
                        ? application.coverLetter || ""
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
                application.coverLetter && (
                  <button
                    onClick={() => printCoverLetter(application.coverLetter!)}
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

          {/* Notes */}
          <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
              Notes
            </h3>
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
        </div>
      </div>
    </div>
  );
}
