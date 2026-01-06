# unplugged.cv Roadmap

## Vision

Extend from CV generation to **job application intelligence**—helping users apply to fewer jobs with higher success rates.

**Philosophy**: Quality over quantity. 10 perfect applications beat 1000 spam submissions.

---

## Market Context

| Competitor | Focus | Our Advantage |
|------------|-------|---------------|
| Teal | Job tracker + keyword matching | We match *evidence*, not keywords |
| Jobscan | ATS optimization scoring | We generate, not just analyze |
| Rezi | ATS-compliant templates | Quality content > keyword stuffing |
| LazyApply | Mass auto-apply | Curated applications, human review |

---

## Roadmap

### Phase 1: Job Description Parser ✅ DONE

**Goal**: Paste job description, see structured analysis + red flags

**Features**:
- ✅ Parse job requirements (must-have vs nice-to-have)
- ✅ Extract seniority signals
- ✅ Detect red flags ("rockstar", unrealistic requirements)
- ✅ Show salary range if mentioned
- ✅ Cover letter generation based on job + CV

**Files**:
- `src/lib/prompts-job.ts` - Prompt for job parsing
- `src/app/api/parse-job/route.ts` - API endpoint
- `src/components/JobAnalysis.tsx` - Display component
- `src/app/page.tsx` - Job analysis integration

---

### Phase 2: Company Intel Scraper

**Goal**: Scrape company website for context

**Features**:
- Company size, industry, funding stage
- Tech stack detection
- Culture signals (remote-friendly, work-life balance)
- Recent news (layoffs, growth, acquisitions)

**Files**:
- `src/app/api/scrape-company/route.ts` - Company scraping endpoint
- `src/lib/db/schema.ts` - Add `companies` table for caching

---

### Phase 3: Professional Graph Extraction

**Goal**: Extract structured data from generated CV

Currently defined in CLAUDE.md but NOT implemented:
```typescript
interface ProfessionalGraph {
  profile: { roleLevel, primaryIdentity, yearsExperience }
  skills: [{ name, category, confidence, evidence, seniorityDepth }]
  experience: [{ context, title, organization, timeframe, contributions }]
  signals: { autonomy, leadership, complexity, clientFacing }
}
```

**Files**:
- `src/lib/prompts.ts` - Add graph extraction prompt
- `src/lib/db/schema.ts` - Add `professional_graph` column to `cvGenerations`

---

### Phase 4: Match Score Engine

**Goal**: Compare CV evidence to job requirements

**Features**:
- Overall match % (0-100)
- Breakdown by category (skills, experience, education)
- Gaps: "Missing: Kubernetes (they want 3+ years)"
- Strengths: "Strong match: Python (5 years, multiple projects)"
- Suggestions: "Consider highlighting your Docker experience"

**Files**:
- `src/app/api/match-score/route.ts` - Match calculation endpoint
- `src/components/MatchScore.tsx` - Match display component

---

### Phase 5: UI Integration

Enhanced CV flow:
```
Current:  [Paste career] -> [Generate CV] -> [Download]
New:      [Paste career] -> [Generate CV] -> [Add Job] -> [See Match] -> [Tailor CV]
```

---

## Future Ideas (Backlog)

### Application Materials
- Cover letter generator (tailored to job + company)
- Follow-up email templates
- Thank you note generator

### Application Tracking
- Save jobs with metadata
- Kanban board (Saved -> Applied -> Screening -> Interview -> Offer)
- Timeline with reminders
- Analytics (response rate, time-to-response)

### Smart Automation
- Browser extension (one-click save from LinkedIn/Indeed)
- "Quality Apply" mode (curated applications with human review)
- Email integration (auto-detect responses, update status)

### Advanced Intelligence
- Job board aggregation with match filtering
- Interview prep generator
- Salary negotiation assistant
- Networking suggestions

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

---

## Competitive Positioning

**Against Teal/Jobscan**: "We don't just count keywords—we match your *actual evidence* to job requirements"

**Against LazyApply**: "Quality over quantity: 10 thoughtful applications beat 1000 spam submissions"

**Against Generic AI**: "Built specifically for senior professionals and non-linear careers"

---

## Sources

- [Index.dev - AI Tools for Job Seekers](https://www.index.dev/blog/ai-tools-for-job-seekers)
- [Teal - Best AI Resume Builders](https://www.tealhq.com/post/best-ai-resume-builders)
- [Jobscan - State of Job Search 2025](https://www.jobscan.co/state-of-the-job-search)
- [LiveCareer - Job Search Frustration](https://www.livecareer.com/resources/job-search-frustration)
