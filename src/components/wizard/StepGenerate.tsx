"use client";

import ReactMarkdown from "react-markdown";

interface StepGenerateProps {
  generatedCv: string;
  coverLetter: string;
  isGenerating: boolean;
  activeTab: "cv" | "cover-letter";
  setActiveTab: (tab: "cv" | "cover-letter") => void;
  hasPaid: boolean;
  onBack: () => void;
  onNext: () => void;
  onUpgrade: () => void;
}

export function StepGenerate({
  generatedCv,
  coverLetter,
  isGenerating,
  activeTab,
  setActiveTab,
  hasPaid,
  onBack,
  onNext,
  onUpgrade,
}: StepGenerateProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {isGenerating ? "Generating your application..." : "Your application"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {isGenerating
            ? "This usually takes 15-30 seconds"
            : "Review your tailored CV and cover letter"}
        </p>
      </div>

      {/* Tab buttons */}
      <div className="flex gap-2">
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
          {!hasPaid && (
            <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">Pro</span>
          )}
          {hasPaid && !coverLetter && isGenerating && (
            <span className="ml-1 text-xs">(generating...)</span>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px] p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-y-auto max-h-[60vh]">
        {isGenerating && !generatedCv ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p className="text-gray-500 dark:text-gray-400">
                Analyzing job requirements and crafting your CV...
              </p>
            </div>
          </div>
        ) : activeTab === "cover-letter" && !hasPaid ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center max-w-md">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Unlock Cover Letters
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get a tailored cover letter that highlights your best fit for this role. Upgrade to Pro for unlimited cover letters, PDF exports, and more.
              </p>
              <button
                onClick={onUpgrade}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        ) : activeTab === "cover-letter" && !coverLetter && isGenerating ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p className="text-gray-500 dark:text-gray-400">
                Generating your cover letter...
              </p>
            </div>
          </div>
        ) : (
          <div className="cv-prose">
            <ReactMarkdown>
              {activeTab === "cv" ? generatedCv : coverLetter}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {isGenerating && (
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse text-center">
          Still generating...
        </p>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={isGenerating}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={isGenerating || !generatedCv}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          Next: Export
        </button>
      </div>
    </div>
  );
}
