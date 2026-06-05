import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const festivals = pgTable("festivals", {
  id: serial("id").primaryKey(),
  name: text("name"),
  source: text("source")
});

export const artists = pgTable("artists", {
  id :text("id").primaryKey(),
  image: text("image"),
  name: text("name"),
  source: text("source")
});

export const albums = pgTable("albums", {
  id :serial("id").primaryKey(),
  release_date: text("release_date"),
  name: text("name"),
  source: text("source")
});

export const top5 = pgTable("top5", {
  id :serial("id").primaryKey(),
  image: text("image"),
  name: text("name"),
  genres: text("genre"),
  followers: text("followers"),
  popularity: text("popularity"),
  source: text("source")
});