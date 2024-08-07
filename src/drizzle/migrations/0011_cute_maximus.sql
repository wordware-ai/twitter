CREATE TABLE IF NOT EXISTS "pairs" (
	"id" text PRIMARY KEY DEFAULT concat('pair_', uuid_generate_v4()) NOT NULL,
	"user1_lowercase_username" text NOT NULL,
	"user2_lowercase_username" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"analysis" jsonb,
	"wordware_started" boolean DEFAULT false,
	"wordware_started_time" timestamp DEFAULT now() NOT NULL,
	"wordware_completed" boolean DEFAULT false
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pairs" ADD CONSTRAINT "pairs_user1_lowercase_username_users_lowercase_username_fk" FOREIGN KEY ("user1_lowercase_username") REFERENCES "public"."users"("lowercase_username") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pairs" ADD CONSTRAINT "pairs_user2_lowercase_username_users_lowercase_username_fk" FOREIGN KEY ("user2_lowercase_username") REFERENCES "public"."users"("lowercase_username") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_pair_idx" ON "pairs" USING btree ("user1_lowercase_username","user2_lowercase_username");