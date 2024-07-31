ALTER TABLE "users" ADD COLUMN "lowercase_username" text ;--> statement-breakpoint
UPDATE "users" SET "lowercase_username" = LOWER("username");--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "lowercase_username" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "lowercase_username_idx" ON "users" USING btree ("lowercase_username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_lowercase_username_unique" UNIQUE("lowercase_username");
