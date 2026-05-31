import { db } from "~/server/db";
import { artists } from "../../db/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.artists || !Array.isArray(body.artists)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid body"
    });
  }

  const rows = body.artists.map(f => ({
    image: f.image,
    name: f.name,
    id: f.id,
    source: f.source
  }));

  const result = await db.insert(artists).values(rows).returning();

  return { inserted: result.length };
});