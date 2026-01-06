"use client";

import { useState, useCallback, useEffect } from "react";
import { generatePDF } from "@/lib/pdf";
import { isMobile, shareCV } from "@/lib/share";

interface ActionPanelProps {
  hasPaid: boolean;
  isLoggedIn: boolean;
  cvId?: string;
  onCopy: () => void;
  copied: boolean;
  onCheckout: () => void;
  activeView?: "cv" | "job-description" | "cover-letter";
}

export function ActionPanel({
  hasPaid,
  isLoggedIn,
  cvId,
  onCopy,
  copied,
  onCheckout,
  activeView = "cv",
}: ActionPanelProps) {
  const [slug, setSlug] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishError, setPublishError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  // Detect mobile on mount to avoid hydration mismatch
  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  const handleDownloadPDF = useCallback(async () => {
    if (!hasPaid) {
      onCheckout();
      return;
    }

    setIsDownloading(true);
    try {
      const filename = activeView === "cv" ? "my-cv.pdf" : "cover-letter.pdf";
      const docType = activeView === "cv" ? "cv" : "letter";
      await generatePDF("cv-preview", filename, docType);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsDownloading(false);
    }
  }, [hasPaid, activeView, onCheckout]);

  const handlePublish = useCallback(async () => {
    if (!hasPaid) {
      onCheckout();
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
      // Check for test mode
      const urlParams = new URLSearchParams(window.location.search);
      const testMode = urlParams.get("test") === "test123" ? "test123" : undefined;

      const response = await fetch("/api/publish-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId, slug, testMode }),
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
  }, [hasPaid, slug, cvId, onCheckout]);

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

  const handleShare = useCallback(async () => {
    if (!publishedUrl) return;
    setIsSharing(true);
    setShareMessage(null);
    try {
      const title = activeView === "cv" ? "My CV" : "My Cover Letter";
      const result = await shareCV(publishedUrl, title);
      if (result.success && result.method === "clipboard") {
        setShareMessage("Link copied!");
        setTimeout(() => setShareMessage(null), 2000);
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setIsSharing(false);
    }
  }, [publishedUrl, activeView]);

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
      {/* Download/Share Section */}
      <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          {isMobileDevice ? (
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          ) : (
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
          )}
          {isMobileDevice ? "Share" : "Download"}
        </h3>

        <div className="space-y-3">
          {shareMessage && (
            <p className="text-sm text-green-600 dark:text-green-400 text-center">
              {shareMessage}
            </p>
          )}

          {isMobileDevice ? (
            // Mobile: Share or Publish to Share
            publishedUrl ? (
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSharing ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Sharing...
                  </>
                ) : (
                  <>
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    Share {activeView === "cv" ? "CV" : "Cover Letter"}
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  // Scroll to publish section
                  document.getElementById("publish-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                {!hasPaid && <LockIcon />}
                Publish to Share
              </button>
            )
          ) : (
            // Desktop: Download PDF
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
                  {activeView === "cv" ? "Download CV" : "Download Cover Letter"}
                </>
              )}
            </button>
          )}

          {/* Copy Markdown */}
          <button
            onClick={onCopy}
            className="w-full py-2.5 px-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
          >
            {copied ? "✓ Copied!" : "Copy Markdown"}
          </button>
        </div>
      </div>

      {/* Publish Section */}
      <div id="publish-section" className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
              onClick={onCheckout}
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
