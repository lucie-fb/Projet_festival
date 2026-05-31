CREATE TABLE "albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"release_date" text,
	"name" text,
	"source" text
);
--> statement-breakpoint
CREATE TABLE "artists" (
	"id" text PRIMARY KEY NOT NULL,
	"image" text,
	"name" text,
	"source" text
);
--> statement-breakpoint
CREATE TABLE "festivals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"source" text
);
