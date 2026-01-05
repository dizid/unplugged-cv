import Anthropic from "@anthropic-ai/sdk";
import type { ParsedJob } from "../parse-job/route";
import type { MatchResult } from "../match-score/route";

export const runtime = "edge";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const COVER_LETTER_SYSTEM_PROMPT = `You are an expert cover letter writer who creates compelling, evidence-based cover letters for senior professionals.

## YOUR APPROACH

You write cover letters that are:
1. **Specific** - Reference actual experience from the CV, not generic claims
2. **Evidence-based** - Connect the candidate's achievements to the job requirements
3. **Honest about gaps** - If there are skill gaps, address them proactively
4. **Company-focused** - Show genuine understanding of what the company needs
5. **Concise** - 3-4 paragraphs max, no fluff

## STRUCTURE

**Opening (2-3 sentences)**
- Hook: Why THIS company/role specifically interests them
- Use signals from the job description (company culture, mission, product)
- No "I am writing to apply for..." clichés

**Body 1: Core Value Proposition (3-4 sentences)**
- Lead with strongest relevant achievement
- Connect directly to their key requirements
- Use specific numbers/outcomes from the CV

**Body 2: Secondary Strengths + Gap Handling (3-4 sentences)**
- Cover additional relevant experience
- If there are gaps, address them honestly:
  - "While I haven't worked directly with X, my experience with Y demonstrates..."
  - Or show how they're actively learning the missing skill

**Closing (2-3 sentences)**
- Specific value they'll bring (not generic enthusiasm)
- Clear call to action
- No "I look forward to hearing from you" clichés

## RULES

- Never invent experience not in the CV
- Never use generic phrases like "passionate about" or "excited to join"
- Never start sentences with "I"
- Keep it under 400 words
- Write in a confident but not arrogant tone
- Match the formality level to the company culture (startup = casual, enterprise = formal)

## OUTPUT FORMAT

Return ONLY the cover letter text in markdown format. No explanations, no metadata.`;

interface CoverLetterRequest {
  cv: string;
  parsedJob: ParsedJob;
  matchResult?: MatchResult;
}

export async function POST(request: Request) {
  try {
    const { cv, parsedJob, matchResult } = await request.json() as CoverLetterRequest;

    if (!cv || typeof cv !== "string" || cv.trim().length < 100) {
      return new Response(
        JSON.stringify({ error: "CV content is required (at least 100 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!parsedJob || !parsedJob.title) {
      return new Response(
        JSON.stringify({ error: "Parsed job data is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build context for the prompt
    let userPrompt = `## The Job

**Title**: ${parsedJob.title}
${parsedJob.company ? `**Company**: ${parsedJob.company}` : ""}
${parsedJob.seniorityLevel !== "unclear" ? `**Level**: ${parsedJob.seniorityLevel}` : ""}

**Key Requirements**:
${parsedJob.requirements.mustHave.map(r => `- ${r.skill}${r.years ? ` (${r.years})` : ""}`).join("\n")}

**Nice to Have**:
${parsedJob.requirements.niceToHave.map(r => `- ${r.skill}`).join("\n") || "None specified"}

**Company Signals**:
${parsedJob.signals.teamSize ? `- Team size: ${parsedJob.signals.teamSize}` : ""}
${parsedJob.signals.autonomy !== "unclear" ? `- Autonomy level: ${parsedJob.signals.autonomy}` : ""}
${parsedJob.signals.industryDomain ? `- Industry: ${parsedJob.signals.industryDomain}` : ""}
${parsedJob.signals.techStack.length > 0 ? `- Tech stack: ${parsedJob.signals.techStack.join(", ")}` : ""}

**Job Summary**: ${parsedJob.summary}

## The Candidate's CV

${cv}`;

    // Add match result context if available
    if (matchResult) {
      userPrompt += `

## Match Analysis

**Match Score**: ${matchResult.score}%
**Summary**: ${matchResult.summary}

**Strengths to Highlight**:
${matchResult.skillMatches.filter(s => s.matched).map(s => `- ${s.skill}: ${s.evidence || "Demonstrated"}`).join("\n")}

**Gaps to Address**:
${matchResult.gaps.map(g => `- ${g}`).join("\n") || "None significant"}

**Talking Points**:
${matchResult.talkingPoints.map(t => `- ${t}`).join("\n")}`;
    }

    userPrompt += `

---

Write a compelling cover letter for this candidate applying to this role. Return ONLY the cover letter text.`;

    // Stream the response
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      temperature: 0.7,
      system: COVER_LETTER_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    // Create a streaming response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Cover letter generation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate cover letter";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
