import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations, applicationEvents } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    // Verify ownership of the application
    const [app] = await db
      .select()
      .from(cvGenerations)
      .where(
        and(eq(cvGenerations.id, id), eq(cvGenerations.userId, session.user.id))
      )
      .limit(1);

    if (!app) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get all events for this application, newest first
    const events = await db
      .select()
      .from(applicationEvents)
      .where(eq(applicationEvents.applicationId, id))
      .orderBy(desc(applicationEvents.createdAt));

    // Parse metadata JSON for each event
    const parsedEvents = events.map((event) => ({
      ...event,
      metadata: event.metadata ? JSON.parse(event.metadata) : null,
    }));

    return NextResponse.json(parsedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
