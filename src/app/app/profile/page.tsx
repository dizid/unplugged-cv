"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [careerBackground, setCareerBackground] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [applicationCount, setApplicationCount] = useState(0);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setCareerBackground(data.careerBackground || "");
        setHasPaid(data.hasPaid || false);
        setApplicationCount(data.applicationCount || 0);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerBackground }),
      });
      setLastSaved(new Date());
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Your Profile
      </h1>

      {/* Account Status */}
      <div className="mb-8 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="font-semibold mb-4 text-gray-900 dark:text-white">
          Account Status
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Plan:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {hasPaid ? "Pro" : "Free"}
              </span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Applications created:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {applicationCount}
              </span>
              {!hasPaid && <span className="text-gray-400"> / 3</span>}
            </p>
          </div>
          {!hasPaid && (
            <Link
              href="/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Upgrade to Pro
            </Link>
          )}
        </div>
      </div>

      {/* Career Background */}
      <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Career Background
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This will be pre-filled when you create new applications
            </p>
          </div>
          {lastSaved && (
            <p className="text-xs text-green-600 dark:text-green-400">
              Saved {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>

        <textarea
          value={careerBackground}
          onChange={(e) => setCareerBackground(e.target.value)}
          placeholder={`Paste your career background here. This can include:

- Work experience and job titles
- Skills and technologies
- Education and certifications
- Projects and achievements
- LinkedIn profile content
- Old CV content

This will be saved and pre-filled whenever you create a new application.`}
          className="w-full h-64 p-4 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Background"}
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
          Tips for a great career background
        </h3>
        <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
          <li>
            &bull; Include specific numbers and achievements (e.g., &quot;increased
            sales by 40%&quot;)
          </li>
          <li>&bull; List technologies and tools you&apos;re proficient in</li>
          <li>&bull; Mention leadership experience and team sizes managed</li>
          <li>&bull; Include relevant certifications and education</li>
          <li>&bull; Don&apos;t worry about formatting - the AI will structure it</li>
        </ul>
      </div>
    </div>
  );
}
