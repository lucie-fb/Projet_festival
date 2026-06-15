import { pgTable, serial, text, jsonb, timestamp, boolean, integer } from "drizzle-orm/pg-core";

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
  name: text("name"),
  image: text("image"),
  date: text("date"),
  city: text("city"),
  country: text("country"),
  popularity: text("popularity"),
  source: text("source"),
  lineup: jsonb("lineup"),
  categories: jsonb("categories")
});

export const top20 = pgTable("top20", {
  id :serial("id").primaryKey(),
  name: text("name"),
  image: text("image"),
  date: text("date"),
  city: text("city"),
  country: text("country"),
  popularity: text("popularity"),
  source: text("source"),
  lineup: jsonb("lineup"),
  categories: jsonb("categories")
});

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
})

export const playlistItems = pgTable("playlist_items", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlistId").references(()=> playlists.id).notNull(),
  artistId: text("artistId").notNull(),
  name: text("name").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
})