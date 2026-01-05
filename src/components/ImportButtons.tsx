"use client";

interface ImportButtonsProps {
  onGoogleDocsClick: () => void;
  onUrlClick: () => void;
  disabled?: boolean;
}

export function ImportButtons({
  onGoogleDocsClick,
  onUrlClick,
  disabled = false,
}: ImportButtonsProps) {
  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Or import from:
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onGoogleDocsClick}
          disabled={disabled}
          className="flex-1 py-2.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6zM7.364 19.273H5.455v-1.818h1.909v1.818zm0-3.636H5.455v-1.818h1.909v1.818zm0-3.637H5.455V10.182h1.909V12zm9.181 7.273h-7.272v-1.818h7.272v1.818zm0-3.636h-7.272v-1.818h7.272v1.818zm0-3.637h-7.272V10.182h7.272V12zm-2.181-5.273V0l6.363 6.727h-6.363z" />
          </svg>
          Google Docs
        </button>
        <button
          type="button"
          onClick={onUrlClick}
          disabled={disabled}
          className="flex-1 py-2.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          Import URL
        </button>
      </div>
    </div>
  );
}
