CREATE TABLE "application_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"from_status" text,
	"to_status" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_generations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"job_description" text,
	"generated_cv" text,
	"model_used" text,
	"title" text,
	"slug" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"job_title" text,
	"company_name" text,
	"job_url" text,
	"parsed_job" text,
	"cover_letter" text,
	"match_score" integer,
	"match_details" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"applied_at" timestamp,
	"notes" text,
	"next_action" text,
	"next_action_due_at" timestamp,
	"priority" integer DEFAULT 0,
	"archived" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cv_generations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"interview_type" text NOT NULL,
	"interviewer_name" text,
	"interviewer_role" text,
	"location" text,
	"notes" text,
	"prep_notes" text,
	"outcome" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"provider" text NOT NULL,
	"provider_payment_id" text,
	"payment_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"application_id" uuid,
	"reminder_type" text NOT NULL,
	"title" text NOT NULL,
	"due_at" timestamp NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"has_paid" boolean DEFAULT false NOT NULL,
	"career_background" text,
	"career_background_updated_at" timestamp,
	"application_count" integer DEFAULT 0 NOT NULL,
	"subscription_status" text DEFAULT 'free',
	"subscription_tier" text,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"subscription_ends_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_application_id_cv_generations_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."cv_generations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv_generations" ADD CONSTRAINT "cv_generations_user_id_user_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_cv_generations_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."cv_generations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_user_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_user_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_application_id_cv_generations_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."cv_generations"("id") ON DELETE cascade ON UPDATE no action;