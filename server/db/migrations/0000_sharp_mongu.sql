CREATE TABLE "albums" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"source" text
);

CREATE TABLE "artists" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"source" text
);

CREATE TABLE "festivals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"source" text
);
