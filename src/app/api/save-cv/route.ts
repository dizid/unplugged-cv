import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations, userProfiles } from "@/lib/db";
import { eq } from "drizzle-orm";

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

    // Ensure user profile exists (required for foreign key)
    const existingProfile = await db
      .select({ id: userProfiles.id })
      .from(userProfiles)
      .where(eq(userProfiles.id, session.user.id))
      .limit(1);

    if (existingProfile.length === 0) {
      await db.insert(userProfiles).values({ id: session.user.id });
    }

    const result = await db
      .insert(cvGenerations)
      .values({
        userId: session.user.id,
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
