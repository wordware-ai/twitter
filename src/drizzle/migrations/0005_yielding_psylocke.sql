CREATE EXTENSION "uuid-ossp";
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT concat('usr_', uuid_generate_v4());