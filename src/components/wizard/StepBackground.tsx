"use client";

import { ImportButtons } from "@/components/ImportButtons";

interface StepBackgroundProps {
  background: string;
  setBackground: (value: string) => void;
  onBack: () => void;
  onGenerate: () => void;
  onGoogleDocsClick: () => void;
  onUrlClick: () => void;
}

export function StepBackground({
  background,
  setBackground,
  onBack,
  onGenerate,
  onGoogleDocsClick,
  onUrlClick,
}: StepBackgroundProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Your background
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Paste anything - old CV, LinkedIn, career notes. AI will figure it
          out.
        </p>
      </div>

      <textarea
        value={background}
        onChange={(e) => setBackground(e.target.value)}
        placeholder={`Example:
- 10 years in marketing, started at agencies
- Now head of growth at a startup
- Launched 3 products to $1M+ ARR
- Manage team of 8
- Good with SQL, some Python
- MBA from State University, 2015`}
        className="w-full h-64 p-4 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
      />

      <ImportButtons
        onGoogleDocsClick={onGoogleDocsClick}
        onUrlClick={onUrlClick}
      />

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
        >
          Back
        </button>
        <button
          onClick={onGenerate}
          disabled={!background.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          Generate Application
        </button>
      </div>
    </div>
  );
}
