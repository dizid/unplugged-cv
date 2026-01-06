"use client";

const steps = ["Job", "Background", "Generate", "Export"];

interface ProgressBarProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  completedSteps?: number[];
}

export function ProgressBar({
  currentStep,
  onStepClick,
  completedSteps = [],
}: ProgressBarProps) {
  return (
    <div className="flex items-center justify-between max-w-xl mx-auto">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isComplete = stepNum < currentStep || completedSteps.includes(stepNum);
        const isClickable = true; // All steps are navigable

        return (
          <div key={label} className="flex items-center">
            <button
              type="button"
              onClick={() => isClickable && onStepClick?.(stepNum)}
              disabled={!isClickable}
              className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
              ${isComplete ? "bg-blue-600 text-white" : ""}
              ${isActive ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900" : ""}
              ${!isComplete && !isActive ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400" : ""}
              ${isClickable ? "cursor-pointer hover:scale-110 hover:shadow-md" : "cursor-default"}
            `}
            >
              {isComplete && !isActive ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                stepNum
              )}
            </button>
            <button
              type="button"
              onClick={() => isClickable && onStepClick?.(stepNum)}
              disabled={!isClickable}
              className={`ml-2 text-sm hidden sm:inline ${
                isActive
                  ? "font-medium text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              } ${isClickable ? "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" : "cursor-default"}`}
            >
              {label}
            </button>
            {i < steps.length - 1 && (
              <div
                className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                  isComplete
                    ? "bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
