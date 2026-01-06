# unplugged.cv

**Your career, unplugged.**

AI-powered CV builder that transforms unstructured professional input into polished CVs. Raw, authentic career representation without the BS.

## Philosophy

- Skill-centric, not title-centric
- Evidence over claims
- Outcomes over responsibilities
- Senior-friendly (non-linear careers, freelance, long experience)
- No embellishment, no ATS gaming, just truth

## Features

- **AI CV Generation** - Paste unstructured career info, get a polished CV
- **Job Analysis** - Parse job descriptions for requirements, red flags, seniority signals
- **Cover Letters** - Tailored letters based on your CV + job description
- **PDF Export** - Print-ready PDFs with professional styling
- **Public URLs** - Shareable CV links (e.g., `unplugged.cv/cv/yourname`)
- **Import Options** - Text paste, URL import, Google Docs

## Tech Stack

- Next.js 16 + React 19 (App Router)
- Tailwind CSS v4
- Neon (Postgres) + Neon Auth (Better Auth)
- Drizzle ORM
- Anthropic Claude API
- Stripe (payments)
- Netlify (hosting)

## Development

```bash
npm run dev          # Start Next.js dev server
netlify dev          # Or use Netlify CLI for functions
npm run build        # Build for production
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/              # Next.js app router
│   ├── api/          # API routes
│   ├── app/          # Authenticated app pages
│   └── cv/[slug]/    # Public CV pages
├── components/       # React components
└── lib/              # Utilities
    ├── auth/         # Neon Auth
    ├── db/           # Drizzle schema
    ├── prompts.ts    # Claude prompts
    └── stripe.ts     # Stripe config
```

## Documentation

- [ROADMAP.md](ROADMAP.md) - Product roadmap, personas, business model
- [CLAUDE.md](CLAUDE.md) - AI assistant configuration
- [docs/DEPLOY-CHECKLIST.md](docs/DEPLOY-CHECKLIST.md) - Deployment guide
