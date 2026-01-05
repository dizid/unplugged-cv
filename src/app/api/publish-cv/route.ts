import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations, userProfiles } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cvId, slug } = await request.json();

    if (!cvId || !slug) {
      return NextResponse.json(
        { error: "Missing cvId or slug" },
        { status: 400 }
      );
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]{3,50}$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          error:
            "Slug must be 3-50 characters, lowercase letters, numbers, and hyphens only",
        },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check if user has paid
    const profile = await db
      .select({ hasPaid: userProfiles.hasPaid })
      .from(userProfiles)
      .where(eq(userProfiles.id, session.user.id))
      .limit(1);

    if (!profile[0]?.hasPaid) {
      return NextResponse.json(
        { error: "Premium subscription required" },
        { status: 403 }
      );
    }

    // Verify user owns this CV
    const cv = await db
      .select({ id: cvGenerations.id })
      .from(cvGenerations)
      .where(
        and(
          eq(cvGenerations.id, cvId),
          eq(cvGenerations.userId, session.user.id)
        )
      )
      .limit(1);

    if (!cv[0]) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Check if slug is already taken
    const existingSlug = await db
      .select({ id: cvGenerations.id })
      .from(cvGenerations)
      .where(eq(cvGenerations.slug, slug))
      .limit(1);

    if (existingSlug[0] && existingSlug[0].id !== cvId) {
      return NextResponse.json(
        { error: "This URL is already taken. Try another one." },
        { status: 409 }
      );
    }

    // Update CV with slug and publish status
    await db
      .update(cvGenerations)
      .set({
        slug,
        isPublished: true,
      })
      .where(eq(cvGenerations.id, cvId));

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://unplugged.cv";
    const url = `${baseUrl}/cv/${slug}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Error publishing CV:", error);
    return NextResponse.json(
      { error: "Failed to publish CV" },
      { status: 500 }
    );
  }
}
