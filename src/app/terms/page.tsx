import Link from "next/link";

export const metadata = {
  title: "Terms of Service - unplugged.cv",
  description: "Terms of Service for unplugged.cv",
};

export default function TermsPage() {
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
          Terms of Service
        </h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: January 2025
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By using unplugged.cv, you agree to these terms. If you disagree,
            please don&apos;t use our service.
          </p>

          <h2>2. Service Description</h2>
          <p>
            unplugged.cv is an AI-powered CV builder that transforms your
            professional information into polished CVs. We use AI to generate
            content based on what you provide.
          </p>

          <h2>3. Your Content</h2>
          <p>
            You own your content. By using our service, you grant us permission
            to process your information to generate CVs. We don&apos;t claim
            ownership of your career data or generated CVs.
          </p>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Provide false or misleading professional information</li>
            <li>Use the service for any illegal purpose</li>
            <li>Attempt to reverse-engineer or abuse the service</li>
            <li>Resell or redistribute generated content commercially</li>
          </ul>

          <h2>5. Payments</h2>
          <p>
            Some features require payment. All payments are processed securely
            through Stripe. Refunds are handled on a case-by-case basis.
          </p>

          <h2>6. AI-Generated Content</h2>
          <p>
            Our AI generates CVs based on your input. While we strive for
            accuracy, you are responsible for reviewing and verifying all
            generated content before use. We don&apos;t guarantee employment
            outcomes.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            unplugged.cv is provided &quot;as is&quot; without warranties. We
            are not liable for any damages arising from your use of the service.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            We may update these terms. Continued use after changes constitutes
            acceptance.
          </p>

          <h2>9. Contact</h2>
          <p>
            Questions? Email us at{" "}
            <a href="mailto:hello@unplugged.cv">hello@unplugged.cv</a>
          </p>
        </div>
      </div>
    </main>
  );
}
