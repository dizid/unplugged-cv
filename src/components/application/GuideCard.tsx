"use client";

import ReactMarkdown from "react-markdown";
import type { Guide } from "@/lib/guides";

interface GuideCardProps {
  guide: Guide;
  isExpanded: boolean;
  onToggle: () => void;
}

export function GuideCard({ guide, isExpanded, onToggle }: GuideCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Toggle button — full-width tap target */}
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-4 flex items-start justify-between gap-3 min-h-[44px] hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex-1 min-w-0">
          {/* Category label */}
          <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
            {guide.category}
          </span>

          {/* Title */}
          <span className="block text-sm font-semibold text-gray-900 dark:text-white leading-snug">
            {guide.title}
          </span>

          {/* Summary — visible only when collapsed */}
          {!isExpanded && (
            <span className="block mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
              {guide.summary}
            </span>
          )}
        </div>

        {/* Chevron icon — rotates when expanded */}
        <svg
          className={`flex-shrink-0 w-4 h-4 mt-0.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expanded content — CSS grid transition for smooth animation */}
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1 prose prose-sm dark:prose-invert max-w-none
            prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-headings:font-semibold
            prose-h2:text-sm prose-h2:mt-4 prose-h2:mb-2
            prose-h3:text-xs prose-h3:mt-3 prose-h3:mb-1
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:text-sm
            prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:text-sm
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-a:text-blue-600 dark:prose-a:text-blue-400
            prose-table:text-sm
            prose-th:text-gray-900 dark:prose-th:text-white
            prose-td:text-gray-700 dark:prose-td:text-gray-300
            prose-code:text-xs prose-code:bg-gray-100 dark:prose-code:bg-gray-800
            prose-code:rounded prose-code:px-1 prose-code:py-0.5
          ">
            <ReactMarkdown>{guide.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
