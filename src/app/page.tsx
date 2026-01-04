"use client";

import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [background, setBackground] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const generate = useCallback(async () => {
    if (!background.trim()) {
      setError("Please paste your career information first");
      return;
    }

    setIsGenerating(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background, jobDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate CV");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullOutput = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullOutput += chunk;
        setOutput(fullOutput);

        // Auto-scroll to bottom during generation
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }, [background, jobDescription]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard");
    }
  }, [output]);

  const clearAll = useCallback(() => {
    setBackground("");
    setJobDescription("");
    setOutput("");
    setError("");
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              CV Builder
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Paste your mess. Get a CV that works.
            </p>
          </div>
          {output && (
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Start over
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!output ? (
          /* Input View */
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Main Input */}
            <div>
              <label
                htmlFor="background"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your career story
              </label>
              <textarea
                id="background"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Paste anything here - your LinkedIn profile, an old CV, random notes about your work history, project descriptions... The AI will figure it out.

Example:
- 10 years in marketing, started at agencies, now head of growth at a startup
- Launched 3 products that hit $1M ARR
- Managed teams of 5-15 people
- Good with data, SQL, some Python
- MBA from State University 2015"
                className="w-full h-64 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isGenerating}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Don&apos;t worry about formatting. Paste LinkedIn exports, old
                CVs, brain dumps - anything goes.
              </p>
            </div>

            {/* Job Description (Optional) */}
            <div>
              <label
                htmlFor="job"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Target job{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="job"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description you're applying for. The AI will tailor your CV to highlight relevant experience."
                className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isGenerating}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={isGenerating || !background.trim()}
              className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium text-lg transition-colors flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating your CV...
                </>
              ) : (
                <>
                  <span>✨</span>
                  Generate My CV
                </>
              )}
            </button>
          </div>
        ) : (
          /* Output View */
          <div className="grid lg:grid-cols-2 gap-8">
            {/* CV Output */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your CV
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
                  >
                    {copied ? "✓ Copied!" : "Copy Markdown"}
                  </button>
                  <button
                    onClick={() => setOutput("")}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                  >
                    Edit & Regenerate
                  </button>
                </div>
              </div>

              <div
                ref={outputRef}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 max-h-[70vh] overflow-y-auto"
              >
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown>{output}</ReactMarkdown>
                </div>
              </div>

              {isGenerating && (
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                  Still writing...
                </p>
              )}
            </div>

            {/* Raw Markdown */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Raw Markdown
              </h2>
              <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 max-h-[70vh] overflow-y-auto">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                  {output}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Coming Soon: Paid Features */}
        {output && !isGenerating && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Want more?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download as PDF, get a public CV page, save your history
                </p>
              </div>
              <button
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-colors"
                onClick={() => alert("Coming soon! $10 one-time for all features.")}
              >
                Unlock for $10
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            No account needed. No subscription. Just paste and generate.
          </p>
        </div>
      </footer>
    </main>
  );
}
