import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./server/db/schema.js",
  out: "./server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
  url: process.env.POSTGRES_URL
  }

});
