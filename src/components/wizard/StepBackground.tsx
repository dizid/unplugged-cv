"use client";

import { useState } from "react";
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
  const [showExample, setShowExample] = useState(false);

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
        <button
          type="button"
          onClick={() => setShowExample(!showExample)}
          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {showExample ? "Hide example" : "Not sure what to write? See example"}
        </button>
      </div>

      {showExample && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-sm text-gray-700 dark:text-gray-300 space-y-3">
          <p className="font-medium text-gray-900 dark:text-white">
            Include any of these — in any format:
          </p>
          <div>
            <span className="font-medium">Work History:</span> Senior Marketing Manager at TechCorp (2019-2024). Led demand gen team of 6. Managed $2M annual budget.
          </div>
          <div>
            <span className="font-medium">Key Skills:</span> Google Ads, HubSpot, SQL, team management, budget forecasting
          </div>
          <div>
            <span className="font-medium">Education:</span> MBA Marketing, University of Amsterdam, 2018
          </div>
          <div>
            <span className="font-medium">Achievements:</span> Grew MQL pipeline 3x in 18 months. Launched product that hit $1M ARR in first year.
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            Don&apos;t worry about formatting — the AI handles that.
          </p>
        </div>
      )}

      <textarea
        value={background}
        onChange={(e) => setBackground(e.target.value)}
        placeholder={`Work History:
- [Role] at [Company] ([Years]). [What you did]

Skills:
- [Skill 1], [Skill 2], [Skill 3]

Education:
- [Degree], [School], [Year]

Key Achievements:
- [Achievement with numbers/outcomes]`}
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
