import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

// User profiles - extends Neon Auth users with app-specific data
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey(), // matches Neon Auth user id
  hasPaid: boolean("has_paid").default(false).notNull(),
  careerBackground: text("career_background"),
  careerBackgroundUpdatedAt: timestamp("career_background_updated_at"),
  applicationCount: integer("application_count").default(0).notNull(),
  // Subscription fields
  subscriptionStatus: text("subscription_status").default("free"), // free, active, canceled, past_due
  subscriptionTier: text("subscription_tier"), // basic, pro
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// CV generations / Applications
export const cvGenerations = pgTable("cv_generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id),
  jobDescription: text("job_description"),
  generatedCv: text("generated_cv"),
  modelUsed: text("model_used"),
  title: text("title"),
  slug: text("slug").unique(),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Application-specific fields
  jobTitle: text("job_title"),
  companyName: text("company_name"),
  jobUrl: text("job_url"),
  parsedJob: text("parsed_job"), // JSON string
  coverLetter: text("cover_letter"),
  matchScore: integer("match_score"),
  matchDetails: text("match_details"), // JSON string
  status: text("status").default("draft").notNull(),
  appliedAt: timestamp("applied_at"),
  notes: text("notes"),
  // Tracking fields
  nextAction: text("next_action"),
  nextActionDueAt: timestamp("next_action_due_at"),
  priority: integer("priority").default(0), // 0=normal, 1=high, 2=urgent
  archived: boolean("archived").default(false).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payment records
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => userProfiles.id)
    .notNull(),
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").notNull(),
  status: text("status").notNull(),
  provider: text("provider").notNull(),
  providerPaymentId: text("provider_payment_id"),
  paymentType: text("payment_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Application events / timeline
export const applicationEvents = pgTable("application_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .references(() => cvGenerations.id, { onDelete: "cascade" })
    .notNull(),
  eventType: text("event_type").notNull(), // status_change, note_added, interview_scheduled, reminder_created
  fromStatus: text("from_status"),
  toStatus: text("to_status"),
  metadata: text("metadata"), // JSON for flexible event data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Interview tracking
export const interviews = pgTable("interviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id")
    .references(() => cvGenerations.id, { onDelete: "cascade" })
    .notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  interviewType: text("interview_type").notNull(), // phone, video, onsite, technical, behavioral
  interviewerName: text("interviewer_name"),
  interviewerRole: text("interviewer_role"),
  location: text("location"), // zoom link, address, phone number
  notes: text("notes"),
  prepNotes: text("prep_notes"),
  outcome: text("outcome"), // pending, passed, failed, rescheduled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Reminders / Next actions
export const reminders = pgTable("reminders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => userProfiles.id)
    .notNull(),
  applicationId: uuid("application_id").references(() => cvGenerations.id, {
    onDelete: "cascade",
  }),
  reminderType: text("reminder_type").notNull(), // follow_up, interview_prep, deadline, custom
  title: text("title").notNull(),
  dueAt: timestamp("due_at").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Type exports
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type CvGeneration = typeof cvGenerations.$inferSelect;
export type NewCvGeneration = typeof cvGenerations.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type ApplicationEvent = typeof applicationEvents.$inferSelect;
export type NewApplicationEvent = typeof applicationEvents.$inferInsert;
export type Interview = typeof interviews.$inferSelect;
export type NewInterview = typeof interviews.$inferInsert;
export type Reminder = typeof reminders.$inferSelect;
export type NewReminder = typeof reminders.$inferInsert;
