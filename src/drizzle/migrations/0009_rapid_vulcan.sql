ALTER TABLE "users" ADD COLUMN "paid_wordware_started" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "paid_wordware_started_time" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "paid_wordware_completed" boolean DEFAULT false;