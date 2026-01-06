// Feature icons as inline SVGs for optimal performance
function DocumentSparkleIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <defs>
        <linearGradient id="docGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      {/* Document */}
      <path
        d="M12 6C12 4.89543 12.8954 4 14 4H28L36 12V42C36 43.1046 35.1046 44 34 44H14C12.8954 44 12 43.1046 12 42V6Z"
        fill="url(#docGradient)"
        opacity="0.15"
      />
      <path
        d="M12 6C12 4.89543 12.8954 4 14 4H28L36 12V42C36 43.1046 35.1046 44 34 44H14C12.8954 44 12 43.1046 12 42V6Z"
        stroke="url(#docGradient)"
        strokeWidth="2"
        fill="none"
      />
      <path d="M28 4V12H36" stroke="url(#docGradient)" strokeWidth="2" fill="none" />
      {/* Text lines */}
      <rect x="16" y="18" width="16" height="2" rx="1" fill="url(#docGradient)" />
      <rect x="16" y="24" width="12" height="2" rx="1" fill="url(#docGradient)" opacity="0.6" />
      <rect x="16" y="30" width="14" height="2" rx="1" fill="url(#docGradient)" opacity="0.6" />
      {/* Sparkle */}
      <g transform="translate(38, 8)">
        <path d="M0,-6 L1,-1 L6,0 L1,1 L0,6 L-1,1 L-6,0 L-1,-1 Z" fill="#fbbf24" />
      </g>
      <g transform="translate(42, 18)">
        <path d="M0,-4 L0.7,-0.7 L4,0 L0.7,0.7 L0,4 L-0.7,0.7 L-4,0 L-0.7,-0.7 Z" fill="#fbbf24" opacity="0.7" />
      </g>
    </svg>
  );
}

function MagnifyingGlassIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <defs>
        <linearGradient id="magGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      {/* Document behind */}
      <rect
        x="8"
        y="8"
        width="24"
        height="32"
        rx="2"
        fill="url(#magGradient)"
        opacity="0.1"
        stroke="url(#magGradient)"
        strokeWidth="1.5"
      />
      <rect x="12" y="14" width="14" height="2" rx="1" fill="url(#magGradient)" opacity="0.4" />
      <rect x="12" y="20" width="10" height="2" rx="1" fill="url(#magGradient)" opacity="0.4" />
      <rect x="12" y="26" width="12" height="2" rx="1" fill="url(#magGradient)" opacity="0.4" />
      {/* Magnifying glass */}
      <circle
        cx="30"
        cy="26"
        r="10"
        fill="white"
        className="dark:fill-gray-900"
        stroke="url(#magGradient)"
        strokeWidth="3"
      />
      <circle cx="30" cy="26" r="6" fill="url(#magGradient)" opacity="0.15" />
      {/* Handle */}
      <path
        d="M37 33L44 40"
        stroke="url(#magGradient)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Checkmark inside */}
      <path
        d="M26 26L29 29L35 23"
        stroke="url(#magGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EnvelopeCheckIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <defs>
        <linearGradient id="envGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      {/* Envelope body */}
      <rect
        x="4"
        y="10"
        width="40"
        height="28"
        rx="3"
        fill="url(#envGradient)"
        opacity="0.15"
      />
      <rect
        x="4"
        y="10"
        width="40"
        height="28"
        rx="3"
        stroke="url(#envGradient)"
        strokeWidth="2"
        fill="none"
      />
      {/* Envelope flap */}
      <path
        d="M4 13L24 26L44 13"
        stroke="url(#envGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Paper peeking out */}
      <rect x="10" y="18" width="16" height="2" rx="1" fill="url(#envGradient)" opacity="0.5" />
      <rect x="10" y="23" width="12" height="2" rx="1" fill="url(#envGradient)" opacity="0.3" />
      {/* Checkmark badge */}
      <circle cx="38" cy="32" r="8" fill="url(#envGradient)" />
      <path
        d="M34 32L37 35L42 29"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GaugeMeterIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="gaugeArc" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      {/* Gauge background arc */}
      <path
        d="M8 32 A16 16 0 0 1 40 32"
        stroke="#e5e7eb"
        className="dark:stroke-gray-700"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Gauge colored arc */}
      <path
        d="M8 32 A16 16 0 0 1 40 32"
        stroke="url(#gaugeArc)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="50 100"
      />
      {/* Center point */}
      <circle cx="24" cy="32" r="4" fill="url(#gaugeGradient)" />
      {/* Needle pointing to high */}
      <path
        d="M24 32L34 20"
        stroke="url(#gaugeGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Tick marks */}
      <circle cx="10" cy="28" r="2" fill="#ef4444" opacity="0.6" />
      <circle cx="24" cy="18" r="2" fill="#fbbf24" opacity="0.6" />
      <circle cx="38" cy="28" r="2" fill="#22c55e" opacity="0.6" />
      {/* Percentage label */}
      <text x="24" y="44" textAnchor="middle" fontSize="10" fontWeight="600" className="fill-gray-900 dark:fill-white">
        87%
      </text>
    </svg>
  );
}

const features = [
  {
    icon: DocumentSparkleIcon,
    title: "AI CV Generation",
    description:
      "Paste messy notes, LinkedIn exports, or old CVs. Our AI extracts the signal and creates a polished, professional document.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Job Analysis",
    description:
      "Paste any job posting. We parse requirements, detect red flags, extract what actually matters, and flag unrealistic expectations.",
  },
  {
    icon: EnvelopeCheckIcon,
    title: "Cover Letters",
    description:
      "Generate tailored cover letters that reference your actual experience and the specific job requirements. No generic templates.",
  },
  {
    icon: GaugeMeterIcon,
    title: "Match Scores",
    description:
      "See how well your background matches each role. Identify gaps, highlight strengths, and focus on jobs where you'll succeed.",
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              land the job
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stop wasting time on applications that go nowhere. Focus on roles where you&apos;re a genuine fit.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform">
                <feature.icon />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
