import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations, userProfiles } from "@/lib/db";
import { eq, and, sql } from "drizzle-orm";
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

    return NextResponse.json(app);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
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

    // Verify ownership
    const [existing] = await db
      .select()
      .from(cvGenerations)
      .where(
        and(eq(cvGenerations.id, id), eq(cvGenerations.userId, session.user.id))
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Build update object with allowed fields
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.jobTitle !== undefined) updateData.jobTitle = body.jobTitle;
    if (body.companyName !== undefined) updateData.companyName = body.companyName;
    if (body.appliedAt !== undefined) updateData.appliedAt = body.appliedAt ? new Date(body.appliedAt) : null;
    if (body.generatedCv !== undefined) updateData.generatedCv = body.generatedCv;
    if (body.coverLetter !== undefined) updateData.coverLetter = body.coverLetter;
    if (body.nextAction !== undefined) updateData.nextAction = body.nextAction;
    if (body.nextActionDueAt !== undefined) updateData.nextActionDueAt = body.nextActionDueAt ? new Date(body.nextActionDueAt) : null;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.archived !== undefined) updateData.archived = body.archived;

    await db
      .update(cvGenerations)
      .set(updateData)
      .where(eq(cvGenerations.id, id));

    // Log status change event
    if (body.status !== undefined && body.status !== existing.status) {
      await logApplicationEvent({
        applicationId: id,
        eventType: "status_change",
        fromStatus: existing.status,
        toStatus: body.status,
      });
    }

    // Log note added event
    if (body.notes !== undefined && body.notes !== existing.notes && body.notes) {
      await logApplicationEvent({
        applicationId: id,
        eventType: "note_added",
        metadata: { noteLength: body.notes.length },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { error: "Failed to update application" },
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
    const db = getDb();

    // Verify ownership
    const [existing] = await db
      .select()
      .from(cvGenerations)
      .where(
        and(eq(cvGenerations.id, id), eq(cvGenerations.userId, session.user.id))
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await db.delete(cvGenerations).where(eq(cvGenerations.id, id));

    // Decrement application count
    await db
      .update(userProfiles)
      .set({
        applicationCount: sql`GREATEST(${userProfiles.applicationCount} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
