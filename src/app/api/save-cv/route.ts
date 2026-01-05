import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobDescription, generatedCv, modelUsed } = await request.json();

    if (!generatedCv) {
      return NextResponse.json(
        { error: "Missing generated CV" },
        { status: 400 }
      );
    }

    const db = getDb();

    await db.insert(cvGenerations).values({
      userId: session.user.id,
      jobDescription,
      generatedCv,
      modelUsed,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving CV:", error);
    return NextResponse.json(
      { error: "Failed to save CV" },
      { status: 500 }
    );
  }
}
