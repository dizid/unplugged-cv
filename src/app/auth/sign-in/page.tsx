"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthView } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";

export default function SignInPage() {
  const router = useRouter();
  const session = authClient.useSession();

  // Redirect to home if already logged in
  useEffect(() => {
    if (session.data?.user) {
      router.push("/");
    }
  }, [session.data?.user, router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            unplugged<span className="text-blue-600">.cv</span>
          </span>
        </Link>

        {/* Auth Form */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
          <AuthView view="SIGN_IN" />
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
