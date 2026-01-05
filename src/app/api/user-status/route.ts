import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, userProfiles } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ hasPaid: false });
    }

    const db = getDb();

    const profile = await db
      .select({ hasPaid: userProfiles.hasPaid })
      .from(userProfiles)
      .where(eq(userProfiles.id, session.user.id))
      .limit(1);

    return NextResponse.json({
      hasPaid: profile[0]?.hasPaid || false,
    });
  } catch (error) {
    console.error("Error fetching user status:", error);
    return NextResponse.json({ hasPaid: false });
  }
}
