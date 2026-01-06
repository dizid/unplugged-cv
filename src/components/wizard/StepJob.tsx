"use client";

import { JobAnalysis } from "@/components/JobAnalysis";
import type { ParsedJob } from "@/app/api/parse-job/route";

interface StepJobProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  parsedJob: ParsedJob | null;
  setParsedJob: (job: ParsedJob | null) => void;
  onNext: () => void;
}

export function StepJob({
  jobDescription,
  setJobDescription,
  parsedJob,
  setParsedJob,
  onNext,
}: StepJobProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Paste the job posting
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          We&apos;ll analyze the requirements and tailor your CV accordingly
        </p>
      </div>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the full job description here..."
        className="w-full h-64 p-4 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
      />

      {/* Job Analysis */}
      <JobAnalysis jobDescription={jobDescription} onJobParsed={setParsedJob} />

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!jobDescription.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Next: Your Background
        </button>
      </div>
    </div>
  );
}
