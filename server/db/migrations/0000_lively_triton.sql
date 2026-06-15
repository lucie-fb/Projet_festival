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
CREATE TABLE "playlist_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"playlistId" integer NOT NULL,
	"artistId" text NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"isDefault" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
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
--> statement-breakpoint
ALTER TABLE "playlist_items" ADD CONSTRAINT "playlist_items_playlistId_playlists_id_fk" FOREIGN KEY ("playlistId") REFERENCES "public"."playlists"("id") ON DELETE no action ON UPDATE no action;