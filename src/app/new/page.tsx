"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ProgressBar,
  StepJob,
  StepBackground,
  StepGenerate,
  StepExport,
} from "@/components/wizard";
import { URLImportModal } from "@/components/URLImportModal";
import { GoogleDocsModal } from "@/components/GoogleDocsModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { AuthButton } from "@/components/AuthButton";
import { authClient } from "@/lib/auth/client";
import { AuthView } from "@neondatabase/auth/react";
import type { ParsedJob } from "@/app/api/parse-job/route";

function NewApplicationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get("step") || "1");

  // Auth state
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  // Wizard state
  const [jobDescription, setJobDescription] = useState("");
  const [parsedJob, setParsedJob] = useState<ParsedJob | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [background, setBackground] = useState("");
  const [generatedCv, setGeneratedCv] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [activeTab, setActiveTab] = useState<"cv" | "cover-letter">("cv");

  // Modal state
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showGoogleDocsModal, setShowGoogleDocsModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Redirect to step 1 if required state is missing (e.g., after hard refresh)
  useEffect(() => {
    if (currentStep >= 3 && !generatedCv && !isGenerating) {
      router.replace("/new");
    }
  }, [currentStep, generatedCv, isGenerating, router]);

  // Auto-populate job title and company from parsed job
  useEffect(() => {
    if (parsedJob?.title) {
      setJobTitle(parsedJob.title);
    }
    if (parsedJob?.company) {
      setCompanyName(parsedJob.company);
    }
  }, [parsedJob]);

  // Load saved background and payment status on mount
  useEffect(() => {
    // Check test mode (enabled via ?test=<secret>)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("test")) {
      setHasPaid(true);
    }

    // Only fetch profile if logged in
    if (session.data?.user) {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.careerBackground) {
            setBackground(data.careerBackground);
          }
          if (data.hasPaid) {
            setHasPaid(true);
          }
        })
        .catch(() => {});
    }
  }, [session.data?.user]);

  // Save application after user signs in (if not already saved)
  useEffect(() => {
    const saveApplication = async () => {
      if (!session.data?.user || applicationId || !generatedCv || isGenerating) {
        return;
      }

      try {
        const testMode = new URLSearchParams(window.location.search).get("test") || undefined;
        const saveRes = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobDescription,
            parsedJob,
            jobTitle,
            companyName,
            background,
            generatedCv,
            testMode,
          }),
        });

        if (saveRes.ok) {
          const saveData = await saveRes.json();
          if (saveData.id) {
            setApplicationId(saveData.id);
          }
        }
      } catch (err) {
        console.error("Error saving application after sign-in:", err);
      }
    };

    saveApplication();
  }, [session.data?.user, applicationId, generatedCv, isGenerating, jobDescription, parsedJob, jobTitle, companyName, background]);

  const goToStep = useCallback(
    (step: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", step.toString());
      router.push(`/new?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleImportContent = useCallback((content: string) => {
    setBackground((prev) => (prev ? prev + "\n\n" + content : content));
  }, []);

  // Handle checkout - show auth modal first if not logged in
  const handleCheckout = useCallback(() => {
    if (isLoggedIn) {
      setShowCheckout(true);
    } else {
      setShowAuthModal(true);
    }
  }, [isLoggedIn]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setGeneratedCv("");
    setCoverLetter("");
    goToStep(3);

    try {
      // Generate CV
      const cvResponse = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ background, jobDescription }),
      });

      if (!cvResponse.ok) {
        throw new Error("Failed to generate CV");
      }

      const reader = cvResponse.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullCv = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullCv += chunk;
        setGeneratedCv(fullCv);
      }

      // Strip suggestions section
      const suggestionSeparator = /\n+(?:---\s*\n+)?## To Strengthen This CV/i;
      const cleanCv = fullCv.split(suggestionSeparator)[0]?.trim() || fullCv;
      setGeneratedCv(cleanCv);

      // Save the application only if logged in
      if (session.data?.user) {
        const testMode = new URLSearchParams(window.location.search).get("test") || undefined;

        const saveRes = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobDescription,
            parsedJob,
            jobTitle,
            companyName,
            background,
            generatedCv: cleanCv,
            testMode,
          }),
        });

        if (saveRes.ok) {
          const saveData = await saveRes.json();
          if (saveData.id) {
            setApplicationId(saveData.id);
          }
        }
      }

      // Generate cover letter if job is parsed and user has paid
      if (parsedJob && hasPaid) {
        const letterResponse = await fetch("/api/generate-cover-letter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cv: cleanCv, parsedJob }),
        });

        if (letterResponse.ok) {
          const letterReader = letterResponse.body?.getReader();
          if (letterReader) {
            let fullLetter = "";
            while (true) {
              const { done, value } = await letterReader.read();
              if (done) break;
              fullLetter += decoder.decode(value, { stream: true });
              setCoverLetter(fullLetter);
            }
          }
        }
      }
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [background, jobDescription, parsedJob, jobTitle, companyName, hasPaid, goToStep, session.data?.user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                <path
                  d="M7 5 L7 21 Q7 27 13 27 L14 27"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M25 5 L25 21 Q25 27 19 27 L18 27"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              unplugged<span className="text-blue-600">.cv</span>
            </span>
          </Link>
          <AuthButton />
        </div>
      </header>

      {/* Wizard Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ProgressBar currentStep={currentStep} onStepClick={goToStep} />

      <div className="mt-8">
        {currentStep === 1 && (
          <StepJob
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            parsedJob={parsedJob}
            setParsedJob={setParsedJob}
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            companyName={companyName}
            setCompanyName={setCompanyName}
            onNext={() => goToStep(2)}
          />
        )}

        {currentStep === 2 && (
          <StepBackground
            background={background}
            setBackground={setBackground}
            onBack={() => goToStep(1)}
            onGenerate={handleGenerate}
            onGoogleDocsClick={() => setShowGoogleDocsModal(true)}
            onUrlClick={() => setShowUrlModal(true)}
          />
        )}

        {currentStep === 3 && (
          <StepGenerate
            generatedCv={generatedCv}
            coverLetter={coverLetter}
            isGenerating={isGenerating}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            hasPaid={hasPaid}
            onBack={() => goToStep(2)}
            onNext={() => goToStep(4)}
            onUpgrade={handleCheckout}
          />
        )}

        {currentStep === 4 && (
          <StepExport
            applicationId={applicationId}
            generatedCv={generatedCv}
            coverLetter={coverLetter}
            hasPaid={hasPaid}
            isLoggedIn={isLoggedIn}
            onBack={() => goToStep(3)}
            onFinish={() => router.push("/app")}
            onSignIn={() => setShowAuthModal(true)}
            onCheckout={handleCheckout}
          />
        )}
      </div>

      {/* Modals */}
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
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onComplete={async () => {
          setShowCheckout(false);
          setHasPaid(true); // Optimistic update

          // Poll server to confirm payment was processed by webhook
          // Retry up to 5 times with 1s delay to allow webhook to process
          for (let i = 0; i < 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            try {
              const res = await fetch("/api/user-status");
              const data = await res.json();
              if (data.hasPaid) {
                setHasPaid(true);
                return; // Payment confirmed in DB
              }
            } catch {
              // Ignore errors, keep polling
            }
          }
          // If we get here, webhook may not have fired yet
          // Keep optimistic state, it will sync on next page load
        }}
        cvId={applicationId || undefined}
      />
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
      </div>
    </div>
  );
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const session = authClient.useSession();

  // Close modal when user signs in
  useEffect(() => {
    if (session.data?.user) {
      onClose();
    }
  }, [session.data?.user, onClose]);


  // Only render portal on client
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center">
          Sign in to save your CV
        </h2>
        <AuthView />
      </div>
    </div>,
    document.body
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function NewApplicationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewApplicationContent />
    </Suspense>
  );
}
