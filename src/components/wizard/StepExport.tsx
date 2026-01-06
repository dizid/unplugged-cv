"use client";

import { useState } from "react";
import { printCV, printCoverLetter } from "@/lib/pdf";

interface StepExportProps {
  applicationId: string | null;
  generatedCv: string;
  coverLetter: string;
  hasPaid: boolean;
  isLoggedIn: boolean;
  onBack: () => void;
  onFinish: () => void;
  onSignIn: () => void;
  onCheckout: () => void;
}

export function StepExport({
  applicationId,
  generatedCv,
  coverLetter,
  hasPaid,
  isLoggedIn,
  onBack,
  onFinish,
  onSignIn,
  onCheckout,
}: StepExportProps) {
  const [copied, setCopied] = useState<"cv" | "letter" | null>(null);

  const copyToClipboard = async (content: string, type: "cv" | "letter") => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Export your application
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Download, copy, or publish your CV and cover letter
        </p>
      </div>

      {/* Export Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* CV Export */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
            CV
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => copyToClipboard(generatedCv, "cv")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 text-sm"
            >
              {copied === "cv" ? "Copied!" : "Copy to Clipboard"}
            </button>
            {hasPaid ? (
              <button
                onClick={() => printCV(generatedCv)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Download PDF
              </button>
            ) : (
              <button
                onClick={onCheckout}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-sm flex items-center justify-center gap-2"
              >
                <span>🔒</span> PDF Export (Pro)
              </button>
            )}
          </div>
        </div>

        {/* Cover Letter Export */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
            Cover Letter
          </h3>
          {coverLetter ? (
            <div className="space-y-3">
              <button
                onClick={() => copyToClipboard(coverLetter, "letter")}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 text-sm"
              >
                {copied === "letter" ? "Copied!" : "Copy to Clipboard"}
              </button>
              {hasPaid ? (
                <button
                  onClick={() => printCoverLetter(coverLetter)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Download PDF
                </button>
              ) : (
                <button
                  onClick={onCheckout}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <span>🔒</span> PDF Export (Pro)
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cover letter not generated
            </p>
          )}
        </div>
      </div>

      {/* Publish Option */}
      {hasPaid && applicationId && (
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
            Publish Online
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            Share your CV with a unique link (e.g., unplugged.cv/cv/yourname)
          </p>
          <a
            href={`/app/${applicationId}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Go to Application Settings
          </a>
        </div>
      )}

      {!hasPaid && (
        <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-white">
          <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
          <p className="text-sm opacity-90 mb-4">
            Get PDF exports, cover letters, unlimited applications, and public
            CV links.
          </p>
          <button
            onClick={onCheckout}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
          >
            Upgrade for $19
          </button>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
        >
          Back
        </button>
        {isLoggedIn ? (
          <button
            onClick={onFinish}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Done
          </button>
        ) : (
          <button
            onClick={onSignIn}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign in to Save
          </button>
        )}
      </div>
    </div>
  );
}
