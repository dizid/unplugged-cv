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

// Type exports
export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;
export type CvGeneration = typeof cvGenerations.$inferSelect;
export type NewCvGeneration = typeof cvGenerations.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
