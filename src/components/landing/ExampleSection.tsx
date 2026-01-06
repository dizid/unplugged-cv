export function ExampleSection() {
  return (
    <section id="example" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          From messy notes to polished CV in minutes
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Before */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
              YOUR INPUT
            </div>
            <pre className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-mono">
              {`10 years marketing, started at agencies
now head of growth at startup
launched 3 products, $1M+ ARR each
manage team of 8
good with SQL, some python
MBA 2015`}
            </pre>
          </div>

          {/* After */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-600 dark:text-blue-400 mb-3 font-medium">
              AI OUTPUT
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Marketing Leader | Growth & Product
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                Results-driven marketing leader with 10+ years experience
                driving growth for startups and agencies. Track record of
                launching products to $1M+ ARR. Data-informed approach combining
                strategic vision with hands-on analytics (SQL, Python).
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">
                  Experience
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  <strong>Head of Growth</strong> — Startup (Current)
                  <br />
                  Leading 8-person team, launched 3 products to $1M+ ARR...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
