import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - unplugged.cv",
  description: "Privacy Policy for unplugged.cv",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 text-sm mb-8 inline-block"
        >
          ← Back to home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: January 2025
          </p>

          <h2>1. Information We Collect</h2>
          <p>We collect:</p>
          <ul>
            <li>
              <strong>Account info:</strong> Email address when you sign up
              (via Google OAuth)
            </li>
            <li>
              <strong>Career data:</strong> Professional information you paste
              to generate CVs
            </li>
            <li>
              <strong>Generated CVs:</strong> CVs we create for you (if logged
              in)
            </li>
            <li>
              <strong>Payment info:</strong> Processed securely by Stripe (we
              don&apos;t store card details)
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your data to:</p>
          <ul>
            <li>Generate and store your CVs</li>
            <li>Process payments</li>
            <li>Improve our AI and service</li>
            <li>Send service-related communications</li>
          </ul>

          <h2>3. Data Storage</h2>
          <p>
            Your data is stored securely on Neon (PostgreSQL database) with
            encryption. We use industry-standard security practices.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>We use:</p>
          <ul>
            <li>
              <strong>Anthropic (Claude):</strong> AI processing for CV
              generation
            </li>
            <li>
              <strong>Neon:</strong> Database and authentication
            </li>
            <li>
              <strong>Stripe:</strong> Payment processing
            </li>
            <li>
              <strong>Google:</strong> OAuth sign-in and Docs import
            </li>
            <li>
              <strong>Netlify:</strong> Hosting
            </li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We keep your data while your account is active. You can request
            deletion at any time by contacting us.
          </p>

          <h2>6. Your Rights</h2>
          <p>You can:</p>
          <ul>
            <li>Access your data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your CVs</li>
          </ul>

          <h2>7. Cookies</h2>
          <p>
            We use essential cookies for authentication. No tracking or
            advertising cookies.
          </p>

          <h2>8. Children</h2>
          <p>
            Our service is not intended for users under 16. We don&apos;t
            knowingly collect data from children.
          </p>

          <h2>9. Changes</h2>
          <p>
            We may update this policy. We&apos;ll notify you of significant
            changes via email or on the site.
          </p>

          <h2>10. Contact</h2>
          <p>
            Privacy questions? Email{" "}
            <a href="mailto:hello@unplugged.cv">hello@unplugged.cv</a>
          </p>
        </div>
      </div>
    </main>
  );
}
