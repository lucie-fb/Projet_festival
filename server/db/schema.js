import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const festivals = pgTable("festivals", {
  id: serial("id").primaryKey(),
  name: text("name"),
  source: text("source")
});

export const artists = pgTable("artists", {
  id :serial("id").primaryKey(),
  name: text("name"),
  source: text("source")
});

export const albums = pgTable("albums", {
  id :serial("id").primaryKey(),
  name: text("name"),
  source: text("source")
});