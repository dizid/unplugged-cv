import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations, userProfiles } from "@/lib/db";
import { eq } from "drizzle-orm";

const FREE_LIMIT = 3;

export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobDescription, parsedJob, background, generatedCv, testMode } =
      await request.json();

    const db = getDb();

    // Get or create user profile
    let [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, session.user.id))
      .limit(1);

    if (!profile) {
      [profile] = await db
        .insert(userProfiles)
        .values({
          id: session.user.id,
          hasPaid: false,
          applicationCount: 0,
        })
        .returning();
    }

    // Check limits (with test mode bypass)
    const isTestMode = testMode === "test123";
    const appCount = profile.applicationCount || 0;

    if (!isTestMode && !profile.hasPaid && appCount >= FREE_LIMIT) {
      return NextResponse.json(
        { error: "Free limit reached. Upgrade to Pro for unlimited applications." },
        { status: 403 }
      );
    }

    // Save background to profile if provided
    if (background) {
      await db
        .update(userProfiles)
        .set({
          careerBackground: background,
          careerBackgroundUpdatedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.id, session.user.id));
    }

    // Create the application
    const [app] = await db
      .insert(cvGenerations)
      .values({
        userId: session.user.id,
        jobDescription,
        jobTitle: parsedJob?.jobTitle || null,
        companyName: parsedJob?.company || null,
        parsedJob: parsedJob ? JSON.stringify(parsedJob) : null,
        generatedCv: generatedCv || null,
        modelUsed: "claude-sonnet-4-20250514",
        status: "draft",
      })
      .returning();

    // Increment application count
    await db
      .update(userProfiles)
      .set({
        applicationCount: appCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.id, session.user.id));

    return NextResponse.json({ id: app.id, success: true });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
