import { NextRequest, NextResponse } from "next/server";
import { guides, getGuidesForPhase, type PipelinePhase } from "@/lib/guides";

export const dynamic = "force-static";

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phase = searchParams.get("phase") as PipelinePhase | null;

  const result = phase ? getGuidesForPhase(phase) : guides;

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
