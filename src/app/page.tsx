import { redirect } from "next/navigation";
import Link from "next/link";
import { Hero, ExampleSection, HowItWorks, Features, Pricing } from "@/components/landing";
import { AuthButton } from "@/components/AuthButton";
import { authServer } from "@/lib/auth/server";

export default async function LandingPage() {
  const { data: session } = await authServer.getSession();

  if (session?.user) {
    redirect("/app");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                <path
                  d="M7 5 L7 21 Q7 27 13 27 L14 27"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M25 5 L25 21 Q25 27 19 27 L18 27"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              unplugged<span className="text-blue-600">.cv</span>
            </span>
          </Link>
          <AuthButton />
        </div>
      </header>

      <Hero />
      <ExampleSection />
      <HowItWorks />
      <Features />
      <Pricing />

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your career, unplugged. Professional CVs in minutes.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link
                href="/contact"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/terms"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <a
                href="https://dizid.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Built by dizid.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
