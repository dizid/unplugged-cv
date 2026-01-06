import Link from "next/link";

export function Pricing() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Simple pricing</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Free */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-xl mb-2">Free</h3>
            <p className="text-3xl font-bold mb-4">$0</p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-green-500">&#10003;</span> 3 applications
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">&#10003;</span> CV generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">&#10003;</span> Job analysis
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span>&#10007;</span> PDF export
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <span>&#10007;</span> Cover letters
              </li>
            </ul>
            <Link
              href="/new"
              className="block text-center py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg">
            <h3 className="font-bold text-xl mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-4">
              $19{" "}
              <span className="text-sm font-normal opacity-80">one-time</span>
            </p>
            <ul className="space-y-2 text-sm opacity-90 mb-6">
              <li className="flex items-center gap-2">
                <span>&#10003;</span> Unlimited applications
              </li>
              <li className="flex items-center gap-2">
                <span>&#10003;</span> CV generation
              </li>
              <li className="flex items-center gap-2">
                <span>&#10003;</span> Job analysis
              </li>
              <li className="flex items-center gap-2">
                <span>&#10003;</span> PDF export
              </li>
              <li className="flex items-center gap-2">
                <span>&#10003;</span> Cover letters
              </li>
              <li className="flex items-center gap-2">
                <span>&#10003;</span> Match scores
              </li>
              <li className="flex items-center gap-2">
                <span>&#10003;</span> Publish online
              </li>
            </ul>
            <Link
              href="/new"
              className="block text-center py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Get Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
