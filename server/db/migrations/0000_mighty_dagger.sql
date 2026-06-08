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
--> statement-breakpoint
CREATE TABLE "top20" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" text,
	"date" text,
	"city" text,
	"country" text,
	"popularity" text,
	"source" text,
	"lineup" jsonb,
	"categories" jsonb
);
--> statement-breakpoint
CREATE TABLE "top5" (
	"id" serial PRIMARY KEY NOT NULL,
	"image" text,
	"name" text,
	"genre" text,
	"followers" text,
	"popularity" text,
	"source" text,
	"lineup" jsonb,
	"categories" jsonb
);
