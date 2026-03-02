import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, reminders, cvGenerations } from "@/lib/db";
import { eq, and, desc, asc, lte, gte } from "drizzle-orm";
import { logApplicationEvent } from "@/lib/events";

export async function GET(request: Request) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");
    const includeCompleted = searchParams.get("includeCompleted") === "true";
    const dueBefore = searchParams.get("dueBefore");
    const dueAfter = searchParams.get("dueAfter");

    const db = getDb();

    // Build query conditions
    const conditions = [eq(reminders.userId, session.user.id)];

    if (applicationId) {
      conditions.push(eq(reminders.applicationId, applicationId));
    }

    if (!includeCompleted) {
      conditions.push(eq(reminders.isCompleted, false));
    }

    if (dueBefore) {
      conditions.push(lte(reminders.dueAt, new Date(dueBefore)));
    }

    if (dueAfter) {
      conditions.push(gte(reminders.dueAt, new Date(dueAfter)));
    }

    // Get reminders with application info
    const reminderList = await db
      .select({
        reminder: reminders,
        application: {
          id: cvGenerations.id,
          jobTitle: cvGenerations.jobTitle,
          companyName: cvGenerations.companyName,
        },
      })
      .from(reminders)
      .leftJoin(cvGenerations, eq(reminders.applicationId, cvGenerations.id))
      .where(and(...conditions))
      .orderBy(asc(reminders.dueAt));

    // Flatten the result
    const result = reminderList.map((r) => ({
      ...r.reminder,
      application: r.application,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return NextResponse.json(
      { error: "Failed to fetch reminders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const db = getDb();

    // Validate required fields
    if (!body.title || !body.dueAt || !body.reminderType) {
      return NextResponse.json(
        { error: "title, dueAt, and reminderType are required" },
        { status: 400 }
      );
    }

    // If applicationId provided, verify ownership
    if (body.applicationId) {
      const [app] = await db
        .select()
        .from(cvGenerations)
        .where(
          and(
            eq(cvGenerations.id, body.applicationId),
            eq(cvGenerations.userId, session.user.id)
          )
        )
        .limit(1);

      if (!app) {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }
    }

    // Create the reminder
    const [newReminder] = await db
      .insert(reminders)
      .values({
        userId: session.user.id,
        applicationId: body.applicationId || null,
        reminderType: body.reminderType,
        title: body.title,
        dueAt: new Date(body.dueAt),
      })
      .returning();

    // Log event if tied to an application
    if (body.applicationId) {
      await logApplicationEvent({
        applicationId: body.applicationId,
        eventType: "reminder_created",
        metadata: {
          reminderId: newReminder.id,
          title: body.title,
          dueAt: body.dueAt,
        },
      });
    }

    return NextResponse.json(newReminder);
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { error: "Failed to create reminder" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Reminder ID required" }, { status: 400 });
    }

    const db = getDb();

    // Verify ownership
    const [existing] = await db
      .select()
      .from(reminders)
      .where(and(eq(reminders.id, body.id), eq(reminders.userId, session.user.id)))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.isCompleted !== undefined) {
      updateData.isCompleted = body.isCompleted;
      updateData.completedAt = body.isCompleted ? new Date() : null;
    }
    if (body.title !== undefined) updateData.title = body.title;
    if (body.dueAt !== undefined) updateData.dueAt = new Date(body.dueAt);

    const [updated] = await db
      .update(reminders)
      .set(updateData)
      .where(eq(reminders.id, body.id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating reminder:", error);
    return NextResponse.json({ error: "Failed to update reminder" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Reminder ID required" }, { status: 400 });
    }

    const db = getDb();

    // Verify ownership and delete
    const [deleted] = await db
      .delete(reminders)
      .where(and(eq(reminders.id, id), eq(reminders.userId, session.user.id)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json({ error: "Failed to delete reminder" }, { status: 500 });
  }
}
