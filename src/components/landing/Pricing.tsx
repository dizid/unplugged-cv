import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Get started with the basics",
    features: [
      { text: "5 applications", included: true },
      { text: "CV generation", included: true },
      { text: "Job analysis", included: true },
      { text: "Status tracking", included: true },
      { text: "Pipeline view", included: false },
      { text: "PDF export", included: false },
      { text: "Cover letters", included: false },
    ],
    cta: "Start Free",
    href: "/new",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Unlimited everything",
    features: [
      { text: "Unlimited applications", included: true },
      { text: "CV generation", included: true },
      { text: "Job analysis", included: true },
      { text: "Status tracking", included: true },
      { text: "Pipeline view", included: true },
      { text: "PDF export", included: true },
      { text: "Cover letters", included: true },
      { text: "Interview tracking", included: true },
      { text: "Reminders & follow-ups", included: true },
    ],
    cta: "Start Pro",
    href: "/new",
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Plans for every stage of your job search
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Start free, upgrade when you need more
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-6 rounded-xl border ${
                tier.highlighted
                  ? "bg-blue-600 text-white border-blue-600 shadow-xl scale-105"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
              <p
                className={`text-sm mb-4 ${
                  tier.highlighted
                    ? "text-blue-100"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {tier.description}
              </p>
              <p className="mb-6">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.period && (
                  <span
                    className={`text-sm ${
                      tier.highlighted
                        ? "text-blue-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {tier.period}
                  </span>
                )}
              </p>

              <ul className="space-y-2 mb-6">
                {tier.features.map((feature) => (
                  <li
                    key={feature.text}
                    className={`flex items-center gap-2 text-sm ${
                      !feature.included && !tier.highlighted
                        ? "text-gray-400 dark:text-gray-500"
                        : tier.highlighted
                          ? "text-white/90"
                          : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span
                      className={
                        feature.included
                          ? tier.highlighted
                            ? "text-white"
                            : "text-green-500"
                          : "text-gray-300 dark:text-gray-600"
                      }
                    >
                      {feature.included ? "✓" : "✗"}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`block text-center py-3 rounded-lg font-medium transition-colors ${
                  tier.highlighted
                    ? "bg-white text-blue-600 hover:bg-gray-100"
                    : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Cancel anytime. No long-term commitment.
        </p>
      </div>
    </section>
  );
}
