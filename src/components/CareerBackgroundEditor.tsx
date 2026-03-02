"use client";

import { useState, useEffect } from "react";

interface CareerBackgroundEditorProps {
  initialBackground?: string;
}

export function CareerBackgroundEditor({ initialBackground = "" }: CareerBackgroundEditorProps) {
  const [careerBackground, setCareerBackground] = useState(initialBackground);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialBackground) {
      setCareerBackground(initialBackground);
    }
  }, [initialBackground]);

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerBackground }),
      });
      setLastSaved(new Date());
    } catch (err) {
      console.error("Failed to save:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Career Background
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Pre-filled when creating new applications
          </p>
        </div>
        {lastSaved && (
          <p className="text-xs text-green-600 dark:text-green-400">
            Saved {lastSaved.toLocaleTimeString()}
          </p>
        )}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      <textarea
        value={careerBackground}
        onChange={(e) => setCareerBackground(e.target.value)}
        placeholder="Paste your career background here: work experience, skills, education, achievements..."
        className="w-full h-48 p-4 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
    </section>
  );
}
