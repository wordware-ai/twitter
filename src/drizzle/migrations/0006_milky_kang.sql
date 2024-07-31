ALTER TABLE "users" ADD COLUMN "unlocked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "unlock_type" text;