"use client";

import { JobAnalysis } from "@/components/JobAnalysis";
import type { ParsedJob } from "@/app/api/parse-job/route";

interface JobDescriptionPanelProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  parsedJob: ParsedJob | null;
  setParsedJob: (parsed: ParsedJob | null) => void;
}

export function JobDescriptionPanel({
  jobDescription,
  setJobDescription,
  parsedJob,
  setParsedJob,
}: JobDescriptionPanelProps) {
  return (
    <div className="space-y-6">
      {/* Job Description Input */}
      <div>
        <label
          htmlFor="job-panel"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Job Description
        </label>
        <textarea
          id="job-panel"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description you're targeting. The AI will analyze requirements and match against your CV."
          className="w-full h-48 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {jobDescription.length < 50
            ? `Enter at least 50 characters to analyze (${jobDescription.length}/50)`
            : `${jobDescription.length} characters`}
        </p>
      </div>

      {/* Job Analysis */}
      <JobAnalysis
        jobDescription={jobDescription}
        onJobParsed={setParsedJob}
      />

      {/* Prompt to analyze if job text exists but not analyzed */}
      {jobDescription.length >= 50 && !parsedJob && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Click &quot;Analyze Job&quot; above to analyze the job requirements.
          </p>
        </div>
      )}
    </div>
  );
}
