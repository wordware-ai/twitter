ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "unlocked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "unlock_type" text;