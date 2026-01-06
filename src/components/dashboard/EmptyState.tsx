import Link from "next/link";

export function EmptyState() {
  return (
    <div className="text-center py-16 px-4 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
      <div className="text-4xl mb-4">📝</div>
      <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
        No applications yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Start by pasting a job posting you&apos;re interested in
      </p>
      <Link
        href="/new"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Create Your First Application
      </Link>
    </div>
  );
}
