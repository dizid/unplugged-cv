import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations, interviews } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import { logApplicationEvent } from "@/lib/events";

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

    // Get all interviews for this application
    const interviewList = await db
      .select()
      .from(interviews)
      .where(eq(interviews.applicationId, id))
      .orderBy(desc(interviews.scheduledAt));

    return NextResponse.json(interviewList);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch interviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
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

    // Validate required fields
    if (!body.scheduledAt || !body.interviewType) {
      return NextResponse.json(
        { error: "scheduledAt and interviewType are required" },
        { status: 400 }
      );
    }

    // Create the interview
    const [newInterview] = await db
      .insert(interviews)
      .values({
        applicationId: id,
        scheduledAt: new Date(body.scheduledAt),
        interviewType: body.interviewType,
        interviewerName: body.interviewerName || null,
        interviewerRole: body.interviewerRole || null,
        location: body.location || null,
        notes: body.notes || null,
        prepNotes: body.prepNotes || null,
        outcome: body.outcome || "pending",
      })
      .returning();

    // Log the event
    await logApplicationEvent({
      applicationId: id,
      eventType: "interview_scheduled",
      metadata: {
        interviewId: newInterview.id,
        interviewType: body.interviewType,
        scheduledAt: body.scheduledAt,
      },
    });

    return NextResponse.json(newInterview);
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const db = getDb();

    if (!body.interviewId) {
      return NextResponse.json(
        { error: "interviewId is required" },
        { status: 400 }
      );
    }

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

    // Build update object
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.scheduledAt !== undefined) updateData.scheduledAt = new Date(body.scheduledAt);
    if (body.interviewType !== undefined) updateData.interviewType = body.interviewType;
    if (body.interviewerName !== undefined) updateData.interviewerName = body.interviewerName;
    if (body.interviewerRole !== undefined) updateData.interviewerRole = body.interviewerRole;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.prepNotes !== undefined) updateData.prepNotes = body.prepNotes;
    if (body.outcome !== undefined) updateData.outcome = body.outcome;

    const [updated] = await db
      .update(interviews)
      .set(updateData)
      .where(
        and(
          eq(interviews.id, body.interviewId),
          eq(interviews.applicationId, id)
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Log the event if outcome changed
    if (body.outcome !== undefined) {
      await logApplicationEvent({
        applicationId: id,
        eventType: "interview_updated",
        metadata: {
          interviewId: body.interviewId,
          outcome: body.outcome,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating interview:", error);
    return NextResponse.json(
      { error: "Failed to update interview" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const interviewId = searchParams.get("interviewId");
    const db = getDb();

    if (!interviewId) {
      return NextResponse.json(
        { error: "interviewId is required" },
        { status: 400 }
      );
    }

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

    await db
      .delete(interviews)
      .where(
        and(
          eq(interviews.id, interviewId),
          eq(interviews.applicationId, id)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting interview:", error);
    return NextResponse.json(
      { error: "Failed to delete interview" },
      { status: 500 }
    );
  }
}
