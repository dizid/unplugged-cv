"use client";

import { useState, useEffect, useRef } from "react";
import { getCategories, type Guide, type PipelinePhase } from "@/lib/guides";
import { GuideCard } from "./GuideCard";

// Human-readable names and color indicators for each phase
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

// All phases in pipeline order
const allPhases: PipelinePhase[] = [
  "draft",
  "saved",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
];

interface GuidesListProps {
  currentPhase: PipelinePhase;
  onCountChange?: (count: number) => void;
}

export function GuidesList({ currentPhase, onCountChange }: GuidesListProps) {
  const [activeFilter, setActiveFilter] = useState<"current" | "all">(
    "current"
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Separate cache for phase-filtered guides and all guides
  const phaseCache = useRef<Partial<Record<PipelinePhase, Guide[]>>>({});
  const allCache = useRef<Guide[] | null>(null);

  const [phaseGuides, setPhaseGuides] = useState<Guide[] | null>(null);
  const [allGuides, setAllGuides] = useState<Guide[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Fetch guides for the current phase
  useEffect(() => {
    if (activeFilter !== "current") return;

    const cached = phaseCache.current[currentPhase];
    if (cached) {
      setPhaseGuides(cached);
      onCountChange?.(cached.length);
      return;
    }

    setLoading(true);
    fetch(`/api/guides?phase=${currentPhase}`)
      .then((res) => res.json())
      .then((data: Guide[]) => {
        phaseCache.current[currentPhase] = data;
        setPhaseGuides(data);
        onCountChange?.(data.length);
      })
      .finally(() => setLoading(false));
  }, [currentPhase, activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch all guides when switching to "all" view
  useEffect(() => {
    if (activeFilter !== "all") return;

    if (allCache.current) {
      setAllGuides(allCache.current);
      return;
    }

    setLoading(true);
    fetch("/api/guides")
      .then((res) => res.json())
      .then((data: Guide[]) => {
        allCache.current = data;
        setAllGuides(data);
      })
      .finally(() => setLoading(false));
  }, [activeFilter]);

  // ── Loading spinner ─────────────────────────────────────────────────────────
  const renderLoading = () => (
    <div className="flex justify-center py-8">
      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // ── "For this stage" view ──────────────────────────────────────────────────
  const renderCurrentPhase = () => {
    if (loading || !phaseGuides) return renderLoading();

    if (phaseGuides.length === 0) {
      return (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
          No guides available for this stage.
        </p>
      );
    }

    const categories = getCategories(phaseGuides);

    return (
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryGuides = phaseGuides.filter(
            (g) => g.category === category
          );
          return (
            <CategorySection
              key={category}
              category={category}
              guides={categoryGuides}
              expandedId={expandedId}
              onToggle={handleToggle}
            />
          );
        })}
      </div>
    );
  };

  // ── "All guides" view ──────────────────────────────────────────────────────
  const renderAllPhases = () => {
    if (loading || !allGuides) return renderLoading();

    return (
      <div className="space-y-6">
        {allPhases.map((phase) => {
          const guides = allGuides.filter((g) => g.phases.includes(phase));
          if (guides.length === 0) return null;

          const config = phaseConfig[phase];
          const categories = getCategories(guides);

          return (
            <div key={phase}>
              {/* Phase header with color dot */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${config.dotColor}`}
                />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {config.label}
                </h3>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ({guides.length})
                </span>
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-gray-100 dark:border-gray-800">
                {categories.map((category) => {
                  const categoryGuides = guides.filter(
                    (g) => g.category === category
                  );
                  return (
                    <CategorySection
                      key={`${phase}-${category}`}
                      category={category}
                      guides={categoryGuides}
                      expandedId={expandedId}
                      onToggle={handleToggle}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {/* Filter toggle pills */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveFilter("current")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeFilter === "current"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          For this stage
        </button>
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All guides
        </button>
      </div>

      {activeFilter === "current" ? renderCurrentPhase() : renderAllPhases()}
    </div>
  );
}

// ── Internal sub-component: renders a labeled group of GuideCards ────────────
interface CategorySectionProps {
  category: string;
  guides: Guide[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}

function CategorySection({
  category,
  guides,
  expandedId,
  onToggle,
}: CategorySectionProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
        {category}
      </p>
      <div className="space-y-2">
        {guides.map((guide) => (
          <GuideCard
            key={guide.id}
            guide={guide}
            isExpanded={expandedId === guide.id}
            onToggle={() => onToggle(guide.id)}
          />
        ))}
      </div>
    </div>
  );
}
