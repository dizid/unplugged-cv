# unplugged.cv - Project Guide

"Your career, unplugged."

AI-powered CV builder that transforms unstructured professional input into a normalized Professional Graph. Single source of truth for generating CVs, LinkedIn profiles, bios, and offer pages. Raw, authentic career representation without the BS.

## Tech Stack
- Next.js 16 + React 19
- Tailwind CSS v4
- Neon (Postgres) + Drizzle ORM
- Anthropic Claude API
- Stripe (payments)
- NextAuth (authentication)

## Dev Setup
Run `npm run dev`
Access at http://localhost:3000

## Key Directories
- `src/app/` - Next.js app router pages
- `src/components/` - React components
- `src/lib/` - Utilities and services

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Code Style
- Variables/functions: camelCase
- Components: PascalCase
- Files: kebab-case
- Use `<script setup>` in Vue components

## Domain Rules

### Professional Graph Schema
Output JSON structure:
- `profile_summary`: Role level, primary identity, years of experience
- `skills[]`: Name, category, confidence (1-5), evidence, seniority depth
- `experience_blocks[]`: Context, title, organization, timeframe, contributions
- `signals`: Autonomy, leadership, complexity, client-facing levels
- `flags`: Career gaps, non-linear path, age bias risk, overclaim risk

### Extraction Philosophy
- Skill-centric, not title-centric
- Evidence over claims, outcomes over responsibilities
- Senior-friendly (non-linear careers, freelance, long experience)
- Never invent employers, clients, or outcomes
- Never embellish or optimize for ATS
- If unsure: include with low confidence, never discard

## Preferences
- Act like a senior developer
- Write complete, working code - no mocks, stubs, or TODOs
- Use clear comments in code
- Keep existing working code intact when adding features
- Modular, maintainable structure
