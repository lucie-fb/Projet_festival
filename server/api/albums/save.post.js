import { db } from "~/server/db";
import { albums } from "../../db/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.albums || !Array.isArray(body.albums)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid body"
    });
  }

  const rows = body.albums.map(f => ({
    name: f.name,
    release_date: f.release_date,
    source: f.source
  }));

  const result = await db.insert(albums).values(rows).returning();

  return { inserted: result.length };
});