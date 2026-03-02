"use client";

import { useState } from "react";
import { type PipelinePhase } from "@/lib/guides";
import { GuidesList } from "./GuidesList";

// Maps application status strings to typed PipelinePhase values.
// Handles unknown statuses gracefully by defaulting to "draft".
const VALID_PHASES: PipelinePhase[] = [
  "draft",
  "saved",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
];

function toPhase(status: string): PipelinePhase {
  return VALID_PHASES.includes(status as PipelinePhase)
    ? (status as PipelinePhase)
    : "draft";
}

// Phase display config — matches StatusSelector colour palette
const phaseConfig: Record<
  PipelinePhase,
  { label: string; dotColor: string }
> = {
  draft: { label: "Draft", dotColor: "bg-gray-400" },
  saved: { label: "Saved", dotColor: "bg-blue-500" },
  applied: { label: "Applied", dotColor: "bg-yellow-500" },
  screening: { label: "Screening", dotColor: "bg-purple-500" },
  interview: { label: "Interview", dotColor: "bg-green-500" },
  offer: { label: "Offer", dotColor: "bg-emerald-500" },
  rejected: { label: "Rejected", dotColor: "bg-red-500" },
};

interface GuidesTabProps {
  currentStatus: string;
}

export function GuidesTab({ currentStatus }: GuidesTabProps) {
  const currentPhase = toPhase(currentStatus);
  const config = phaseConfig[currentPhase];
  // Count is populated via callback from GuidesList once it fetches from the API
  const [guideCount, setGuideCount] = useState<number | null>(null);

  return (
    <div>
      {/* Contextual header */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${config.dotColor}`}
          aria-hidden="true"
        />
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {config.label} Stage
          </h3>
          {guideCount !== null && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {guideCount} guide{guideCount !== 1 ? "s" : ""} for this stage
            </p>
          )}
        </div>
      </div>

      <GuidesList currentPhase={currentPhase} onCountChange={setGuideCount} />
    </div>
  );
}
