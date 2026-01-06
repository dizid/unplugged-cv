import { NextResponse } from "next/server";
import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations } from "@/lib/db";
import { eq, and } from "drizzle-orm";

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

    await db
      .update(cvGenerations)
      .set(updateData)
      .where(eq(cvGenerations.id, id));

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
