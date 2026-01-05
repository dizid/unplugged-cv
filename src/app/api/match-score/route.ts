import Anthropic from "@anthropic-ai/sdk";
import type { ParsedJob } from "../parse-job/route";

export const runtime = "edge";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface MatchResult {
  score: number; // 0-100
  summary: string;
  skillMatches: Array<{
    skill: string;
    matched: boolean;
    evidence: string | null;
  }>;
  gaps: string[];
  seniorityFit: "under" | "match" | "over";
  seniorityNote: string;
  talkingPoints: string[];
}

const MATCH_SYSTEM_PROMPT = `You are an expert career advisor who analyzes how well a candidate's CV matches a job description.

## YOUR TASK
Given a CV and parsed job requirements, calculate a match score and provide actionable insights.

## SCORING RULES
- Score 0-100 based on how well the CV demonstrates required skills
- Weight "must have" skills heavily (each ~10-15 points)
- Weight "nice to have" skills lightly (each ~3-5 points)
- Consider seniority alignment
- Don't penalize for skills not in the job description

## OUTPUT FORMAT
Return a JSON object with this exact structure:
{
  "score": <number 0-100>,
  "summary": "<1-2 sentence summary of fit>",
  "skillMatches": [
    { "skill": "<skill from job>", "matched": <boolean>, "evidence": "<quote or null>" }
  ],
  "gaps": ["<skill or experience gap>"],
  "seniorityFit": "<under|match|over>",
  "seniorityNote": "<1 sentence about seniority fit>",
  "talkingPoints": ["<interview angle based on strong matches>"]
}

## RULES
- Only return valid JSON, no markdown
- Evidence should be a brief quote or paraphrase from the CV
- Gaps should be specific and actionable
- Talking points should be concrete conversation starters
- Be honest - don't inflate scores`;

export async function POST(request: Request) {
  try {
    const { cv, parsedJob } = await request.json() as {
      cv: string;
      parsedJob: ParsedJob;
    };

    if (!cv || typeof cv !== "string" || cv.trim().length < 100) {
      return new Response(
        JSON.stringify({ error: "CV content is required (at least 100 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!parsedJob || !parsedJob.requirements) {
      return new Response(
        JSON.stringify({ error: "Parsed job data is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build a concise job requirements summary for the prompt
    const jobSummary = {
      title: parsedJob.title,
      seniority: parsedJob.seniorityLevel,
      mustHave: parsedJob.requirements.mustHave.map(r => r.skill),
      niceToHave: parsedJob.requirements.niceToHave.map(r => r.skill),
      experience: parsedJob.requirements.experience,
    };

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      temperature: 0.3, // Low temperature for consistent scoring
      system: MATCH_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `## Job Requirements
${JSON.stringify(jobSummary, null, 2)}

## Candidate CV
${cv}

---

Analyze the match and return JSON only.`,
        },
      ],
    });

    // Extract text content
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from AI");
    }

    // Parse JSON response
    let result: MatchResult;
    try {
      let jsonText = textContent.text.trim();
      // Handle potential markdown code blocks
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
      }
      result = JSON.parse(jsonText);
    } catch {
      console.error("Failed to parse AI response:", textContent.text);
      throw new Error("Failed to parse match analysis");
    }

    // Validate score is in range
    result.score = Math.max(0, Math.min(100, Math.round(result.score)));

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Match score error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to analyze match";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
