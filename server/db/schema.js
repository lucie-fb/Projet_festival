import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const festivals = sqliteTable("festivals", {
  id: text("id").primaryKey(),
  name: text("name"),
  city: text("city"),
  date: text("date"),
});
