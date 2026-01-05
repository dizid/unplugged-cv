"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { AuthButton } from "@/components/AuthButton";
import { ActionPanel } from "@/components/ActionPanel";
import { ImportButtons } from "@/components/ImportButtons";
import { URLImportModal } from "@/components/URLImportModal";
import { GoogleDocsModal } from "@/components/GoogleDocsModal";
import { JobAnalysis } from "@/components/JobAnalysis";
import { authClient } from "@/lib/auth/client";
import type { ParsedJob } from "@/app/api/parse-job/route";

export default function Home() {
  const [background, setBackground] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [cvId, setCvId] = useState<string | undefined>();
  const [hasPaid, setHasPaid] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showGoogleDocsModal, setShowGoogleDocsModal] = useState(false);
  const [parsedJob, setParsedJob] = useState<ParsedJob | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [activeView, setActiveView] = useState<"cv" | "cover-letter">("cv");
  const outputRef = useRef<HTMLDivElement>(null);
  const session = authClient.useSession();
  const user = session.data?.user;

  // Handle imported content
  const handleImportContent = useCallback((content: string) => {
    setBackground((prev) => (prev ? prev + "\n\n" + content : content));
  }, []);

  // Check payment status when user logs in
  useEffect(() => {
    if (user) {
      fetch("/api/user-status")
        .then((res) => res.json())
        .then((data) => setHasPaid(data.hasPaid || false))
        .catch(() => setHasPaid(false));
    } else {
      setHasPaid(false);
    }
  }, [user]);

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

      // Save to database if logged in
      if (user) {
        const saveRes = await fetch("/api/save-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobDescription: jobDescription || null,
            generatedCv: fullOutput,
            modelUsed: "claude-sonnet-4-20250514",
          }),
        });
        const saveData = await saveRes.json();
        if (saveData.id) {
          setCvId(saveData.id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }, [background, jobDescription, user]);

  const generateCoverLetter = useCallback(async () => {
    if (!output || !parsedJob) return;

    setIsGeneratingCoverLetter(true);
    setCoverLetter("");
    setActiveView("cover-letter");

    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv: output, parsedJob }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate cover letter");
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
        setCoverLetter(fullOutput);

        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate cover letter");
      setActiveView("cv");
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  }, [output, parsedJob]);

  const copyToClipboard = useCallback(async () => {
    const contentToCopy = activeView === "cv" ? output : coverLetter;
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard");
    }
  }, [output, coverLetter, activeView]);

  const clearAll = useCallback(() => {
    setBackground("");
    setJobDescription("");
    setOutput("");
    setCoverLetter("");
    setError("");
    setParsedJob(null);
    setActiveView("cv");
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                unplugged<span className="text-blue-600">.cv</span>
              </span>
            </div>
          </Link>

          {/* Center tagline - hidden on mobile */}
          <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400 absolute left-1/2 -translate-x-1/2">
            Your career, unplugged.
          </p>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {output && (
              <button
                onClick={clearAll}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start over
              </button>
            )}
            <AuthButton />
          </div>
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

              {/* Import Buttons */}
              <ImportButtons
                onGoogleDocsClick={() => setShowGoogleDocsModal(true)}
                onUrlClick={() => setShowUrlModal(true)}
                disabled={isGenerating}
              />
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

              {/* Job Analysis */}
              <JobAnalysis jobDescription={jobDescription} onJobParsed={setParsedJob} />
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
          <div className="grid lg:grid-cols-[1fr,340px] gap-8">
            {/* Document Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {/* Toggle buttons */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <button
                    onClick={() => setActiveView("cv")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeView === "cv"
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    CV
                  </button>
                  <button
                    onClick={() => coverLetter ? setActiveView("cover-letter") : generateCoverLetter()}
                    disabled={!parsedJob || isGeneratingCoverLetter}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeView === "cover-letter"
                        ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                    title={!parsedJob ? "Analyze a job description first" : ""}
                  >
                    {isGeneratingCoverLetter && (
                      <span className="animate-spin">⏳</span>
                    )}
                    Cover Letter
                    {!coverLetter && parsedJob && !isGeneratingCoverLetter && (
                      <span className="text-xs text-blue-600 dark:text-blue-400">+</span>
                    )}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setOutput("");
                    setCoverLetter("");
                    setActiveView("cv");
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  Edit & Regenerate
                </button>
              </div>

              <div
                id="cv-preview"
                ref={outputRef}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 max-h-[70vh] overflow-y-auto"
              >
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {activeView === "cv" ? output : coverLetter}
                  </ReactMarkdown>
                </div>
              </div>

              {(isGenerating || isGeneratingCoverLetter) && (
                <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                  {isGeneratingCoverLetter ? "Writing cover letter..." : "Still writing..."}
                </p>
              )}
            </div>

            {/* Action Panel */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <ActionPanel
                hasPaid={hasPaid}
                isLoggedIn={!!user}
                cvId={cvId}
                onCopy={copyToClipboard}
                copied={copied}
                cv={output}
                parsedJob={parsedJob}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No account needed. No subscription. Just paste and generate.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/terms"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Import Modals */}
      <URLImportModal
        isOpen={showUrlModal}
        onClose={() => setShowUrlModal(false)}
        onImport={handleImportContent}
      />
      <GoogleDocsModal
        isOpen={showGoogleDocsModal}
        onClose={() => setShowGoogleDocsModal(false)}
        onImport={handleImportContent}
      />
    </main>
  );
}
