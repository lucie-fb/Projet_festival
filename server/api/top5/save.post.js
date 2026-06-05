import { db } from "~/server/db";
import { top5 } from "../../db/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.top5 || !Array.isArray(body.top5)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid body"
    });
  }

  const rows = body.top5.map(f => ({
    image: f.images?.[0]?.url || null,
    id: f.id,
    name: f.name,
    genres: f.genre,
    followers: f.followers?.total||0,
    popularity: f.popularity,
    source: "spotify"
  }));

  const result = await db.insert(top5).values(rows).onConflictDoNothing().returning();

  return { inserted: result.length };
});