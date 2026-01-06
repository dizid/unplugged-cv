"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { createPortal } from "react-dom";
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

  // Load saved background and payment status on mount
  useEffect(() => {
    // Check test mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("test") === "test123") {
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
        const testMode =
          new URLSearchParams(window.location.search).get("test") === "test123"
            ? "test123"
            : undefined;

        const saveRes = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobDescription,
            parsedJob,
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
  }, [background, jobDescription, parsedJob, hasPaid, goToStep, session.data?.user]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ProgressBar currentStep={currentStep} onStepClick={goToStep} />

      <div className="mt-8">
        {currentStep === 1 && (
          <StepJob
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            parsedJob={parsedJob}
            setParsedJob={setParsedJob}
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
            onUpgrade={() => setShowCheckout(true)}
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
            onCheckout={() => setShowCheckout(true)}
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
        onComplete={() => {
          setShowCheckout(false);
          setHasPaid(true);
        }}
        cvId={applicationId || undefined}
      />
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

function AuthModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const session = authClient.useSession();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Close modal when user signs in
  useEffect(() => {
    if (session.data?.user) {
      onClose();
    }
  }, [session.data?.user, onClose]);

  const modalContent = (
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
    </div>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
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
