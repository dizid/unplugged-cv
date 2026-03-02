export type PipelinePhase =
  | "draft"
  | "saved"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected";

export interface Guide {
  id: string;
  title: string;
  phases: PipelinePhase[];
  category: string;
  summary: string;
  content: string; // markdown
}

export const guides: Guide[] = [
  // ─── DRAFT PHASE ───────────────────────────────────────────────────────────

  {
    id: "draft-company-research",
    title: "How to Research a Company Before Applying",
    phases: ["draft"],
    category: "Research",
    summary:
      "Go beyond the About page. Understand the business model, leadership priorities, and current challenges before you write a single word.",
    content: `## Why This Matters

Hiring managers can tell in 30 seconds whether you researched the company or copy-pasted your standard application. At senior levels, the bar is higher — you're expected to understand the business context, not just the job description.

## What to Investigate

### Business Fundamentals
- **Revenue model**: How does the company make money? SaaS, services, marketplace, hardware?
- **Growth stage**: Early-stage startup, scaling Series B, mature enterprise, or public company undergoing transformation?
- **Key metrics**: Look for any public data — ARR, headcount growth, recent funding, market cap changes.
- **Competitive position**: Who are the main competitors? Is this company gaining or losing ground?

### Leadership and Direction
- Read the CEO's recent LinkedIn posts and any public interviews. What are they focused on?
- Check the executive team for recent hires — new C-suite signals strategic pivots.
- Search for board members and investors. A16z-backed companies behave differently than bootstrapped ones.

### Culture Signals
- Glassdoor reviews: Look for patterns, not individual rants. If 30% of reviews mention "poor management," that's signal.
- LinkedIn employee tenure: Short average tenure (< 18 months) at senior levels is a red flag.
- Recent layoffs or reorgs: Check LinkedIn for "open to work" patterns among former employees.

### Current Priorities
- Earnings calls (public companies) and investor letters reveal where budget is flowing.
- Job posting volume in specific departments signals where the company is investing.
- Product launches, press releases, and technical blog posts show engineering priorities.

## How to Use This Research

Don't recite facts — apply them. In your application materials:
- Reference the business context your work would serve.
- Connect your past outcomes to their current growth stage.
- Ask informed questions that demonstrate you've done the work.

## Tools
- Crunchbase, PitchBook (funding, investors)
- LinkedIn Company Page (headcount trends, recent hires)
- Glassdoor (culture, compensation benchmarks)
- SEC EDGAR (public companies — 10-K for strategy, 10-Q for quarterly changes)
- Google News, TechCrunch, The Information (recent coverage)
`,
  },

  {
    id: "draft-job-description-analysis",
    title: "Decoding the Job Description: What They Really Want",
    phases: ["draft"],
    category: "Research",
    summary:
      "Job descriptions are often written by committee and full of noise. Learn to extract the real requirements from the filler.",
    content: `## The Problem With Job Descriptions

Most JDs are written by HR with input from a hiring manager who has 20 minutes to spare. The result is a list of requirements that mixes must-haves with nice-to-haves, reflects the previous person in the role, and often contradicts what the team actually needs.

Your job is to decode it.

## The 3-Layer Read

### Layer 1: The Headline Requirements
Read the entire JD once without annotating. What's the core job? Strip out the noise words ("passionate," "dynamic," "fast-paced") and identify:
- The primary output of this role (what gets measured?)
- The core domain (engineering leadership? product strategy? revenue operations?)
- The scope (IC, team lead, cross-functional influence, executive?)

### Layer 2: The Real Requirements
Go back through and mark each requirement as:
- **Critical**: Appears in multiple places, mentioned first, used in the job title
- **Important**: Clearly tied to the business problem
- **Filler**: Generic corporate language, or the "nice to have" at the bottom

Typically, 5–7 requirements are real. The other 10 are aspirational or recycled from a previous posting.

### Layer 3: The Hidden Signal
Look for what's *not* said:
- If "stakeholder management" appears heavily, the role has political complexity.
- If the same tool is mentioned 4 times, it's non-negotiable.
- If "you'll wear many hats" appears, expect scope creep.
- If there's no mention of team size, the role may be a solo contributor with a senior title.

## Red Flags in JDs
- "Unlimited PTO" without any specifics (often means unlimited guilt)
- 10+ years of experience required for an IC role (suggests risk-averse culture or a very specific gap to fill)
- Requirements that contradict each other (hands-on + strategic vision for a single IC role)
- Vague success criteria ("drive results," "move the needle") — you can't negotiate what you can't measure

## What to Extract for Your Application

Build a quick map:
| Their requirement | My evidence |
|---|---|
| Led cross-functional initiatives | Shipped X with 4 teams, delivered in 6 months |
| Deep experience in [domain] | 8 years, including [specific context] |

This becomes your tailoring guide. Don't apply until you've filled at least 70% of the critical column.
`,
  },

  {
    id: "draft-tailor-cv",
    title: "Tailoring Your CV Without Lying",
    phases: ["draft"],
    category: "Preparation",
    summary:
      "Relevance beats comprehensiveness. Tailor your CV to each role by surfacing the right evidence — not by embellishing.",
    content: `## The Core Principle

A tailored CV doesn't mean making things up. It means choosing which evidence to surface, what order to present your experience, and which language to mirror from the job description.

Hiring managers at the senior level read many CVs. They're looking for pattern matches: does this person's evidence connect to our problem?

## What to Change Per Application

### 1. The Summary / Profile
This is the highest-leverage section to customise. Rewrite 2–3 sentences to reflect:
- The specific level and function the role requires
- The industry context if it's relevant (fintech, healthcare, B2B SaaS)
- One concrete outcome that signals fit

Keep it under 60 words. Nobody reads paragraphs at the top of a CV.

### 2. Skills Order and Emphasis
Reorder your skills list so the most relevant ones appear first. Don't add skills you don't have — reframe the ones you do.

If the JD emphasises "data-driven decision making" and you've been doing A/B testing for 5 years, that's the skill to lead with.

### 3. Bullet Points in Recent Roles
You don't need to rewrite everything. Focus on the top 2–3 roles and:
- Promote bullets that are directly relevant to the job's core requirements
- Demote or remove bullets that describe unrelated work
- Adjust language to mirror the JD terminology (if they say "go-to-market," use "go-to-market," not "product launch")

### 4. What to Leave Unchanged
- Company names and dates (never)
- Job titles you held (never)
- Quantified outcomes (never inflate)
- The structure and formatting (keeps review fast)

## Mirror, Don't Copy

Language mirroring is legitimate and effective. If the JD says "platform engineering," use "platform engineering" — not because you're keyword stuffing, but because that's how the team thinks. It signals domain alignment.

## The 30-Minute Tailoring Process

1. Read the JD and highlight the 5 real requirements (see guide: Decoding the Job Description).
2. Open your base CV alongside the highlighted JD.
3. Rewrite the summary (10 minutes).
4. Scan each bullet in your top 2 roles — promote relevant, demote irrelevant (15 minutes).
5. Reorder skills list (5 minutes).

That's it. Don't overthink it. A focused 30-minute tailor beats a laboured 3-hour rewrite.
`,
  },

  {
    id: "draft-skills-inventory",
    title: "Building Your Skills Inventory",
    phases: ["draft"],
    category: "Preparation",
    summary:
      "Before you can tailor your CV, you need to know what you're working with. A skills inventory prevents you from underselling or overlooking your strongest assets.",
    content: `## Why This Step Matters

After 10–20 years of experience, people routinely undersell skills they've internalised so deeply they no longer notice them. The skills inventory process surfaces this tacit knowledge.

It also identifies genuine gaps — which is information worth having before you apply, not after you've started a role.

## Building Your Inventory

### Step 1: List Everything (Uncritically)

Set a timer for 20 minutes. List every skill, tool, domain, and capability you've used professionally. Don't filter — include:
- Technical skills (languages, platforms, tools)
- Domain knowledge (regulated industries, specific markets, business models)
- Process skills (agile, risk management, post-mortems)
- Leadership and influence skills (hiring, mentoring, executive communication)
- Cross-functional skills (legal, finance, marketing fundamentals you've worked alongside)

### Step 2: Rate Each on Two Dimensions

For each item, assign:
- **Depth** (1–5): 1 = aware, 3 = can work independently, 5 = expert, could teach it
- **Recency** (1–5): 1 = haven't used in 5+ years, 5 = used in the last 6 months

Skills with high depth but low recency are still valuable — note them separately as "dormant skills" that could be re-activated with ramp time.

### Step 3: Identify Your Signature Strengths

Which 5–7 skills sit at depth 4–5 and recency 3–5? These are your signature strengths — the things you can claim credibly in an interview and back up with stories.

These should be prominent in your CV. Everything else is supporting evidence.

### Step 4: Map to Market

For each target role, check your signature strengths against the JD. Calculate rough coverage:
- **80%+ overlap**: Strong candidate, apply with confidence
- **60–80% overlap**: Viable candidate, tailor messaging carefully
- **Below 60%**: Consider whether this is the right timing, or whether to apply for a more transitional role first

## Updating Your Inventory

Do this every 6 months, even when you're not job searching. Skills depreciate (technologies change, markets shift) and new ones accumulate without you noticing.

The inventory makes the CV process fast — you're selecting from a documented asset base, not trying to remember your career from scratch.
`,
  },

  {
    id: "draft-career-gap-framing",
    title: "Framing Career Gaps Honestly",
    phases: ["draft"],
    category: "Preparation",
    summary:
      "A gap on your CV is not a liability if you frame it accurately. Most hiring managers care less about the gap and more about how you talk about it.",
    content: `## The Actual Risk

The risk of a career gap is not the gap itself — it's how candidates handle it. Vague explanations, visible discomfort, or overclaiming what happened during the gap are what lose candidates offers.

Straightforward, factual framing works.

## Types of Gaps and How to Frame Them

### Caregiving (children, parents, family illness)
This is the most common gap for experienced professionals. State it plainly:
- "I took 18 months off to care for a parent who required full-time support."
- "I was the primary caregiver for my children for two years while my partner's career required relocation."

You don't owe details. Don't apologise. A factual statement followed by "I'm fully available now" is sufficient.

### Health
Be as specific as you're comfortable with, but you're not required to disclose medical details:
- "I dealt with a health issue that required a period of recovery. I'm fully fit to work now."
- If you had a serious illness and believe it's relevant context, a brief mention is fine — employers generally respond well to honesty here.

### Burnout or Mental Health
Increasingly accepted. You can use "burnout" directly:
- "After [X] years at [demanding pace], I took deliberate time to recover and reset. I'm energised to return to work."

### Layoff → Extended Job Search
If the market was genuinely difficult (it often is), say so:
- "I was part of a [company] restructuring in [year]. The market was competitive and I've been selective about roles that fit."

### Exploration / Entrepreneurship Attempt
Even if the venture failed, frame it as a learning experience with honest outcomes:
- "I spent 14 months building [brief description]. We didn't achieve product-market fit, but I ran every function of the business and learned what I'd do differently."

### Travel or Personal Development
Fine to mention briefly. Pair it with a practical note:
- "I took a deliberate break to travel. I've been ready to return for the last [X] months and have been actively looking for the right opportunity."

## On the CV Itself

Keep gap coverage in dates accurate. Employers do reference checks and gaps are discoverable. If you have freelance work, contract roles, or volunteer work during the gap, list them — even if they're tangential.

Don't hide the gap. Include it. Own it. One honest sentence is better than a confusing date structure that invites suspicion.
`,
  },

  {
    id: "draft-portfolio-prep",
    title: "Preparing Your Work Portfolio",
    phases: ["draft"],
    category: "Preparation",
    summary:
      "At senior levels, a portfolio isn't optional — it's how you demonstrate pattern of impact, not just a list of job titles.",
    content: `## What Counts as a Portfolio

For non-designers, this word creates confusion. Your portfolio is any curated set of evidence that demonstrates your work at a level beyond what fits in a CV.

This could be:
- Case studies (written, 500–1500 words each)
- GitHub repositories with meaningful README files
- Writing samples (published posts, internal memos you can reference)
- Talks, presentations, or podcast appearances
- Products or features you shipped (with links, if public)
- A personal website that organises the above

## Building Case Studies (The Core Asset)

A case study is not a project description. It's a structured narrative:

**1. Context**: What was the situation? What was at stake for the business?

**2. Your Role**: Specifically what were you responsible for? (Not what "we" did — what *you* owned.)

**3. Approach**: What decisions did you make? What tradeoffs did you navigate? What alternatives did you consider?

**4. Outcome**: What measurably changed? Be specific — percentages, time saved, revenue impacted, team size scaled.

**5. What You'd Do Differently**: This is the part most people skip. It's the most valuable — it shows self-awareness and learning, not just success-washing.

A case study without metrics is anecdotal. A case study with outcomes but no tradeoffs is marketing. Both versions are weaker than the full story.

## What to Include

Select 3–5 pieces of work that together show:
- Your best work (strongest outcome)
- Range of scope (from hands-on execution to strategic direction)
- Breadth of context (different industries, stages, or functions, if applicable)

Don't include everything. Curation is part of the signal.

## Handling Confidentiality

Most substantive work is confidential. You have options:
- Describe outcomes in relative terms ("improved conversion by ~40%") without naming the product
- Create sanitised versions with company names and proprietary details removed
- Reference the case study verbally in interviews and offer to discuss details under NDA if relevant

## Where to Host It
- A simple personal website (Notion, read.cv, a static site) with a professional URL
- A private PDF you send on request
- GitHub for technical work — repos should have clear README files that explain the *why*, not just the *what*
`,
  },

  // ─── SAVED PHASE ───────────────────────────────────────────────────────────

  {
    id: "saved-networking-strategy",
    title: "Strategic Networking: Getting Referred",
    phases: ["saved"],
    category: "Networking",
    summary:
      "Employee referrals dramatically increase your odds of getting an interview. This is how to earn one without being transactional.",
    content: `## Why Referrals Work

At most companies, referred candidates get 2–5x the interview conversion rate of direct applicants. Many roles are filled internally or through referrals before they're posted publicly. Networking is not optional at senior levels — it's the primary channel.

## Who Can Refer You

Before anything else, map who you already know at the target company:
- Former colleagues who've moved there
- Professional connections from your industry who work there now
- People you've met at conferences or online
- Alumni of companies you've worked at who are now there
- Second-degree connections (LinkedIn is useful here)

Don't start with strangers. Work the existing network first.

## How to Ask for a Referral

The mistake most people make is asking too directly too soon. The sequence that works:

**Step 1: Reconnect Genuinely**
Reach out without immediately asking for anything. Reference something specific about the person's work or a shared connection. Ask how things are going.

**Step 2: Share Context**
After initial re-engagement: "I've been looking at [company] seriously — I think my background in [X] could be a strong fit for what they're doing with [Y]. You know the company better than I do. Is it worth exploring?"

**Step 3: Ask Specifically**
If they're positive: "Would you be comfortable submitting a referral for [specific role]? I'd make it easy — I can send you a paragraph about my background and why I think I'm a good fit."

Make it low-effort for them. Provide the supporting material. Don't make them work.

## When You Don't Know Anyone

This is where targeted outreach to strangers is warranted — but it needs to be credible:
- Reference specific work (their blog post, a talk they gave, a product they shipped)
- Ask a genuine question, not a favour
- Don't mention the job in the first message
- If the conversation goes well over 2–3 exchanges, then share your interest in the company

## What Not to Do
- Mass-messaging your entire network (people can tell)
- Asking immediately before any relationship context
- Asking someone to refer you to a role they clearly know nothing about
- Following up more than twice without response
`,
  },

  {
    id: "saved-linkedin-optimization",
    title: "Optimising Your LinkedIn for This Role",
    phases: ["saved"],
    category: "Networking",
    summary:
      "Recruiters actively source from LinkedIn. Your profile should reflect the role you want next, not just what you've done.",
    content: `## The Recruiter's View

LinkedIn is a search engine for humans. Recruiters search for people, not jobs. They filter by keywords, location, title, and school. If your profile doesn't surface when they search for the role you want, you're invisible.

This is separate from job applications — it's about being findable.

## High-Impact Changes

### Headline
Don't use your job title. Use a positioning statement that describes what you do and for whom.

Weak: "Senior Product Manager at Acme Corp"
Strong: "Product leader | B2B SaaS | 0→1 product builds and scaling | fintech focus"

The headline appears in search results before anyone clicks your profile. It's the hook.

### About Section
This is your summary, but written for LinkedIn's audience (which includes people who don't know you). Structure it:
- Who you are and what you specialise in (2–3 sentences)
- What you've done that's notable (2–3 concrete outcomes)
- What you're interested in / open to (be explicit if you're job searching)

Under 300 words. Write in first person. No bullet points here — prose reads as more human.

### Experience Section
Each role should have 2–4 bullets that emphasise outcomes, not responsibilities. Mirror the language of roles you're targeting.

Don't leave roles empty. Even a short stint with one clear outcome is better than a blank entry that looks like a gap.

### Skills and Endorsements
Add skills explicitly — LinkedIn uses them in its ranking algorithm. Request endorsements from people who can legitimately vouch for the skill (don't ask for endorsements on skills the person hasn't seen you use).

### Activity and Visibility
Commenting thoughtfully on posts in your target industry is one of the fastest ways to build visibility with people who are hiring. Three substantive comments per week is enough to become recognisable in a niche.

## Open to Work Settings

If you're actively job searching, use the "Open to Work" banner visible to recruiters only (not the public green banner, if you're employed). Set the role types, locations, and industries you're targeting — this feeds LinkedIn's recruiter search directly.
`,
  },

  {
    id: "saved-informational-interviews",
    title: "Using Informational Interviews Effectively",
    phases: ["saved"],
    category: "Networking",
    summary:
      "An informational interview is one of the highest-leverage activities in a job search — if you run it right.",
    content: `## What an Informational Interview Actually Is

It's a structured 20–30 minute conversation where you learn from someone inside a company or function you're targeting. It is NOT a job interview in disguise. Treating it like one will kill both the conversation and the relationship.

The goal is insight. The side effect is visibility and connection.

## Who to Ask

- Current employees at the level just above where you're targeting
- People who recently left the company (they'll be more candid)
- Hiring managers at companies on your list (even if there's no open role)
- People who've made a transition similar to the one you're considering

A second-degree connection (mutual friend) is ideal. Cold outreach can work if your message is genuinely relevant.

## How to Request One

Keep the ask short and specific:
> "I'm exploring [domain/company] seriously and would value 20 minutes with someone who's done this well. Your background in [X] is exactly what I'm trying to understand. Are you open to a brief call?"

Don't say "pick your brain." Don't make it longer than 3 sentences.

## What to Ask

Prepare 5 questions. You'll get through 3–4 in a good conversation. Examples for a senior professional:

- "What's the actual day-to-day decision-making process in your team? How does information flow?"
- "What types of people succeed here, and what tends to trip people up?"
- "If you were joining the team now, what would you want to know that nobody tells you?"
- "What's the team's biggest unsolved challenge right now?"
- "Is there anyone else you think I should talk to?"

The last question is critical — it compounds the network.

## After the Conversation

Send a short thank-you note within 24 hours. Reference something specific from the conversation. Don't immediately follow up asking for a referral — let the relationship have a chance to exist first.

If a role opens up 3 months later, you have a warm contact, not a cold application.
`,
  },

  {
    id: "saved-application-timing",
    title: "When to Apply: Timing Your Submission",
    phases: ["saved"],
    category: "Strategy",
    summary:
      "The timing of your application affects whether it gets seen. Here's what the research and practitioner experience say.",
    content: `## Does Timing Actually Matter?

Yes, but not dramatically. The quality of your application matters more than when you submit it. That said, there are patterns worth understanding.

## Early vs. Late

**Apply within the first week**: At most companies, the hiring pipeline works fastest when a role is new. Hiring managers review early applications with more attention. As the pile grows, reviews become faster and less thorough.

If a role has been posted for 3+ weeks, either they haven't found the right person (still worth applying) or they have a pipeline and are keeping the post up for legal or HR reasons (less valuable).

**Don't apply on day one**: If you haven't done your research yet (company, JD analysis, tailoring), the urgency to be first costs you quality. A tailored application submitted on day 4 beats a generic one submitted on day 1.

## Day of Week Patterns

Based on recruiter and hiring manager reports:
- **Tuesday–Thursday**: Highest engagement. Hiring managers are in "work mode" and review materials actively.
- **Monday**: Often overwhelmed by weekend emails, catch-up meetings.
- **Friday**: Mental bandwidth drops, many people are heads-down finishing work.

This is a minor optimisation — don't delay a good application by 4 days because of it.

## Time of Day

ATS systems don't care. Hiring managers might. If your application is likely to arrive in a human inbox (via email, referral, or direct submission), early morning (8–9am local time for the recipient) tends to land near the top.

## When to Wait Before Applying

Wait until you:
1. Have researched the company enough to write a contextual summary
2. Have tailored the CV to the specific role
3. Have identified any internal connections worth reaching out to first
4. Know clearly why this role, why this company, why now

Applying from a position of clarity is always better than applying from urgency.

## Roles Without Expiry Dates

Some roles (especially senior and executive) are kept open for months. Don't assume a post is stale — call or email the hiring contact to ask if they're still actively reviewing.
`,
  },

  {
    id: "saved-company-culture-research",
    title: "Assessing Company Culture Before You Apply",
    phases: ["saved"],
    category: "Research",
    summary:
      "Culture fit is a two-way assessment. Your job is to evaluate whether this company works for you — not just whether you work for them.",
    content: `## Why This Matters More at Senior Levels

Early in your career, you adapt. At 35–50, with a clear sense of how you work best, choosing the wrong culture is expensive — for you and for them. A poor culture fit at a senior level almost always ends in a departure within 18 months.

Do this research before you apply, not after you've received an offer.

## Primary Research Channels

### Glassdoor
Useful, but needs calibration. Look for:
- **Patterns, not outliers**: One 1-star review means little. Eight reviews mentioning "constant pivots in strategy" means something.
- **Review dates**: Culture can change. A wave of negative reviews from 3 years ago during a leadership transition may not reflect today.
- **What leadership responds to**: How executives respond to critical reviews tells you a lot about the culture.

### LinkedIn Employee Data
Look at:
- Average tenure at senior IC and management levels (< 18 months is a red flag)
- Career trajectories of people who left (do they go to competitors? Unrelated industries? Startups?)
- Whether there's a pattern of people from one background dominating senior ranks (indicates hiring bias or culture uniformity)

### Blind (the app)
More candid than Glassdoor. Skews toward tech companies and can be harsh, but real concerns surface here that employees won't post publicly.

### News and Press
- Recent layoffs, reorgs, or leadership departures
- Regulatory or legal actions
- Coverage in trade press (not just PR-driven stories)

## In Conversations

When you do informational interviews, ask:
- "What's one thing about working here that surprised you — good or bad?"
- "How does the company handle disagreement or bad news?"
- "What does a successful year look like for someone in this role?"

These questions get to culture without asking "what's the culture like?" (which gets you a PR answer).

## Culture Dimensions Worth Evaluating

| Dimension | Questions to investigate |
|---|---|
| Decision-making | Centralised or distributed? Who has real authority? |
| Feedback | Is critical feedback direct or indirect? Frequent or annual? |
| Pace | How does the company define "fast"? |
| Remote/hybrid reality | What does "flexible" actually mean? |
| Internal mobility | Do people get promoted from within, or are senior roles always external? |
`,
  },

  // ─── APPLIED PHASE ─────────────────────────────────────────────────────────

  {
    id: "applied-cover-letter-tips",
    title: "Cover Letter Best Practices That Actually Work",
    phases: ["applied"],
    category: "Writing",
    summary:
      "Most cover letters are read for 15 seconds. The ones that work are specific, short, and written for the reader's problem — not the writer's history.",
    content: `## The Purpose of a Cover Letter

A cover letter is not a summary of your CV. It's a short argument for why you're the right person for this specific role at this specific company.

Most cover letters fail because they describe the applicant's history instead of addressing the employer's need.

## What to Cover (and What Length)

Aim for 250–350 words. Three paragraphs. No longer.

**Paragraph 1: The hook**
Open with a specific reason why you're applying to this company. Not "I've always admired your mission" — something concrete. Reference a product decision, a recent hire, a market position, a business challenge. Show that you've done the work.

**Paragraph 2: Your relevant evidence**
Pick the one or two most relevant things in your background. Describe them with outcomes, not responsibilities. Reference the JD language where it's genuine.

**Paragraph 3: Why this is a mutual fit**
What does this role offer that matters to you at this stage of your career? And what do you offer that closes a specific gap for them? Be honest and specific.

## What Not to Do

- Don't open with "I am writing to apply for..." (everyone does this)
- Don't use three adjectives where one outcome would do
- Don't apologise for experience you don't have ("While I don't have [X]...")
- Don't repeat your CV — the hiring manager has it open in the same browser tab
- Don't use AI-generated boilerplate (it's recognisable and signals low effort)

## Practical Formatting Notes

- Use the same font and style as your CV
- Address it to the hiring manager by name if you can find it
- If you genuinely can't find a name, "Dear Hiring Team" is acceptable
- Save as PDF before sending

## When a Cover Letter is Optional

"Optional" usually means "we won't reject you for not sending one, but we'll prefer applicants who did." At senior levels, always send one. You're competing against people who will.
`,
  },

  {
    id: "applied-follow-up-timing",
    title: "The Art of Following Up Without Being Pushy",
    phases: ["applied"],
    category: "Follow-up",
    summary:
      "Following up shows initiative. Following up incorrectly shows poor judgment. Here's the line between persistent and annoying.",
    content: `## The Context You're Working In

A recruiter managing an active requisition may have 200–400 applications. They're also managing other roles, scheduling, and internal processes. Your follow-up email is a small fraction of their inbox.

This doesn't mean don't follow up. It means calibrate your expectations and your tone.

## When to Follow Up

**After application**: Wait at least 7 business days before following up. If the job posting gave a specific timeline ("we'll be in touch within 2 weeks"), respect it — follow up after that window closes.

**After an interview**: 24 hours for a thank-you note (see guide on thank-you notes). If you haven't heard back after the promised decision date, wait 2 business days past that date before following up.

**After any stage of the process**: A maximum of two follow-ups if you receive no response. After that, assume the answer is no and move on.

## How to Write a Follow-Up

Keep it to 3 sentences:
1. Context (which role, when you applied)
2. Expression of continued interest (one specific reason)
3. A simple ask (confirm they received your materials, or ask about timeline)

Example:
> "I applied for the Head of Product role on [date]. I remain genuinely interested — particularly in [specific aspect]. Could you confirm you received my materials, or share any update on the timeline?"

No pressure language. No guilt. No "I'm very excited and would love the opportunity to..." — this signals desperation.

## Channels

Email is almost always the right channel. LinkedIn DM is acceptable if you're connected and haven't heard back from email. Calling an HR line about a specific application is rarely productive unless they've asked you to.

## What a Non-Response Usually Means

Either:
- They're still in process and you're in consideration
- You've been passed over and they're not communicating rejections

Both are possible. Continue moving your other applications forward. Don't put your job search on hold waiting for a reply.
`,
  },

  {
    id: "applied-tracking-applications",
    title: "Tracking Your Applications Effectively",
    phases: ["applied"],
    category: "Organisation",
    summary:
      "If you're running a serious job search, you need a system. Application tracking keeps you from losing momentum and missing follow-up windows.",
    content: `## Why Tracking Matters

At any given moment in an active job search, you might have 15–30 applications in various stages. Without a system, you'll:
- Miss follow-up windows
- Forget what version of your CV you sent
- Confuse which role had which interview
- Fail to debrief after rejections in a useful way

This is not about being overly methodical — it's about not dropping balls.

## What to Track

For each application, capture:
- **Company** and **role title**
- **Date applied**
- **Status** (applied, phone screen scheduled, interviewing, rejected, offer, withdrawn)
- **Current contact** (recruiter or hiring manager name, email)
- **CV version** (which tailored version you sent)
- **Cover letter sent** (yes/no)
- **Next action** and **next action date**
- **Notes** (anything notable from conversations)

## Tools

**Spreadsheet**: The simplest and most flexible. Google Sheets or Airtable work well. Create one row per application, sort by next action date.

**Notion or Obsidian**: Good if you also want to write notes on company research, interview prep, and post-mortem notes in the same place.

**Dedicated apps**: tools like this one. Use what reduces friction — the best system is the one you actually update.

## Maintenance Rhythm

Update your tracker immediately after every interaction — application submission, call, email, interview. The window between an interview and when you can remember specifics is short.

Weekly review: Every Sunday, spend 10 minutes reviewing: What needs to be followed up? What research is overdue? Which roles have gone cold?

## Using It for Learning

After each rejection (or offer), tag the application and note:
- Where in the process did it end?
- What was the likely cause?
- What would you do differently?

After 10–15 applications, patterns emerge. You'll see whether your bottleneck is at the application stage, phone screen, or late-stage interview — and that tells you where to focus your improvement.
`,
  },

  {
    id: "applied-multiple-applications",
    title: "Managing Multiple Active Applications",
    phases: ["applied"],
    category: "Organisation",
    summary:
      "Running parallel applications is the right strategy, but it creates coordination complexity. Here's how to stay on top of it.",
    content: `## The Case for Multiple Parallel Applications

The job search has high variance. Good candidates get rejected from roles they're well qualified for, for reasons that have nothing to do with them. The only hedge against this variance is volume.

A healthy senior job search typically runs 10–20 active applications simultaneously, with 3–5 at any given stage of the interview process.

## The Coordination Challenges

With multiple active applications:
- You'll receive multiple scheduling requests at the same time
- You'll need to customise prep materials for each company
- You may receive offers with different timelines
- You'll need to track which version of your story you've told where

None of this is unmanageable — it just requires a system.

## Keeping Stories Consistent

At senior levels, hiring managers talk to each other. Industry circles are small. The story you tell at Company A should be compatible with the story you tell at Company B — not identical (different emphasis is fine), but not contradictory.

Keep a running note of the narrative you're leading with for each company. If you're emphasising your cost-reduction work for one and your growth leadership for another, that's fine — but know which story you told where.

## Managing Offer Timing

The most stressful scenario: you receive an offer from Company B while you're still in final rounds at Company A (your preferred choice). Options:

1. **Ask for a timeline extension from Company B**: "I'm very interested and want to give this proper consideration. Could you extend the deadline to [date]?" Most companies can extend by 3–7 days.

2. **Accelerate the timeline at Company A**: Tell them honestly, without naming Company B: "I have a competing offer with a deadline of [date]. Is it possible to accelerate the process?" Many companies can move faster when they know the timeline.

3. **Make a decision with the information you have**: If Company A won't accelerate and Company B won't extend, you have to decide with incomplete information.

## Withdrawing Gracefully

When you accept an offer, withdraw your other applications promptly and professionally. The industry is smaller than it looks. A brief email to each recruiter thanking them for their time and noting you've accepted another offer is sufficient — and leaves a positive impression.
`,
  },

  {
    id: "applied-email-etiquette",
    title: "Professional Email Communication with Recruiters",
    phases: ["applied"],
    category: "Communication",
    summary:
      "How you communicate before you're hired signals how you'll communicate as an employee. Get the basics right.",
    content: `## Why This Matters More Than You Think

Your email interactions with a recruiter are the hiring team's first data point on how you communicate professionally. They're often shared with the hiring manager: "Here's the candidate's email — they seem [responsive/difficult/enthusiastic/vague]."

This is an early-stage interview. Treat it that way.

## Response Time

Respond to recruiter emails within 24 hours during business days. If you receive an email on Friday afternoon and can't respond properly until Monday, that's acceptable. If you take 4 days to respond to a scheduling request, you're signalling low interest or disorganisation.

If you need more time to decide whether you want to proceed, say so:
> "Thanks for reaching out. I'm very interested in learning more. Could I have until [date] to confirm my availability?"

That's professional. Silence isn't.

## Subject Lines

When replying to existing threads: keep the original subject line. Don't change it.

When initiating contact: be specific.
- "Application for Head of Engineering — John Smith" is better than "Job Inquiry"
- "Following up on Senior PM application (applied Nov 12)" is better than "Following up"

## Tone and Length

Match the recruiter's register. If they're informal and direct, you can be too. If they're formal, stay formal.

In all cases:
- Keep emails short (3–5 sentences for most interactions)
- One email per topic (don't bundle 4 questions into one)
- Answer the question that was asked before asking your own questions
- Proofread before sending

## Sending Attachments

When sending CV or cover letter:
- Use PDF format unless explicitly asked for Word
- Name files with your name: \`JohnSmith-CV.pdf\`, not \`CV_v3_final.pdf\`
- Don't attach both CV and cover letter if only asked for one

## If You Have Questions About the Role

Ask 2–3 pointed questions, not 8. Prioritise questions that affect whether you'll proceed. Leave the deeper questions for the actual interview.

Avoid asking about salary in the first email unless they've brought it up — that conversation comes later.
`,
  },

  // ─── SCREENING PHASE ───────────────────────────────────────────────────────

  {
    id: "screening-phone-prep",
    title: "Phone Screen Preparation Checklist",
    phases: ["screening"],
    category: "Preparation",
    summary:
      "A 30-minute phone screen is a real interview. Most candidates underprepare because it feels informal. That's a mistake.",
    content: `## What Happens in a Phone Screen

The recruiter is answering one question: Is this person worth the hiring manager's time?

They're checking:
- Communication skills (can you speak clearly and concisely?)
- Basic qualification (does your background actually match the JD?)
- Compensation alignment (is there a range match?)
- Culture signal (do you seem like someone who'd work well here?)
- Genuine interest (do you actually want this role?)

## The Checklist

**Day before:**
- [ ] Re-read the job description
- [ ] Review your tailored CV — know what's on it
- [ ] Research the recruiter on LinkedIn (know their name, understand their role)
- [ ] Prepare 2–3 specific reasons why you're interested in this company
- [ ] Prepare your answer to "tell me about yourself" (under 2 minutes — see dedicated guide)
- [ ] Prepare your salary expectation or range (see guide on salary question)
- [ ] Write down 2 questions you'll ask at the end

**Day of (30 minutes before):**
- [ ] Find a quiet space with no background noise
- [ ] Good mobile signal or a landline — don't take it on a spotty connection
- [ ] Have your CV on screen
- [ ] Have the job description on screen
- [ ] Have a glass of water (dry mouth is real)
- [ ] Turn off notifications on your computer and put phone on Do Not Disturb (ironic but important if using a second device)

**During:**
- [ ] Let them set the agenda — don't rush to your questions first
- [ ] Take brief notes on anything that affects your interest level
- [ ] Ask about next steps at the end, before they hang up

**After:**
- [ ] Note the recruiter's name and email for follow-up
- [ ] Send a follow-up email within 24 hours (3 sentences: thanks, continued interest, one specific thing from the call)
- [ ] Update your tracker with the outcome and next action

## Common Mistakes to Avoid

- Not knowing what's on your own CV
- Rambling answers to simple questions (stay under 90 seconds per answer)
- Forgetting to ask about the process and timeline
- Not having a clear answer on availability and notice period
- Taking the call while driving or in a noisy environment
`,
  },

  {
    id: "screening-recruiter-questions",
    title: "Common Recruiter Questions and How to Answer",
    phases: ["screening"],
    category: "Preparation",
    summary:
      "Phone screen questions are predictable. Prepare answers that are specific, honest, and demonstrate you know your own experience.",
    content: `## Why Preparation Matters Here

Recruiters ask the same questions across every candidate. The differentiator is not having a clever answer — it's having a specific, grounded answer that demonstrates clarity about your own experience.

Vague answers signal lack of self-awareness. Overly rehearsed answers signal they're performing, not answering. Aim for clear and genuine.

## Common Questions and How to Approach Them

**"Walk me through your background."**
This is not an invitation to recite your CV chronologically. Give a 90-second arc: where you started, what you specialised in, what you accomplished, where you are now, and what you're looking for next. Practice this until it's fluid.

**"Why are you leaving your current role?"**
Be honest, but forward-looking. Don't criticise your employer. Acceptable reasons: seeking greater scope, role changed in a direction that doesn't fit, company direction shifted, team restructured. Frame it around what you're moving towards, not away from.

**"Why are you interested in this company?"**
Have a specific answer. Reference something concrete about the company — a product decision, a market position, a business problem. "I've always admired your culture" is not an answer.

**"What are you looking for in your next role?"**
Know your priorities. Be honest about them. If you're looking for a more strategic role after years of execution-heavy work, say so. If you want to build a team after years of IC work, say so. Misalignment on this costs everyone time.

**"What's your notice period?"**
State it plainly. If it's negotiable (most companies can accelerate with an agreement), mention that.

**"What are your salary expectations?"**
See the dedicated guide. The short version: state a range based on your research, or ask for their range first.

**"Tell me about a challenge you've faced."**
Have 2–3 real stories ready. Use the STAR structure (see interview guide). Keep the story under 2 minutes. The recruiter is checking whether you can give a coherent narrative, not whether your challenge was impressive enough.
`,
  },

  {
    id: "screening-salary-expectations",
    title: "Handling the Salary Question Early On",
    phases: ["screening"],
    category: "Negotiation",
    summary:
      "The salary question comes up in every phone screen. Answering it poorly can take you out of the running or anchor you too low. Here's how to handle it.",
    content: `## Why This Question Is Tricky

If you say a number first, you risk:
- Going too low (you've anchored your own negotiation)
- Going too high (you're screened out before they know your value)

If you deflect entirely, some recruiters will push back and some will appreciate your professionalism. The context matters.

## Research First

Before any screening call, know:
- Market rate for this role, level, and location (use Levels.fyi, LinkedIn Salary, Glassdoor, Blind)
- Whether the company is known to be above or below market
- Your current total compensation and your target total compensation
- What flexibility you have (equity vs. cash mix, benefits tradeoffs)

Don't enter this conversation guessing.

## Option 1: Ask for Their Range First

Legitimate in most contexts:
> "I want to make sure we're aligned on expectations. Could you share the budgeted range for this role?"

Most companies have a range. Many will share it. If they share a range that works for you, confirm it:
> "That range works for me. I'm targeting [X] to [Y] depending on the full package."

## Option 2: State Your Range

If they deflect or press you, give a researched range:
> "Based on my research and my current level, I'm targeting [X] to [Y] in base. That said, I'm open to understanding the full package before drawing hard lines."

Set the range so that your target is at the low end — not the middle. If you want $200K, say $200K–$220K, not $185K–$215K.

## Option 3: Frame Around Total Comp

If you're in a tech or equity-heavy environment, it's fair to ask about the full package structure before anchoring on a base number:
> "Base is important, but I want to understand the equity and bonus structure before settling on a number. Could you walk me through the full package?"

## What Not to Do

- Don't say "I'm flexible" without giving any number — it's evasive and signals that you haven't done your research
- Don't give a range so wide it's meaningless ("somewhere between $150K and $250K")
- Don't lie about your current salary (it can be verified and it damages trust)
`,
  },

  {
    id: "screening-tell-me-about-yourself",
    title: "Crafting Your 'Tell Me About Yourself' Story",
    phases: ["screening"],
    category: "Communication",
    summary:
      "This is the most asked question in any interview process. Most people answer it wrong by treating it like a CV readback. Here's how to use it.",
    content: `## What They're Actually Asking

"Tell me about yourself" is an open invitation to frame yourself. The interviewer is giving you the floor to set the context for everything that follows. This is not a biography request — it's a positioning statement.

What the interviewer learns from your answer:
- Can you communicate clearly under mild pressure?
- Do you know what's most relevant to emphasise?
- Is your career arc coherent or fragmented?
- Are you someone whose presence feels clear and grounded?

## The Structure That Works

**90 seconds. Three parts.**

**Part 1: Where you come from (20 seconds)**
One or two sentences on your professional foundation. Not your first job in 1998 — the relevant foundation for this conversation.

Example: "I've spent 15 years in product leadership, primarily at B2B SaaS companies scaling from Series A through IPO."

**Part 2: What you're known for (40 seconds)**
Your core professional identity — the thing you've done repeatedly and done well. Pick 2 things maximum. Anchor them with brief outcomes.

Example: "I've built products from 0 to 1 three times — launched a payments platform, a developer tool, and an enterprise compliance product. All three hit product-market fit within 18 months. I'm also known for building high-functioning product teams — I've hired and developed 30+ PMs over my career."

**Part 3: Why this conversation (30 seconds)**
Why you're here, why now. Connect your trajectory to this specific opportunity.

Example: "I'm looking for a role where I can apply that experience in a larger market. What [Company] is doing in [domain] is the kind of challenge I want to take on at this stage of my career."

## Practice Until It's Natural

Record yourself answering this question. Listen back. Does it sound like a real person talking, or like someone reciting a script?

The goal is fluent, not memorised. You want to know the structure well enough that you can deliver it naturally in any context — phone screen, panel interview, dinner with the CEO.

## Tailoring It

The framework above is fixed. The content changes per opportunity:
- Emphasise the skills and experience most relevant to this role
- Reference the company or domain specifically in Part 3
- Adjust the "what I'm known for" section based on what the JD prioritises
`,
  },

  {
    id: "screening-red-flags",
    title: "Spotting Red Flags During Screening",
    phases: ["screening"],
    category: "Evaluation",
    summary:
      "The screening stage is a two-way evaluation. Here's what to watch for that signals problems you'll regret later.",
    content: `## The Evaluation Should Go Both Ways

Most candidates focus entirely on performing well in the screen. The best candidates also use the screen to evaluate whether the company and role are right for them.

Red flags caught at screening save 6–12 months of a painful job experience.

## Process Red Flags

**Disorganisation during scheduling**
One or two scheduling hiccups is normal. A company that reschedules the phone screen three times, or where the recruiter doesn't show up, or where you get contradictory information from different people — this is how they operate. The hiring process is often the *best* version of their internal operations.

**Inability to explain the role clearly**
At this stage, a recruiter should be able to describe the core purpose of the role and who you'd report to. If they can't, the role may be poorly defined internally — which usually means a rough onboarding.

**Vague answers to direct questions**
If you ask "How does success get measured in this role in year one?" and the answer is genuinely unclear, that's a problem. Not having the answer to hand is fine — not having thought about it is not.

## Compensation and Process Red Flags

**Significantly below-market range disclosed late**
If compensation only comes up after multiple conversations, and the number is well below what you researched, this may be a deliberate tactic. A company that respects your time shares compensation range early.

**"We move fast" as a substitute for timeline clarity**
"We move fast" is sometimes true and sometimes means "we'll give you 36 hours to decide." Ask for specifics.

## Culture Red Flags

**Pressure tactics**
"We have other candidates at this stage" during a first phone screen is a pressure tactic. It's sometimes true and sometimes not. Either way, it signals how they operate under stress.

**Dismissiveness about previous departures**
If you ask "What happened with the last person in this role?" and the answer is defensive or vague — that's worth noting. High role turnover in senior positions is always worth investigating.

**Excessive enthusiasm that doesn't match the job**
Recruiters who oversell to the point of not being able to give a balanced picture of the role may be filling a difficult position. Ask the hard questions anyway.

## What to Do With Red Flags

Make note. Don't immediately withdraw. Ask follow-up questions that test whether your concern is confirmed or explained. Collect more data in subsequent rounds. Some red flags are false positives. Some are early warnings of real problems.
`,
  },

  // ─── INTERVIEW PHASE ───────────────────────────────────────────────────────

  {
    id: "interview-star-method",
    title: "Mastering the STAR Method for Behavioural Questions",
    phases: ["interview"],
    category: "Technique",
    summary:
      "Behavioural questions are answered well when your answers are specific, structured, and honest. STAR is the framework — here's how to use it without sounding rehearsed.",
    content: `## What Behavioural Questions Are Testing

"Tell me about a time when..." questions are designed to predict future behaviour from past behaviour. Interviewers are not just looking for impressive stories — they're looking for how you think, how you handle difficulty, and whether you're honest about what went wrong.

The pattern of your answers across multiple questions tells a story. If every answer ends perfectly with no mistakes or regrets, the interviewer may not trust any of them.

## STAR: The Structure

**Situation**: Set the scene with enough context to make the story intelligible. Typically 2–3 sentences. Include the business stakes.

**Task**: What was your specific responsibility? (Not what the team did — what *you* owned.)

**Action**: What did you do? This is the longest part. Walk through the decisions you made, the alternatives you considered, why you chose the approach you chose.

**Result**: What happened? Be specific. If there's a metric, use it. If the outcome was partial or mixed, say so. Add what you learned.

## The Common Mistakes

**Too much Situation, too little Action**
Many candidates spend 70% of their answer on context and get rushed through the actual content. Flip the ratio — spend most of your time on Action and Result.

**"We" when "I" is what's being asked**
Using "we" throughout makes it unclear what you personally contributed. This is especially important at senior levels where collaborative leadership is expected but individual ownership still matters.

**Sanitised endings**
"It all worked out" is the least believable answer ending. If you can add one thing that didn't work perfectly, one thing you'd do differently, your story becomes much more credible.

**Answers that are too long**
Under 3 minutes per answer. If you're going over, the story is too complex or you're including details the interviewer doesn't need.

## Building Your Story Bank

Prepare 8–10 stories that can flex across different question types. Good story sources:
- A time you navigated significant ambiguity
- A major failure or setback and how you recovered
- A time you had to influence without authority
- A time you had to give difficult feedback to someone
- A time you changed your mind because of new information
- Your most complex cross-functional project
- A time you made a decision with limited information and were wrong

The same story can often answer multiple question types depending on which element you emphasise.
`,
  },

  {
    id: "interview-technical-prep",
    title: "Technical Interview Preparation Framework",
    phases: ["interview"],
    category: "Preparation",
    summary:
      "Senior technical interviews evaluate systems thinking, design decisions, and engineering judgment — not just coding ability. Prepare accordingly.",
    content: `## What Senior Technical Interviews Actually Test

The further you are in your career, the less likely you are to be whiteboarding LeetCode problems. Senior IC and leadership interviews focus more on:
- System design and architectural trade-offs
- Engineering judgment under constraints
- How you've led technical decisions in the past
- Your understanding of production systems, reliability, and complexity

Know what format to expect. Ask the recruiter explicitly: "What format does the technical interview take?"

## For System Design Interviews

System design is the most common senior technical interview format. The canonical areas to review:

**Scaling and distribution**
- Load balancing strategies and trade-offs
- Horizontal vs. vertical scaling decisions
- Caching layers (where, what, invalidation)
- Database selection (relational vs. NoSQL, when each is right)
- Message queues and async processing patterns

**Trade-off framing**
Interviewers want to see you reason through trade-offs, not arrive at "the right answer." Structure your thinking:
1. Clarify requirements and constraints
2. Propose a simple baseline architecture
3. Identify bottlenecks and failure modes
4. Propose solutions with explicit trade-off discussion

**Practice out loud**
System design interviews are conversations, not documents. Practice explaining your design while drawing it — the verbal reasoning matters as much as the diagram.

## For Coding Interviews (Still Required at Some Companies)

If you haven't coded regularly in a while:
- Spend 2 weeks doing 1–2 problems per day on LeetCode or similar
- Focus on patterns: sliding window, two pointers, BFS/DFS, dynamic programming basics
- Practice explaining your approach before writing code

Time yourself. Interview conditions are different from leisurely problem-solving.

## For Technical Leadership Interviews

These are usually behavioural but with a technical frame:
- "How have you made a significant architectural decision? What was the trade-off?"
- "Tell me about a time your technical decision caused a production issue."
- "How do you balance technical debt against feature velocity?"

Prepare specific stories. Your story bank from the STAR guide is relevant here.

## Day-Before Preparation

- Review your own past system designs (you'll be asked to explain them)
- Know the tech stack at the company — understand what choices they've made and be ready to discuss them
- Prepare questions about their technical challenges (shows depth)
`,
  },

  {
    id: "interview-video-tips",
    title: "Video Interview Setup and Etiquette",
    phases: ["interview"],
    category: "Preparation",
    summary:
      "Your setup communicates professionalism before you say a word. Don't let technical issues undermine a strong interview.",
    content: `## Why Setup Matters

In a video interview, you're competing on a 15-inch rectangle. Poor lighting, bad audio, or a distracting background forces your interviewer to work harder to focus on what you're saying. That cognitive overhead costs you.

A clean setup removes friction. It takes an hour to get right. Do it once, use it every time.

## Audio (Most Important)

Audio quality matters more than video quality. Poor audio is fatiguing to listen to and makes you seem less articulate than you are.

- Use a dedicated microphone or quality headphones with a built-in mic. AirPods are acceptable. Built-in laptop speakers are not.
- Test your audio before every interview with a recording or a friend call.
- Eliminate background noise: close windows, turn off fans, mute notifications.
- Hardwired internet beats WiFi for reliability. If you must use WiFi, be close to your router.

## Video and Lighting

- Natural light from in front of you is ideal. Light from behind creates silhouettes.
- If you're in a room without good natural light, a ring light or a lamp positioned in front of you solves most problems.
- Camera at eye level. Laptop screen usually means camera is below eye level — prop the laptop on books or a stand. Looking down at a camera makes you look disengaged.
- Clean background. Blurred virtual backgrounds are acceptable but can glitch. A plain wall or tidy bookshelf is better.

## Your Frame

- Your head should be centred, with 10–15% space above your head.
- Wear the same quality of clothing you'd wear to an in-person interview. At senior levels, business casual is the default unless you have specific knowledge otherwise.

## During the Interview

- Look at the camera, not the video of yourself or the interviewer. This is counterintuitive and requires practice.
- Mute yourself if there's background noise when others are talking.
- Have a glass of water nearby.
- If connection issues arise: call it out immediately, don't power through — "I'm getting a bit of lag, can you hear me clearly?"

## Day-Before Test

Join a test meeting (Zoom or Teams has test meeting options) and verify:
- Video is live and framed correctly
- Audio input and output are working
- Background is appropriate
- Lighting is adequate
- No notification sounds will fire during the call
`,
  },

  {
    id: "interview-onsite-etiquette",
    title: "On-Site Interview Day: What to Expect",
    phases: ["interview"],
    category: "Preparation",
    summary:
      "On-site interviews are long, often involve many people, and have an informal dimension that catches candidates off guard. Prepare for the full day.",
    content: `## The Structure of a Senior On-Site

For senior roles, a typical on-site involves 4–6 conversations across a full day. This might include:
- Hiring manager (strategic vision, team fit)
- Team members (collaboration, technical depth)
- Peers from adjacent functions (cross-functional effectiveness)
- Skip-level executive or C-suite (culture, ambition, leadership)
- HR or recruiter (logistics, wrap-up)

Each conversation is an interview. The water-cooler walk between rooms is an interview. Lunch with the team is an interview.

## Before You Arrive

- Confirm the address, building entrance, and whether you need ID for security
- Know who your point of contact is and their mobile number
- Arrive 10 minutes early — not 30, not on the dot
- Bring a physical notebook and pen (using your phone for notes looks like you're texting)
- Review the names and roles of everyone you're scheduled to meet

## Managing Energy Across the Day

By the 4th conversation, you'll be tired. This is normal and expected. Strategies:
- Sleep well the night before — this matters more than any last-minute prep
- Eat something. A long day of interviews on an empty stomach is worse than a slightly heavy lunch.
- Use the transitions between rooms to reset: breathe, review the name of the next person, remind yourself what their function is
- Stay consistent — your last interview deserves the same energy as your first

## Informal Moments

Lunch, coffee breaks, and escorted walks through the office are not downtime. Hiring teams often debrief on "how was she in the lunch?" These moments reveal cultural fit, curiosity, and social intelligence.

In informal settings:
- Ask genuine questions about the work and the team
- Be interested in the people — not just the role
- Don't dominate the conversation
- Avoid controversial topics (politics, previous employer grievances)

## What to Bring

- Copies of your CV (rarely needed, always useful)
- A prepared list of questions for each interviewer (you'll have time to ask 2–3 per session)
- A notebook to jot down anything worth capturing
- Something to drink — a long day of talking is physically demanding

## After the Day

Write a brief post-mortem within 2 hours: what went well, what felt uncertain, any red flags from their side, specific things to address in follow-up. Your memory degrades faster than you think.

Send thank-you notes within 24 hours (see dedicated guide).
`,
  },

  {
    id: "interview-questions-to-ask",
    title: "Smart Questions to Ask Your Interviewer",
    phases: ["interview"],
    category: "Communication",
    summary:
      "The questions you ask reveal as much about you as your answers. Ask questions that demonstrate genuine thinking — not just that you've Googled 'questions to ask in an interview.'",
    content: `## Why Your Questions Matter

At senior levels, interviewers pay close attention to the questions you ask. The quality of your questions signals:
- How deeply you've thought about the role and company
- What you care about professionally
- Whether you're a strategic thinker or a tactical executor
- Whether you've been paying attention during the interview

"I don't have any questions" is a missed opportunity and a mild red flag.

## Questions That Work

### For the Hiring Manager

- "What does success look like in this role at the end of year one — what would need to be true?"
- "What's the most important problem this role needs to solve in the first 90 days?"
- "What are the biggest constraints or obstacles I'd be working within?"
- "What have you learned from people who've been in this role before — what worked and what didn't?"
- "What's your team's biggest unsolved challenge right now?"

### For Peers and Team Members

- "What do you wish you'd known before joining?"
- "How does the team handle disagreement — especially when it's with leadership?"
- "What kinds of people tend to succeed here, and what kinds tend to struggle?"
- "If you could change one thing about how the team operates, what would it be?"

### For Skip-Level or Executive Interviewers

- "What are the company's biggest strategic risks in the next 18–24 months?"
- "What does the company need from this function that it doesn't have today?"
- "How does the board/leadership think about this area of the business?"

### For the Recruiter

- "What's the timeline from final interviews to offer?"
- "Are there other candidates you're also progressing?"
- "Is there anything from my background that you'd want me to address before you move forward?"

## Questions to Avoid

- Questions answered on the company's website (shows you didn't research)
- "What's the work-life balance like?" (legitimate concern, but ask it differently: "What does the team typically work like during crunch periods?")
- Questions about benefits and PTO too early in the process
- Hypothetical questions that take 5 minutes to set up

## Adapting Based on What You've Learned

The best questions are informed by what you've heard during the interview. Referencing something specific from the conversation shows you were listening and thinking — not just waiting to deliver your list.
`,
  },

  {
    id: "interview-thank-you-notes",
    title: "Writing Effective Thank-You Notes",
    phases: ["interview"],
    category: "Follow-up",
    summary:
      "A well-crafted thank-you note does work beyond courtesy. Done right, it reinforces your candidacy and keeps you top of mind.",
    content: `## Do They Actually Matter?

At senior levels, yes — but not because hiring managers are keeping score on politeness. They matter because:

1. They demonstrate that you're a person who follows through on small things — which suggests you'll follow through on big things.
2. They give you a second chance to address something that came up in the interview.
3. In a competitive final round, a thoughtful note can nudge a close decision.

A bad thank-you note (generic, sycophantic, or too long) is worse than none. A good one is simple and specific.

## The Structure

Send within 24 hours. Email is standard unless the hiring team is clearly more active on another channel.

**Three paragraphs, under 200 words:**

**Paragraph 1: Thanks + what you appreciated**
Reference something specific from the conversation — a challenge they shared, a question they asked, a product direction they mentioned. Proves you were present.

**Paragraph 2: One reinforcement point**
A brief, specific note that connects your experience to something discussed. This is the leverage moment — if something in the interview left you uncertain about your fit, address it briefly and directly here. If everything went well, reinforce your most relevant qualification.

**Paragraph 3: Forward-looking close**
A simple expression of continued interest and openness to next steps. Don't pressure. One sentence.

## Example

> Sarah,
>
> Thank you for the time today — the conversation about scaling the analytics team through a re-platform was exactly the kind of challenge I find energising. I've done that transition once before (at [Company], moving from Tableau to a modern stack while keeping existing business reporting intact) and the politics and pacing questions you raised were ones I navigated directly.
>
> One thing I didn't get to mention: during that project I also built the team's onboarding process for new analysts, which halved ramp time. Happy to discuss that further if it's relevant.
>
> I'd welcome the chance to move forward and am available for any follow-up you need.

## When There's a Panel

Write to each person individually. Not identical notes — reference something specific to each conversation. Yes, it takes longer. Yes, it's worth it.

## Subject Line

"Thank you — [Your Name] / [Role]" is enough. Keep it clean.
`,
  },

  {
    id: "interview-panel-interviews",
    title: "Surviving Panel and Group Interviews",
    phases: ["interview"],
    category: "Technique",
    summary:
      "Panel interviews require managing multiple relationships simultaneously. Here's how to navigate the dynamics without losing your footing.",
    content: `## What Makes Panels Different

In a one-on-one interview, you manage a single relationship. In a panel, you're managing 3–6 simultaneously — each with a different agenda, different communication style, and different definition of "good candidate."

The most common failure mode: candidates fixate on the most senior person in the room and effectively ignore the others. The junior team member who feels ignored often has more influence on the hiring decision than you think.

## Before the Panel

If possible, find out who will be in the room and their roles. LinkedIn is useful here. If the recruiter sends you names, research each one:
- What do they work on?
- What's their function and level?
- What would they be evaluating you on?

Going in with even basic context on each panellist lets you make eye contact with some intentionality.

## During the Panel

**Distribute your attention deliberately**

When answering a question from one person, begin your answer directed at them, then shift eye contact to include others, especially if the content is relevant to them. End your answer with a brief return to the questioner.

**Track who hasn't spoken**

If one person has been quiet for 20 minutes, they may be evaluating something specific. Find a natural moment to include them — reference something from their function, or ask them directly: "I'm curious how this looks from your side — [their function]."

**Don't play politics**

If panellists disagree with each other during the interview, don't side with one. Acknowledge both perspectives and give your genuine view.

**Watch the group dynamics**

Who defers to whom? Whose approval does the hiring manager seem to seek? This tells you something about who has real influence in the room.

## Managing Rapid-Fire Questions

Some panels ask questions in quick rotation. Don't feel pressured to give a short answer just because the format is fast. It's acceptable to say: "I want to give that question a real answer — let me think for a moment."

Taking 5 seconds of silence is better than a rushed answer you'll regret.

## After a Panel

Write individual thank-you notes to each panellist. Reference something from their specific contribution to the conversation. It takes more time. It's noticed.
`,
  },

  // ─── OFFER PHASE ───────────────────────────────────────────────────────────

  {
    id: "offer-salary-negotiation",
    title: "Salary Negotiation: A Step-by-Step Approach",
    phases: ["offer"],
    category: "Negotiation",
    summary:
      "Negotiating a salary offer is expected. Companies account for it. Here's a structured approach to doing it well without damaging the relationship.",
    content: `## The Core Principle

Negotiation is a professional conversation, not a confrontation. Hiring managers and HR have seen hundreds of candidates negotiate. A professional, grounded negotiation earns respect. An aggressive or entitled negotiation doesn't.

The goal is to arrive at a package that you're genuinely satisfied with — not to "win."

## Step 1: Get the Offer in Writing First

Never negotiate verbally from memory. Ask for the offer in writing (email or letter) before entering the negotiation. This ensures you're negotiating based on accurate numbers.

## Step 2: Take Time Before Responding

"Thank you — I'm excited about this. I'd like to take a couple of days to review the full package. Can I get back to you by [specific date]?" This is always acceptable.

Use that time to:
- Calculate your total current comp versus their total offer
- Research whether the offer is above, at, or below market
- Decide what you actually want to change

## Step 3: Identify Your Priority

Don't try to negotiate everything. Pick 1–2 things that matter most:
- Base salary
- Signing bonus
- Equity (vesting schedule, cliff, strike price)
- Start date
- Vacation or remote flexibility

Trying to negotiate 6 things signals bad faith.

## Step 4: Make the Ask

Call, not email. Email leaves too much room for misinterpretation. Say:

> "I'm very excited about the offer and I want to join the team. There's one aspect I'd like to discuss — the base salary. Based on my research and my current level, I was targeting [X]. Is there any flexibility to move in that direction?"

Note the structure:
1. Express genuine enthusiasm first
2. Name the specific item
3. State your ask with rationale
4. End with an open question, not a demand

## Step 5: Handle the Response

They'll either:
- **Say yes or partly yes**: Accept gracefully. Don't negotiate further on that item.
- **Say no with a reason**: Ask if there's any flexibility on another element (signing bonus, equity, start date).
- **Say no flat**: Decide whether the offer as-is meets your needs. Either accept or decline.

## What Not to Do

- Don't threaten with other offers you don't have
- Don't ask for time if you've already made up your mind
- Don't apologise for negotiating
- Don't negotiate after you've accepted — it destroys trust
`,
  },

  {
    id: "offer-evaluating-offers",
    title: "Evaluating the Full Package Beyond Salary",
    phases: ["offer"],
    category: "Evaluation",
    summary:
      "Total compensation is more than base salary. At senior levels, the differences between packages can be significant and non-obvious.",
    content: `## What to Evaluate

### Base Salary
The starting point. Know the market rate (Levels.fyi, LinkedIn Salary, Glassdoor, Blind — cross-reference at least two). Adjust for cost of living if the role is in a different city.

### Equity
At private companies:
- **Amount**: Number of options or shares and at what strike price
- **Vesting schedule**: Standard is 4-year with 1-year cliff. Shorter vesting is better for you.
- **409A valuation**: The current preferred price. The gap between your strike price and this is your "on paper" value.
- **Preferred vs. common stock**: You'll receive common stock options. At exit, preferred shareholders (investors) take their liquidation preferences first. The actual payout to common shareholders depends heavily on the exit size and structure.
- **Exercise window**: How long do you have to exercise after leaving? Standard 90 days is short and forces a decision. Some companies now offer 5–10 year windows — significantly better.

At public companies:
- RSUs are simpler — the value is the stock price
- Vesting schedule still matters
- Refresh grants (additional equity after the first grant) are important to understand

### Bonus
- Annual target bonus as % of base
- Historical payout rate (is the target realistic or aspirational?)
- Whether the bonus is discretionary or formula-driven

### Benefits
- Health insurance: Are premiums company-paid or shared? What's the plan quality?
- 401(k) match: Common to match 3–6% of salary
- Pension or defined benefit: Increasingly rare but significant if present
- Parental leave: Weeks of paid leave and policy structure
- Learning budget: Particularly relevant for senior roles where staying current matters

### Other Elements
- Remote and hybrid flexibility (actual policy vs. stated policy)
- Home office stipend
- Travel expectations (especially if the role is cross-office)
- Notice period requirements

## Building a Comparison Framework

If you're comparing multiple offers, put them in a spreadsheet. Calculate:
- Total cash (base + target bonus)
- Estimated equity value at various exit scenarios
- Benefits monetary value (health, 401k, etc.)
- Non-monetary factors (culture, career trajectory, commute)

The non-monetary factors are real value. A role that pays 10% less but offers genuine flexibility and a great team may be the right choice.
`,
  },

  {
    id: "offer-counter-offer",
    title: "Counter-Offer Strategy: When and How",
    phases: ["offer"],
    category: "Negotiation",
    summary:
      "If your current employer makes a counter-offer, you'll need to decide quickly and clearly. This guide walks through the decision and how to handle it.",
    content: `## What a Counter-Offer Means

When you resign with a new offer in hand, many employers will respond with a counter-offer: a raise, a promotion, a new title, or some combination. This is normal. The decision you make here is more consequential than most people realise.

## The Statistics

Research consistently shows that the majority of people who accept counter-offers from their current employer leave anyway within 12–18 months. Why?

Because the reasons you decided to leave — which are usually not just about money — remain unchanged. A raise doesn't fix a bad manager. A new title doesn't fix a culture problem. Additional compensation doesn't deliver the growth opportunity you're seeking.

The counter-offer is a retention tactic, not a genuine change in your situation.

## Questions to Ask Yourself

Before entertaining a counter-offer, revisit why you started looking:
- Was it primarily about compensation? (Counter-offer addresses this)
- Was it about growth ceiling, manager relationship, strategic direction, or culture? (Counter-offer does not address these)
- Do you feel genuinely valued here, or does it feel like they only noticed your value when you threatened to leave?

If the answers are honest and the issue was mainly money, a counter-offer can sometimes be the right call. In most cases, it isn't.

## How to Decline a Counter-Offer Professionally

If you decide to move forward with the new offer:
> "I appreciate the counter-offer and I genuinely value what we've built together here. After careful reflection, I've decided to move forward with [new company]. My last day will be [date]."

No detailed explanation needed. Don't create an opening for a second negotiation. Don't reveal the new offer details.

## Making the New Offer Counter-Productive

If you're genuinely undecided between the new offer and staying, you can use the new offer as leverage with your current employer — but be aware this changes the relationship. Your employer will know you were looking, and trust takes time to rebuild.

If you go this route, be prepared for the current employer to say no. Have your decision made: if they match, you stay; if they don't, you go. Don't go back to the new employer to negotiate further after already accepting.
`,
  },

  // ─── REJECTED PHASE ────────────────────────────────────────────────────────

  {
    id: "rejected-asking-feedback",
    title: "Asking for Feedback After a Rejection",
    phases: ["rejected"],
    category: "Growth",
    summary:
      "Most rejections come without explanation. When you can get feedback, it's valuable. Here's how to ask in a way that actually works.",
    content: `## The Reality of Post-Rejection Feedback

Most companies won't give detailed feedback. HR and legal departments are cautious about discrimination claims and liability. Recruiters are busy. The hiring manager has moved on.

That said, there are scenarios where you can get meaningful feedback:
- When you had a strong personal connection with the hiring manager or recruiter
- When you got far in the process (final round) and built rapport with multiple people
- When the company has a feedback-forward culture
- When you ask well

## How to Ask

Ask within 48 hours of the rejection. After that, the moment passes and the interviewer has moved on.

Email the recruiter (or the person you had the most contact with):

> "Thank you for letting me know, and for the time you and the team invested in the process. I genuinely enjoyed learning about [company/team].
>
> If you're able to share any feedback on where my profile fell short, I'd find it genuinely useful. I'm looking to continue improving and any specific perspective would be appreciated.
>
> I understand if that's not something you're able to share, and I wish the team well either way."

Keep it short. No pressure. No request for a second chance. No bitterness.

## What Kind of Feedback You Might Get

**Useful feedback** (rare but possible):
- "The team felt you didn't have enough direct experience with [specific domain]"
- "There were concerns about the scope mismatch — this role needed someone managing larger teams than you've led"
- "Another candidate had a more specific background in [area]"

**Non-feedback feedback** (common):
- "We went with another candidate who was a slightly stronger fit" (tells you nothing)
- "It was a very difficult decision and you were a strong candidate" (meaningless)

Take useful feedback seriously. Discard the boilerplate.

## What Not to Do

- Don't push back on the decision or try to change their mind
- Don't ask detailed questions about the other candidate
- Don't send multiple follow-up emails if you don't hear back
- Don't express frustration or disappointment in a way that burns the bridge

This is a small industry. The hiring manager who rejected you today is a potential colleague, reference, or employer in 3 years.
`,
  },

  {
    id: "rejected-staying-positive",
    title: "Maintaining Momentum After Rejection",
    phases: ["rejected"],
    category: "Mindset",
    summary:
      "Rejection is a structural feature of job searching, not a measure of your worth. Here's how to stay focused and keep moving.",
    content: `## The Structural Reality

Even exceptional candidates get rejected regularly. The factors that determine hiring decisions include things that have nothing to do with you:
- Internal candidates emerged
- The role was frozen or re-scoped
- Budget changed
- The team dynamic shifted
- Two equally qualified candidates, one slightly different

You cannot control most of what happens in a hiring decision. You can only control the quality of your preparation and the consistency of your effort.

## What Rejection Actually Tells You

A rejection from a final round tells you that you were good enough to advance through multiple rounds but lost to one other person (or an internal candidate). That's genuinely useful context — you're in the right range, the funnel is working.

A rejection from a phone screen tells you there may be a mismatch in how you're presenting your background — worth investigating.

A pattern of rejections at the same stage tells you where to focus improvement.

## Practical Strategies for Maintaining Momentum

**Keep the funnel full**
The emotional stability of a job search is directly correlated with having multiple active opportunities. When you have one live application, every rejection is devastating. When you have twelve, each rejection is manageable data.

**Debrief after every stage**
Within 2 hours of any interview (pass or fail), write a brief note: what went well, what felt uncertain, what you'd do differently. This converts experience into learning faster than waiting until you remember.

**Set activity targets, not outcome targets**
You can't control whether you get an offer. You can control:
- 3 new applications per week
- 2 networking reach-outs per week
- 1 informational interview per month
- 30 minutes of prep per day

Hitting your activity targets when outcomes are uncertain is how you maintain agency.

**Take real breaks**
Job searching is cognitively demanding work. Schedule time off from it — evenings and weekends where you're genuinely not in "search mode." Burnout produces worse applications and worse interviews.

## The Long Game

At senior levels, a job search of 3–6 months is completely normal. The right role takes time to find and the process moves slowly. Patience is part of the skillset.
`,
  },

  {
    id: "rejected-reapplying",
    title: "When and How to Re-Apply to a Company",
    phases: ["rejected"],
    category: "Strategy",
    summary:
      "Being rejected once doesn't close the door permanently. Here's how to assess whether re-applying makes sense and how to do it right.",
    content: `## When Re-Applying Makes Sense

Re-applying to a company that previously rejected you can absolutely work — under the right conditions:

**Time has passed (12–18 months minimum)**
The people who made the previous decision have moved on, the role priorities have shifted, or you've accumulated meaningful new experience. Earlier than 12 months and you risk appearing like you're not respecting the previous decision.

**You have materially new credentials**
You've shipped something significant, moved into a new level, gained specific domain experience they wanted, or published work that establishes your expertise.

**The rejection was close**
"We went with another candidate, you were our second choice" is different from "we have concerns about your experience in [critical area]." The former is worth revisiting; the latter requires addressing the gap first.

**The role is genuinely different**
If a new role opens that's different from what you applied for — different team, different scope, different function — that's a fresh application, not a re-application.

## How to Re-Apply Strategically

**Don't pretend the previous application didn't happen**
Acknowledge it briefly in your cover letter or initial contact: "I applied for [role] in [year] and wasn't the right fit at the time. Since then, [specific developments]."

This is professional and signals self-awareness. Trying to act like it's your first contact will be noticed.

**Address whatever caused the previous rejection**
If you have any sense of where you fell short, lead with evidence that closes that gap. If you don't know, the cover letter approach above ("since then, I've...") does this implicitly.

**Leverage any relationships you've built**
If you stayed in touch with anyone from the company after the rejection — even a brief LinkedIn follow or a conference conversation — that relationship is now an asset. Reconnect before re-applying.

**Target a different entry point**
If the same hiring manager who rejected you is still in place, try to get into the process through a referral from someone else on the team rather than cold-applying again. Changing the entry point changes the context.

## Maintaining the Relationship in the Meantime

The best re-applications come from candidates who never fully disengaged:
- Commented thoughtfully on the company's LinkedIn posts
- Connected briefly with employees you met during the process
- Followed the company's developments and referenced them when reconnecting

This is a long game. Play it with genuine interest, not strategic calculation.
`,
  },
];

export function getGuidesForPhase(phase: PipelinePhase): Guide[] {
  return guides.filter((g) => g.phases.includes(phase));
}

export function getCategories(guideList: Guide[]): string[] {
  return [...new Set(guideList.map((g) => g.category))];
}
