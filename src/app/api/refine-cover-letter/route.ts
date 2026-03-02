import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, userProfiles } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getEffectiveTier } from "@/lib/stripe";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const REFINEMENT_SYSTEM_PROMPT = `You are an expert cover letter editor. You refine existing cover letters based on specific instructions while maintaining the core message and factual accuracy.

Rules:
- Never invent new experience or achievements not in the original
- Keep the same language as the original (Dutch stays Dutch, etc.)
- Maintain professional tone unless specifically asked to change it
- Keep under 400 words unless the instruction requires expansion
- Return ONLY the refined cover letter, no explanations or metadata`;

interface RefineRequest {
  coverLetter: string;
  instruction: string;
  cv?: string;
  parsedJob?: { title?: string; company?: string };
}

export async function POST(request: Request) {
  try {
    // Auth check
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tier check — refinement is a Pro feature
    const db = getDb();
    const [profile] = await db
      .select({ hasPaid: userProfiles.hasPaid, subscriptionStatus: userProfiles.subscriptionStatus })
      .from(userProfiles)
      .where(eq(userProfiles.id, session.user.id))
      .limit(1);

    const tier = getEffectiveTier(profile?.hasPaid || false, profile?.subscriptionStatus);
    if (tier === "free") {
      return NextResponse.json(
        { error: "Pro subscription required for cover letter refinement" },
        { status: 403 }
      );
    }

    const body = await request.json() as RefineRequest;
    const { coverLetter, instruction, cv, parsedJob } = body;

    if (!coverLetter || typeof coverLetter !== "string" || coverLetter.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: "Cover letter is required (at least 50 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!instruction || typeof instruction !== "string" || instruction.trim().length < 3) {
      return new Response(
        JSON.stringify({ error: "Instruction is required (at least 3 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build user prompt
    let userPrompt = `## Current Cover Letter\n${coverLetter}\n\n## Instruction\n${instruction}`;

    if (cv && typeof cv === "string" && cv.trim().length > 0) {
      userPrompt += `\n\n## Candidate's CV\n${cv}`;
    }

    if (parsedJob?.title) {
      const jobLine = parsedJob.company
        ? `${parsedJob.title} at ${parsedJob.company}`
        : parsedJob.title;
      userPrompt += `\n\n## Target Job\n${jobLine}`;
    }

    userPrompt += "\n\nRefine the cover letter according to the instruction. Return ONLY the updated cover letter.";

    // Stream the refined cover letter
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      temperature: 0.6,
      system: REFINEMENT_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

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
    console.error("Cover letter refinement error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to refine cover letter";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
