import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations, userProfiles } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    const { jobDescription, generatedCv, modelUsed, testMode } = await request.json();

    // Test mode bypass for development
    const isTestMode = testMode === "test123";
    const testUserId = "test-user-00000000-0000-0000-0000-000000000000";

    if (!session?.user && !isTestMode) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session?.user?.id || testUserId;

    if (!generatedCv) {
      return NextResponse.json(
        { error: "Missing generated CV" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Ensure user profile exists (required for foreign key)
    const existingProfile = await db
      .select({ id: userProfiles.id })
      .from(userProfiles)
      .where(eq(userProfiles.id, userId))
      .limit(1);

    if (existingProfile.length === 0) {
      await db.insert(userProfiles).values({ id: userId });
    }

    const result = await db
      .insert(cvGenerations)
      .values({
        userId,
        jobDescription,
        generatedCv,
        modelUsed,
      })
      .returning({ id: cvGenerations.id });

    return NextResponse.json({ success: true, id: result[0]?.id });
  } catch (error) {
    console.error("Error saving CV:", error);
    return NextResponse.json(
      { error: "Failed to save CV" },
      { status: 500 }
    );
  }
}
