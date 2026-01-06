"use client";

import Link from "next/link";

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      {/* Gradient glow behind */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-3xl rounded-full scale-150" />

      <svg
        viewBox="0 0 400 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-full h-auto"
      >
        <defs>
          {/* Brand gradient */}
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>

          {/* Subtle gradient for secondary elements */}
          <linearGradient id="subtleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>

          {/* Sparkle gradient */}
          <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="#4f46e5" />
          </marker>
        </defs>

        {/* Messy notes (left/back) */}
        <g className="animate-[float-slow_5s_ease-in-out_infinite_0.5s]">
          {/* Paper background */}
          <rect
            x="40"
            y="60"
            width="140"
            height="180"
            rx="8"
            className="fill-white dark:fill-gray-800 stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="2"
            transform="rotate(-6 110 150)"
          />
          {/* Messy scribble lines */}
          <g transform="rotate(-6 110 150)" opacity="0.5">
            <path d="M60 90 Q80 85 100 92 T140 88" stroke="#9ca3af" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M60 110 Q90 105 110 112 T155 108" stroke="#9ca3af" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M60 130 Q75 135 95 128" stroke="#9ca3af" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M60 150 Q85 145 120 152 T160 148" stroke="#9ca3af" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M60 170 Q70 175 90 168" stroke="#9ca3af" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M60 190 Q95 185 130 192" stroke="#9ca3af" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M60 210 Q80 205 100 212" stroke="#9ca3af" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </g>

        {/* Polished CV (right/front) */}
        <g className="animate-[float_4s_ease-in-out_infinite]">
          {/* Paper shadow */}
          <rect
            x="189"
            y="49"
            width="170"
            height="220"
            rx="10"
            fill="#1e3a5f"
            opacity="0.1"
          />
          {/* Paper background */}
          <rect
            x="185"
            y="45"
            width="170"
            height="220"
            rx="10"
            className="fill-white dark:fill-gray-800"
            stroke="url(#brandGradient)"
            strokeWidth="2"
          />

          {/* CV Header section */}
          <rect x="200" y="60" width="80" height="10" rx="2" fill="url(#brandGradient)" />
          <rect x="200" y="76" width="120" height="6" rx="1" className="fill-gray-300 dark:fill-gray-600" />

          {/* Profile section */}
          <rect x="200" y="100" width="40" height="6" rx="1" fill="url(#subtleGradient)" />
          <rect x="200" y="112" width="140" height="4" rx="1" className="fill-gray-200 dark:fill-gray-700" />
          <rect x="200" y="120" width="130" height="4" rx="1" className="fill-gray-200 dark:fill-gray-700" />
          <rect x="200" y="128" width="100" height="4" rx="1" className="fill-gray-200 dark:fill-gray-700" />

          {/* Experience section */}
          <rect x="200" y="148" width="55" height="6" rx="1" fill="url(#subtleGradient)" />
          <rect x="200" y="160" width="140" height="4" rx="1" className="fill-gray-200 dark:fill-gray-700" />
          <rect x="200" y="168" width="135" height="4" rx="1" className="fill-gray-200 dark:fill-gray-700" />
          <rect x="200" y="176" width="120" height="4" rx="1" className="fill-gray-200 dark:fill-gray-700" />
          <rect x="200" y="184" width="130" height="4" rx="1" className="fill-gray-200 dark:fill-gray-700" />

          {/* Skills section */}
          <rect x="200" y="204" width="30" height="6" rx="1" fill="url(#subtleGradient)" />
          <g>
            <rect x="200" y="216" width="45" height="16" rx="8" className="fill-blue-100 dark:fill-blue-900/50" />
            <rect x="250" y="216" width="55" height="16" rx="8" className="fill-blue-100 dark:fill-blue-900/50" />
            <rect x="310" y="216" width="35" height="16" rx="8" className="fill-blue-100 dark:fill-blue-900/50" />
            <rect x="200" y="236" width="40" height="16" rx="8" className="fill-blue-100 dark:fill-blue-900/50" />
            <rect x="245" y="236" width="50" height="16" rx="8" className="fill-blue-100 dark:fill-blue-900/50" />
          </g>
        </g>

        {/* Magic transformation arrow */}
        <g className="animate-pulse">
          <path
            d="M165 160 Q185 140 195 160"
            stroke="url(#brandGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            markerEnd="url(#arrowhead)"
          />
        </g>

        {/* Sparkles */}
        <g>
          {/* Large sparkle */}
          <g transform="translate(320, 35)" className="animate-[sparkle_2s_ease-in-out_infinite]">
            <path d="M0,-12 L2,-2 L12,0 L2,2 L0,12 L-2,2 L-12,0 L-2,-2 Z" fill="url(#sparkleGradient)" />
          </g>
          {/* Medium sparkle */}
          <g transform="translate(370, 100)" className="animate-[sparkle_2s_ease-in-out_infinite_0.5s]">
            <path d="M0,-8 L1.5,-1.5 L8,0 L1.5,1.5 L0,8 L-1.5,1.5 L-8,0 L-1.5,-1.5 Z" fill="url(#sparkleGradient)" opacity="0.8" />
          </g>
          {/* Small sparkle */}
          <g transform="translate(175, 80)" className="animate-[sparkle_2s_ease-in-out_infinite_1s]">
            <path d="M0,-6 L1,-1 L6,0 L1,1 L0,6 L-1,1 L-6,0 L-1,-1 Z" fill="url(#sparkleGradient)" opacity="0.6" />
          </g>
          {/* Extra small sparkle */}
          <g transform="translate(350, 220)" className="animate-[sparkle_2s_ease-in-out_infinite_0.3s]">
            <path d="M0,-5 L0.8,-0.8 L5,0 L0.8,0.8 L0,5 L-0.8,0.8 L-5,0 L-0.8,-0.8 Z" fill="url(#sparkleGradient)" opacity="0.7" />
          </g>
        </g>

        {/* AI-powered badge */}
        <g transform="translate(135, 275)">
          <rect x="0" y="0" width="115" height="30" rx="15" fill="url(#brandGradient)" opacity="0.1" />
          {/* Sparkle icon */}
          <g transform="translate(20, 15)">
            <path d="M0,-7 L1.2,-1.2 L7,0 L1.2,1.2 L0,7 L-1.2,1.2 L-7,0 L-1.2,-1.2 Z" fill="url(#sparkleGradient)" />
          </g>
          <text x="35" y="20" fontSize="11" className="fill-indigo-600 dark:fill-blue-400" fontWeight="500">AI-powered</text>
        </g>
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="py-16 lg:py-24 px-4">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Land more interviews with
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                tailored applications
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Paste a job posting, add your background, get a tailored CV and cover
              letter. Track all your applications in one place.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
              <Link
                href="/new"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
              >
                Start Free
              </Link>
              <a
                href="#example"
                className="px-8 py-4 border border-gray-300 dark:border-gray-600 rounded-xl font-medium text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                See Example
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              No credit card required. 3 free applications.
            </p>
          </div>

          {/* Illustration */}
          <div className="order-first lg:order-last">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
