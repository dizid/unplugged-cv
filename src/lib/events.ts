import { getDb, applicationEvents } from "./db";

export type EventType =
  | "status_change"
  | "note_added"
  | "interview_scheduled"
  | "interview_updated"
  | "reminder_created"
  | "application_created";

interface LogEventParams {
  applicationId: string;
  eventType: EventType;
  fromStatus?: string;
  toStatus?: string;
  metadata?: Record<string, unknown>;
}

export async function logApplicationEvent({
  applicationId,
  eventType,
  fromStatus,
  toStatus,
  metadata,
}: LogEventParams) {
  const db = getDb();
  await db.insert(applicationEvents).values({
    applicationId,
    eventType,
    fromStatus,
    toStatus,
    metadata: metadata ? JSON.stringify(metadata) : null,
  });
}
