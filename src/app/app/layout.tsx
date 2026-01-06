import { redirect } from "next/navigation";
import { authServer } from "@/lib/auth/server";
import Link from "next/link";
import { AuthButton } from "@/components/AuthButton";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await authServer.getSession();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
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
            <nav className="flex gap-4 text-sm">
              <Link
                href="/app"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Applications
              </Link>
              <Link
                href="/app/profile"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/app/account"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Account
              </Link>
            </nav>
          </div>
          <AuthButton />
        </div>
      </header>
      {children}
    </div>
  );
}
