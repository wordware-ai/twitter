ALTER TABLE "pairs" ADD COLUMN "unlocked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "pairs" ADD COLUMN "unlock_type" text;