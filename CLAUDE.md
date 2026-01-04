# unplugged.cv

"Your career, unplugged." — AI-powered CV builder that transforms unstructured professional input into polished CVs.

## Tech Stack

- Next.js 16 + React 19 (App Router)
- Tailwind CSS v4
- Supabase (Auth + Postgres)
- Drizzle ORM
- Anthropic Claude API
- Stripe (payments)
- Netlify (hosting)

## Development

```bash
npm run dev          # Start Next.js dev server on port 3000
netlify dev          # Or use Netlify CLI for functions
npm run build        # Build for production
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## Project Structure

```
src/
├── app/              # Next.js app router
│   ├── api/          # API routes (generate, checkout, webhook)
│   └── page.tsx      # Main CV builder page
├── components/       # React components
└── lib/              # Utilities
    ├── supabase/     # Supabase client/server utils
    ├── prompts.ts    # Claude prompts for CV generation
    ├── stripe.ts     # Stripe configuration
    └── pdf.ts        # PDF generation
```

## Code Style

- Variables/functions: camelCase
- Components: PascalCase
- Files: kebab-case
- Use TypeScript strict mode
- Prefer server components; use "use client" only when needed

## Preferences

- Act like a senior developer
- Write complete, working code — no mocks, stubs, or TODOs
- Use clear comments only when logic isn't self-evident
- Keep existing working code intact when adding features
- Prefer editing existing files over creating new ones

## Domain Rules

### CV Generation Philosophy

- Skill-centric, not title-centric
- Evidence over claims, outcomes over responsibilities
- Senior-friendly: support non-linear careers, freelance, long experience
- Never invent employers, clients, or outcomes
- Never embellish or optimize for ATS
- If unsure: include with low confidence, never discard

### Professional Graph Schema (output structure)

- `profile_summary`: Role level, primary identity, years of experience
- `skills[]`: Name, category, confidence (1-5), evidence, seniority depth
- `experience_blocks[]`: Context, title, organization, timeframe, contributions
- `signals`: Autonomy, leadership, complexity, client-facing levels
- `flags`: Career gaps, non-linear path, age bias risk, overclaim risk
