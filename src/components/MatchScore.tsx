"use client";

import { useState, useCallback, useEffect } from "react";
import type { MatchResult } from "@/app/api/match-score/route";
import type { ParsedJob } from "@/app/api/parse-job/route";

interface MatchScoreProps {
  cv: string;
  parsedJob: ParsedJob | null;
  hasPaid: boolean;
  onCheckout: () => void;
}

export function MatchScore({ cv, parsedJob, hasPaid, onCheckout }: MatchScoreProps) {
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Reset when inputs change
  useEffect(() => {
    setMatchResult(null);
    setError("");
  }, [cv, parsedJob]);

  const analyzeMatch = useCallback(async () => {
    if (!hasPaid) {
      onCheckout();
      return;
    }

    if (!cv || !parsedJob) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch("/api/match-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, parsedJob }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze match");
      }

      const result = await response.json();
      setMatchResult(result);
      setIsExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  }, [cv, parsedJob, hasPaid, onCheckout]);

  // Don't show if no job description analyzed
  if (!parsedJob) {
    return null;
  }

  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 50) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  const getSeniorityIcon = (fit: string) => {
    if (fit === "match") return "✓";
    if (fit === "over") return "↑";
    return "↓";
  };

  const LockIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );

  // Not analyzed yet - show CTA
  if (!matchResult && !isAnalyzing) {
    return (
      <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Match Score
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          See how well your CV matches this job
        </p>
        <button
          onClick={analyzeMatch}
          className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          {!hasPaid && <LockIcon />}
          Analyze Match
        </button>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }

  // Analyzing
  if (isAnalyzing) {
    return (
      <div className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Analyzing match...</span>
        </div>
      </div>
    );
  }

  // Results
  if (!matchResult) return null;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header with score */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getScoreBg(matchResult.score)}`}>
            <span className={`text-lg font-bold ${getScoreColor(matchResult.score)}`}>
              {matchResult.score}
            </span>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Match Score
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {matchResult.score >= 75 ? "Strong match" : matchResult.score >= 50 ? "Moderate match" : "Weak match"}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
          {/* Summary */}
          <p className="text-sm text-gray-600 dark:text-gray-400 pt-3">
            {matchResult.summary}
          </p>

          {/* Seniority fit */}
          <div className="flex items-center gap-2 text-sm">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              matchResult.seniorityFit === "match"
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}>
              {getSeniorityIcon(matchResult.seniorityFit)}
            </span>
            <span className="text-gray-700 dark:text-gray-300">{matchResult.seniorityNote}</span>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Skills
            </h4>
            <div className="space-y-1.5">
              {matchResult.skillMatches.slice(0, 6).map((skill, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className={skill.matched ? "text-green-500" : "text-gray-300 dark:text-gray-600"}>
                    {skill.matched ? "✓" : "○"}
                  </span>
                  <div>
                    <span className={skill.matched ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                      {skill.skill}
                    </span>
                    {skill.evidence && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {skill.evidence}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gaps */}
          {matchResult.gaps.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Gaps to Address
              </h4>
              <ul className="space-y-1">
                {matchResult.gaps.slice(0, 3).map((gap, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">!</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Talking Points */}
          {matchResult.talkingPoints.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Interview Talking Points
              </h4>
              <ul className="space-y-1">
                {matchResult.talkingPoints.slice(0, 3).map((point, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">→</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Re-analyze button */}
          <button
            onClick={analyzeMatch}
            className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            Re-analyze
          </button>
        </div>
      )}
    </div>
  );
}
