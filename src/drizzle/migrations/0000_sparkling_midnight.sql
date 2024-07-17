CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"profileScraped" boolean DEFAULT false,
	"name" text,
	"profilePicture" text,
	"description" text,
	"location" text,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
