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
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// CV generations
export const cvGenerations = pgTable("cv_generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id),
  jobDescription: text("job_description"),
  generatedCv: text("generated_cv").notNull(),
  modelUsed: text("model_used").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
