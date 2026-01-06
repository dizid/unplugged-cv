import { notFound, redirect } from "next/navigation";
import { authServer } from "@/lib/auth/server";
import { getDb, cvGenerations, userProfiles } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { ApplicationDetail } from "@/components/application";

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = await authServer.getSession();

  if (!session?.user) {
    redirect("/");
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
    notFound();
  }

  const [profile] = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.id, session.user.id))
    .limit(1);

  const hasPaid = profile?.hasPaid || false;

  return <ApplicationDetail application={app} hasPaid={hasPaid} />;
}
