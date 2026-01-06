"use client";

import { useCallback, useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { generatePDF } from "@/lib/pdf";
import { isMobile, shareCV } from "@/lib/share";

interface PublicCVViewProps {
  cv: string;
}

export function PublicCVView({ cv }: PublicCVViewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  // Detect mobile on mount to avoid hydration mismatch
  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      await generatePDF("public-cv-content", "cv.pdf");
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    setIsSharing(true);
    setShareMessage(null);
    try {
      const result = await shareCV(window.location.href, "My CV");
      if (result.success && result.method === "clipboard") {
        setShareMessage("Link copied!");
        setTimeout(() => setShareMessage(null), 2000);
      }
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setIsSharing(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              unplugged<span className="text-blue-600">.cv</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {shareMessage && (
              <span className="text-sm text-green-600 dark:text-green-400">
                {shareMessage}
              </span>
            )}
            {isMobileDevice ? (
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium transition-colors flex items-center gap-2"
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
                    Share
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Generating...
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CV Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div
          id="public-cv-content"
          className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 md:p-12"
        >
          <div className="cv-prose">
            <ReactMarkdown>{cv}</ReactMarkdown>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-8">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Made with{" "}
            <span className="font-semibold">
              unplugged<span className="text-blue-600">.cv</span>
            </span>{" "}
            — Create your own AI-powered CV
          </Link>
        </div>
      </footer>
    </div>
  );
}
