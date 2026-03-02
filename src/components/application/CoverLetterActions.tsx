"use client";

import { useState, useRef } from "react";

interface CoverLetterActionsProps {
  applicationId: string;
  coverLetter: string | null;
  generatedCv: string | null;
  parsedJob: string | null; // JSON string from DB
  hasPaid: boolean;
  onCoverLetterUpdate: (newLetter: string) => void;
}

const QUICK_ACTIONS = [
  "More concise",
  "More formal",
  "More casual",
  "Emphasize leadership",
  "Emphasize technical skills",
] as const;

export function CoverLetterActions({
  applicationId,
  coverLetter,
  generatedCv,
  parsedJob,
  hasPaid,
  onCoverLetterUpdate,
}: CoverLetterActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [customInstruction, setCustomInstruction] = useState("");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Parse the JSON job string once
  const parsedJobObj = (() => {
    if (!parsedJob) return null;
    try {
      return JSON.parse(parsedJob) as { title?: string; company?: string };
    } catch {
      return null;
    }
  })();

  // --- State 1: Not paid ---
  if (!hasPaid) {
    return (
      <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Unlock AI-powered cover letters
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Generate tailored cover letters and refine them with one-click actions. Upgrade to Pro to access this feature.
            </p>
          </div>
        </div>
        <a
          href="/api/checkout-embedded"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Upgrade to Pro
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    );
  }

  // Stream helper — shared between generate and refine flows
  async function streamResponse(
    url: string,
    body: Record<string, unknown>,
    onChunk: (text: string) => void,
    signal: AbortSignal
  ): Promise<string> {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: "Request failed" }));
      throw new Error((data as { error?: string }).error || `HTTP ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
      onChunk(result);
    }

    return result;
  }

  // Save cover letter to DB via PATCH
  async function saveCoverLetter(letter: string) {
    await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverLetter: letter }),
    });
  }

  // --- State 2: No cover letter yet, paid ---
  async function handleGenerate() {
    if (isGenerating) return;
    setError(null);
    setStreamingText("");
    setIsGenerating(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await streamResponse(
        "/api/generate-cover-letter",
        {
          cv: generatedCv || "",
          parsedJob: parsedJobObj,
        },
        (text) => setStreamingText(text),
        controller.signal
      );

      await saveCoverLetter(result);
      onCoverLetterUpdate(result);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Failed to generate cover letter");
      }
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  }

  if (!coverLetter) {
    return (
      <div className="space-y-3">
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {streamingText ? (
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap animate-pulse">
            {streamingText}
          </div>
        ) : null}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Cover Letter
            </>
          )}
        </button>
      </div>
    );
  }

  // --- State 3: Has cover letter, paid — show refinement UI ---

  async function triggerRefinement(instruction: string) {
    if (isRefining || !instruction.trim()) return;
    setError(null);
    setStreamingText("");
    setActiveChip(instruction);
    setIsRefining(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamResponse(
        "/api/refine-cover-letter",
        {
          coverLetter,
          instruction,
          cv: generatedCv || undefined,
          parsedJob: parsedJobObj || undefined,
        },
        (text) => setStreamingText(text),
        controller.signal
      );
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Failed to refine cover letter");
        setStreamingText("");
      }
    } finally {
      setIsRefining(false);
      // Keep activeChip set so the preview stays open for Accept/Discard
    }
  }

  async function handleAccept() {
    if (!streamingText) return;
    await saveCoverLetter(streamingText);
    onCoverLetterUpdate(streamingText);
    setStreamingText("");
    setActiveChip(null);
    setCustomInstruction("");
  }

  function handleDiscard() {
    setStreamingText("");
    setActiveChip(null);
    // Don't clear customInstruction — user may want to adjust and retry
  }

  async function handleRegenerate() {
    if (isGenerating) return;
    setError(null);
    setStreamingText("");
    setActiveChip(null);
    setIsGenerating(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await streamResponse(
        "/api/generate-cover-letter",
        {
          cv: generatedCv || "",
          parsedJob: parsedJobObj,
        },
        (text) => setStreamingText(text),
        controller.signal
      );

      await saveCoverLetter(result);
      onCoverLetterUpdate(result);
      setStreamingText("");
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Failed to regenerate cover letter");
      }
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  }

  const isStreaming = isRefining && !!streamingText;
  const hasPreview = !!streamingText && !isRefining;

  return (
    <div className="space-y-4">
      {/* Quick-action chips */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Quick refinements
        </p>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              onClick={() => triggerRefinement(action)}
              disabled={isRefining || isGenerating}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                activeChip === action
                  ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {isRefining && activeChip === action ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {action}
                </span>
              ) : (
                action
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom instruction */}
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
          Custom instruction
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") triggerRefinement(customInstruction);
            }}
            placeholder="e.g. Add more about project management experience"
            disabled={isRefining || isGenerating}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
          />
          <button
            onClick={() => triggerRefinement(customInstruction)}
            disabled={isRefining || isGenerating || customInstruction.trim().length < 3}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Refine
          </button>
        </div>
      </div>

      {/* Streaming preview */}
      {(isStreaming || hasPreview) && (
        <div className="space-y-3">
          <div
            className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-64 overflow-y-auto ${
              isStreaming ? "animate-pulse" : ""
            }`}
          >
            {streamingText}
          </div>

          {/* Accept / Discard — shown only when streaming is complete */}
          {hasPreview && (
            <div className="flex gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Accept
              </button>
              <button
                onClick={handleDiscard}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
              >
                Discard
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Regenerate from scratch */}
      <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleRegenerate}
          disabled={isRefining || isGenerating}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 text-gray-600 dark:text-gray-400 text-sm rounded-lg transition-colors"
        >
          {isGenerating ? "Regenerating..." : "Regenerate from scratch"}
        </button>
      </div>
    </div>
  );
}
