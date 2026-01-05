import Anthropic from "@anthropic-ai/sdk";
import {
  JOB_PARSER_SYSTEM_PROMPT,
  JOB_PARSER_USER_PROMPT,
  JOB_PARSER_MODEL_CONFIG,
} from "@/lib/prompts-job";

export const runtime = "edge";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ParsedJob {
  title: string;
  company: string | null;
  location: string | null;
  workMode: "remote" | "hybrid" | "onsite" | "unclear";
  seniorityLevel: "junior" | "mid" | "senior" | "lead" | "executive" | "unclear";

  requirements: {
    mustHave: Array<{
      skill: string;
      years: string | null;
      context: string | null;
    }>;
    niceToHave: Array<{
      skill: string;
      years: string | null;
      context: string | null;
    }>;
    experience: string;
    education: string | null;
  };

  compensation: {
    salary: { min: number; max: number; currency: string } | null;
    benefits: string[] | null;
    equity: string | null;
  } | null;

  signals: {
    teamSize: string | null;
    reportsTo: string | null;
    autonomy: "low" | "medium" | "high" | "unclear";
    techStack: string[];
    industryDomain: string | null;
  };

  redFlags: Array<{
    flag: string;
    quote: string;
    severity: "low" | "medium" | "high";
  }>;

  highlights: string[];
  summary: string;
}

export async function POST(request: Request) {
  try {
    const { jobDescription } = await request.json();

    if (
      !jobDescription ||
      typeof jobDescription !== "string" ||
      jobDescription.trim().length < 50
    ) {
      return new Response(
        JSON.stringify({
          error: "Please provide a job description (at least 50 characters)",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await anthropic.messages.create({
      ...JOB_PARSER_MODEL_CONFIG,
      system: JOB_PARSER_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: JOB_PARSER_USER_PROMPT(jobDescription),
        },
      ],
    });

    // Extract text content
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from AI");
    }

    // Parse JSON response
    let parsed: ParsedJob;
    try {
      // Handle potential markdown code blocks
      let jsonText = textContent.text.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
      }
      parsed = JSON.parse(jsonText);
    } catch {
      console.error("Failed to parse AI response:", textContent.text);
      throw new Error("Failed to parse job analysis");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Job parsing error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to analyze job";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
