"use client";

import { useState, useCallback, useRef } from "react";
import type { ParsedJob } from "@/app/api/parse-job/route";

interface JobAnalysisProps {
  jobDescription: string;
  onJobParsed?: (parsed: ParsedJob) => void;
}

export function JobAnalysis({ jobDescription, onJobParsed }: JobAnalysisProps) {
  const [parsedJob, setParsedJob] = useState<ParsedJob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelAnalysis = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsAnalyzing(false);
    setError("");
  }, []);

  const analyzeJob = useCallback(async () => {
    if (!jobDescription || jobDescription.trim().length < 50) {
      setError("Job description is too short to analyze");
      return;
    }

    // Cancel any existing request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch("/api/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze job");
      }

      const parsed = await response.json();
      setParsedJob(parsed);
      onJobParsed?.(parsed);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return; // User cancelled, don't show error
      }
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  }, [jobDescription, onJobParsed]);

  if (!jobDescription || jobDescription.trim().length < 50) {
    return null;
  }

  if (!parsedJob && !isAnalyzing) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Analyze this job description
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              See requirements breakdown, red flags, and company signals
            </p>
          </div>
          <button
            onClick={analyzeJob}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Analyze Job
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="mt-4 p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
            <span className="text-gray-600 dark:text-gray-400">Analyzing job description...</span>
          </div>
          <button
            onClick={cancelAnalysis}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (!parsedJob) return null;

  const severityColors = {
    low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    medium: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const workModeIcons = {
    remote: "🌍",
    hybrid: "🏢",
    onsite: "🏛️",
    unclear: "❓",
  };

  const seniorityColors = {
    junior: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    mid: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    senior: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    lead: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    executive: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    unclear: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">📊</span>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Job Analysis
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {parsedJob.title} {parsedJob.company ? `at ${parsedJob.company}` : ""}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Summary */}
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
            {parsedJob.summary}
          </p>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${seniorityColors[parsedJob.seniorityLevel]}`}>
              {parsedJob.seniorityLevel.charAt(0).toUpperCase() + parsedJob.seniorityLevel.slice(1)} Level
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
              {workModeIcons[parsedJob.workMode]} {parsedJob.workMode.charAt(0).toUpperCase() + parsedJob.workMode.slice(1)}
            </span>
            {parsedJob.location && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                📍 {parsedJob.location}
              </span>
            )}
            {parsedJob.compensation?.salary && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                💰 {parsedJob.compensation.salary.currency}{parsedJob.compensation.salary.min.toLocaleString()}-{parsedJob.compensation.salary.max.toLocaleString()}
              </span>
            )}
          </div>

          {/* Red Flags */}
          {parsedJob.redFlags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                🚩 Red Flags
                <span className="text-xs font-normal text-gray-500">({parsedJob.redFlags.length})</span>
              </h4>
              <div className="space-y-2">
                {parsedJob.redFlags.map((rf, i) => (
                  <div key={i} className={`p-3 rounded-lg ${severityColors[rf.severity]}`}>
                    <p className="text-sm font-medium">{rf.flag}</p>
                    {rf.quote && (
                      <p className="text-xs mt-1 opacity-75">&quot;{rf.quote}&quot;</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {parsedJob.highlights.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                ✨ Highlights
              </h4>
              <ul className="space-y-1">
                {parsedJob.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Must Have */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Must Have
              </h4>
              <ul className="space-y-1.5">
                {parsedJob.requirements.mustHave.map((req, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">{req.skill}</span>
                    {req.years && <span className="text-gray-500"> ({req.years})</span>}
                  </li>
                ))}
                {parsedJob.requirements.mustHave.length === 0 && (
                  <li className="text-sm text-gray-400 italic">None explicitly stated</li>
                )}
              </ul>
            </div>

            {/* Nice to Have */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Nice to Have
              </h4>
              <ul className="space-y-1.5">
                {parsedJob.requirements.niceToHave.map((req, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">{req.skill}</span>
                    {req.years && <span className="text-gray-500"> ({req.years})</span>}
                  </li>
                ))}
                {parsedJob.requirements.niceToHave.length === 0 && (
                  <li className="text-sm text-gray-400 italic">None listed</li>
                )}
              </ul>
            </div>
          </div>

          {/* Tech Stack */}
          {parsedJob.signals.techStack.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                🛠️ Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {parsedJob.signals.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Signals */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {parsedJob.signals.teamSize && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Team Size</span>
                  <p className="font-medium text-gray-900 dark:text-white">{parsedJob.signals.teamSize}</p>
                </div>
              )}
              {parsedJob.signals.reportsTo && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Reports To</span>
                  <p className="font-medium text-gray-900 dark:text-white">{parsedJob.signals.reportsTo}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500 dark:text-gray-400">Autonomy</span>
                <p className="font-medium text-gray-900 dark:text-white capitalize">{parsedJob.signals.autonomy}</p>
              </div>
              {parsedJob.signals.industryDomain && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Industry</span>
                  <p className="font-medium text-gray-900 dark:text-white">{parsedJob.signals.industryDomain}</p>
                </div>
              )}
            </div>
          </div>

          {/* Re-analyze button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={analyzeJob}
              className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Re-analyze
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
