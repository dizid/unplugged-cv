import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, userProfiles } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, session.user.id))
      .limit(1);

    if (!profile) {
      // Create profile if it doesn't exist
      const [newProfile] = await db
        .insert(userProfiles)
        .values({
          id: session.user.id,
          hasPaid: false,
          applicationCount: 0,
        })
        .returning();

      return NextResponse.json({
        careerBackground: null,
        hasPaid: false,
        applicationCount: 0,
      });
    }

    return NextResponse.json({
      careerBackground: profile.careerBackground,
      hasPaid: profile.hasPaid,
      applicationCount: profile.applicationCount,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { careerBackground } = await request.json();

    const db = getDb();

    // Upsert profile
    const [existing] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, session.user.id))
      .limit(1);

    if (existing) {
      await db
        .update(userProfiles)
        .set({
          careerBackground,
          careerBackgroundUpdatedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.id, session.user.id));
    } else {
      await db.insert(userProfiles).values({
        id: session.user.id,
        careerBackground,
        careerBackgroundUpdatedAt: new Date(),
        hasPaid: false,
        applicationCount: 0,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
