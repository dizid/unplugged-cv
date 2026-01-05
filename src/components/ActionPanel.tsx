"use client";

import { useState, useCallback } from "react";
import { generatePDF } from "@/lib/pdf";
import { MatchScore } from "@/components/MatchScore";
import type { ParsedJob } from "@/app/api/parse-job/route";

interface ActionPanelProps {
  hasPaid: boolean;
  isLoggedIn: boolean;
  cvId?: string;
  onCopy: () => void;
  copied: boolean;
  cv?: string;
  parsedJob?: ParsedJob | null;
}

export function ActionPanel({
  hasPaid,
  isLoggedIn,
  cvId,
  onCopy,
  copied,
  cv,
  parsedJob,
}: ActionPanelProps) {
  const [slug, setSlug] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishError, setPublishError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const handleDownloadPDF = useCallback(async () => {
    if (!hasPaid) {
      // Redirect to checkout
      handleCheckout();
      return;
    }

    setIsDownloading(true);
    try {
      await generatePDF("cv-preview", "my-cv.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsDownloading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPaid]);

  const handleCheckout = useCallback(async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  }, [cvId]);

  const handlePublish = useCallback(async () => {
    if (!hasPaid) {
      handleCheckout();
      return;
    }

    if (!slug.trim()) {
      setPublishError("Please enter a URL slug");
      return;
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]{3,50}$/;
    if (!slugRegex.test(slug)) {
      setPublishError(
        "Slug must be 3-50 characters, lowercase letters, numbers, and hyphens only"
      );
      return;
    }

    setIsPublishing(true);
    setPublishError("");

    try {
      const response = await fetch("/api/publish-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId, slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to publish CV");
      }

      setPublishedUrl(data.url);
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  }, [hasPaid, slug, cvId, handleCheckout]);

  const copyPublishedUrl = useCallback(async () => {
    if (!publishedUrl) return;
    try {
      await navigator.clipboard.writeText(publishedUrl);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    } catch {
      console.error("Failed to copy URL");
    }
  }, [publishedUrl]);

  const LockIcon = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Download Section */}
      <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download
        </h3>

        <div className="space-y-3">
          {/* PDF Download */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <>
                <span className="animate-spin">⏳</span>
                Generating PDF...
              </>
            ) : (
              <>
                {!hasPaid && <LockIcon />}
                Download PDF
              </>
            )}
          </button>

          {/* Copy Markdown */}
          <button
            onClick={onCopy}
            className="w-full py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
          >
            {copied ? "✓ Copied!" : "Copy Markdown"}
          </button>
        </div>
      </div>

      {/* Match Score Section */}
      {cv && (
        <MatchScore
          cv={cv}
          parsedJob={parsedJob ?? null}
          hasPaid={hasPaid}
          onCheckout={handleCheckout}
        />
      )}

      {/* Publish Section */}
      <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          Publish Online
        </h3>

        {publishedUrl ? (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-2">
                Your CV is live!
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={publishedUrl}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
                />
                <button
                  onClick={copyPublishedUrl}
                  className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                >
                  {urlCopied ? "✓" : "Copy"}
                </button>
              </div>
            </div>
            <a
              href={publishedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Open in new tab →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                Choose your URL
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                  unplugged.cv/cv/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  placeholder="your-name"
                  className="flex-1 px-3 py-2.5 rounded-r-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {publishError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {publishError}
              </p>
            )}

            <button
              onClick={handlePublish}
              disabled={isPublishing || !isLoggedIn}
              className="w-full py-2.5 px-4 rounded-lg bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white dark:text-gray-900 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Publishing...
                </>
              ) : (
                <>
                  {!hasPaid && <LockIcon />}
                  {!isLoggedIn ? "Sign in to Publish" : "Publish CV"}
                </>
              )}
            </button>

            {!isLoggedIn && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Sign in to save and publish your CV
              </p>
            )}
          </div>
        )}
      </div>

      {/* Premium CTA - show if not paid */}
      {!hasPaid && (
        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Unlock Premium
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Download PDF & publish your CV online
            </p>
            <button
              onClick={handleCheckout}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all shadow-sm hover:shadow-md"
            >
              Get Premium — $10
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              One-time payment, no subscription
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
