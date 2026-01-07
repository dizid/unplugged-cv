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

    const { jobDescription, parsedJob, jobTitle, companyName, background, generatedCv, testMode } =
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

    // Check limits (with test mode bypass - set TEST_MODE_SECRET env var)
    const isTestMode = process.env.TEST_MODE_SECRET && testMode === process.env.TEST_MODE_SECRET;
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

    // Create application first, then increment counter
    // Note: neon-http driver doesn't support transactions, so we do this sequentially
    // If app creation succeeds but counter fails, user just has an uncounted app (not blocking)
    const [app] = await db
      .insert(cvGenerations)
      .values({
        userId: session.user.id,
        jobDescription,
        jobTitle: jobTitle || parsedJob?.title || null,
        companyName: companyName || parsedJob?.company || null,
        parsedJob: parsedJob ? JSON.stringify(parsedJob) : null,
        generatedCv: generatedCv || null,
        modelUsed: "claude-sonnet-4-20250514",
        status: "draft",
      })
      .returning();

    // Increment application count (best effort - app is already created)
    await db
      .update(userProfiles)
      .set({
        applicationCount: appCount + 1,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.id, session.user.id));

    const result = app;

    return NextResponse.json({ id: result.id, success: true });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}
