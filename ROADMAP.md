# unplugged.cv Roadmap

## Vision

Extend from CV generation to **job application intelligence**—helping users apply to fewer jobs with higher success rates.

**Philosophy**: Quality over quantity. 10 perfect applications beat 1000 spam submissions.

---

## Target User

### Primary: "The Seasoned Professional"

- **Who**: 35-55 years old, 10-25 years experience, Senior IC to Director level
- **Income**: $100K-$250K
- **Mindset**: Values authenticity over BS, frustrated with keyword games
- **Challenge**: Complex career story (pivots, freelance, gaps) that templates can't capture

**Pain Points**:
- Traditional resumes don't capture their depth
- ATS-optimized resumes feel fake
- Career pivots are hard to explain
- Most tools optimize for entry-level keyword stuffing

**Jobs to Be Done**:
1. Transform messy career history into compelling narrative
2. Highlight evidence and outcomes, not just titles
3. Tailor story for specific opportunities without lying

### Secondary Personas

| Persona | Description |
|---------|-------------|
| Career Pivoter | Changing industries, needs to reframe skills |
| Freelancer | Multiple clients, no linear progression |
| Re-enterer | Returning after break, needs gap-friendly positioning |

### Anti-Personas (NOT Our Users)

- Entry-level mass appliers (need ATS keyword stuffing)
- "Growth hackers" (want to spray-and-pray 1000 applications)
- Resume embellishers (want to inflate credentials)

---

## Business Model

### Pricing

```
Free:           Unlimited CV generations, markdown copy
Pro ($19/mo):   PDF, publishing, job intel, match scores, cover letters
Lifetime ($99): Pro features forever (early adopter offer)
```

**Rationale**: PLG model—let users experience quality, convert on advanced features.

### Competitive Positioning

| vs. Competitor | Their Approach | Our Advantage |
|----------------|----------------|---------------|
| Teal/Jobscan | Keyword matching | Evidence matching |
| LazyApply | 1000 spam apps | 10 perfect apps |
| ChatGPT | Generic, hallucinates | Domain-specific, evidence-based |
| Rezi | ATS-compliant templates | Quality content > keyword stuffing |

---

## Roadmap

### Phase 1: Job Description Parser ✅ DONE

**Goal**: Paste job description, see structured analysis + red flags

- ✅ Parse job requirements (must-have vs nice-to-have)
- ✅ Extract seniority signals
- ✅ Detect red flags ("rockstar", unrealistic requirements)
- ✅ Show salary range if mentioned
- ✅ Cover letter generation based on job + CV

### Phase 2: Company Intel Scraper

**Goal**: Scrape company website for context

- Company size, industry, funding stage
- Tech stack detection
- Culture signals (remote-friendly, work-life balance)
- Recent news (layoffs, growth, acquisitions)

### Phase 3: Professional Graph Extraction

**Goal**: Extract structured data from generated CV

```typescript
interface ProfessionalGraph {
  profile: { roleLevel, primaryIdentity, yearsExperience }
  skills: [{ name, category, confidence, evidence, seniorityDepth }]
  experience: [{ context, title, organization, timeframe, contributions }]
  signals: { autonomy, leadership, complexity, clientFacing }
}
```

### Phase 4: Match Score Engine

**Goal**: Compare CV evidence to job requirements

- Overall match % (0-100)
- Breakdown by category (skills, experience, education)
- Gaps: "Missing: Kubernetes (they want 3+ years)"
- Strengths: "Strong match: Python (5 years, multiple projects)"
- Suggestions: "Consider highlighting your Docker experience"

### Phase 5: UI Integration

```
Current:  [Paste career] -> [Generate CV] -> [Download]
New:      [Paste career] -> [Generate CV] -> [Add Job] -> [See Match] -> [Tailor CV]
```

---

## Future Ideas (Backlog)

### Application Materials
- Follow-up email templates
- Thank you note generator
- Interview prep generator

### Application Tracking
- Kanban board (Saved -> Applied -> Screening -> Interview -> Offer)
- Timeline with reminders
- Analytics (response rate, time-to-response)

### Smart Automation
- Browser extension (one-click save from LinkedIn/Indeed)
- Email integration (auto-detect responses, update status)

### Advanced Intelligence
- Job board aggregation with match filtering
- Salary negotiation assistant
- Networking suggestions

---

## Growth Strategy

### Channel Priority

1. **Product-Led Growth** - Free tier with real value, viral public CV URLs
2. **Content Marketing** - SEO for "senior resume builder", "career pivot resume"
3. **LinkedIn Organic** - Hot takes on resume BS and ATS gaming
4. **Referral Program** - Give $10, Get $10
5. **Partnerships** - Career coaches, bootcamps, outplacement

### Target Keywords

- "AI CV generator" (high intent)
- "senior resume builder" (niche, less competition)
- "career pivot resume" (underserved)
- "outcome-based resume" (differentiated)

---

## Database Schema (Planned)

```sql
-- Company intel cache
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT UNIQUE,
  intel JSONB,
  scraped_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Parsed job listings
CREATE TABLE parsed_jobs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id),
  raw_text TEXT,
  parsed JSONB,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add to existing cvGenerations table
ALTER TABLE cv_generations ADD COLUMN professional_graph JSONB;
```
