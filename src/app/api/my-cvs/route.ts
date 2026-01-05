import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations } from "@/lib/db";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    const cvs = await db
      .select({
        id: cvGenerations.id,
        title: cvGenerations.title,
        slug: cvGenerations.slug,
        isPublished: cvGenerations.isPublished,
        createdAt: cvGenerations.createdAt,
      })
      .from(cvGenerations)
      .where(eq(cvGenerations.userId, session.user.id))
      .orderBy(desc(cvGenerations.createdAt));

    return NextResponse.json({ cvs });
  } catch (error) {
    console.error("Error fetching CVs:", error);
    return NextResponse.json({ error: "Failed to fetch CVs" }, { status: 500 });
  }
}
