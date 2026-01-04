import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, USER_PROMPT_TEMPLATE, MODEL_CONFIG } from "@/lib/prompts";

export const runtime = "edge";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { background, jobDescription } = await request.json();

    if (!background || typeof background !== "string" || background.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Please provide more information about your background" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create streaming response
    const stream = await anthropic.messages.stream({
      ...MODEL_CONFIG,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: USER_PROMPT_TEMPLATE(background, jobDescription),
        },
      ],
    });

    // Convert to ReadableStream for streaming response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text;
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Generation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate CV";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
