import { db } from "~/server/db";
import { festivals, top20 } from "../../db/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.top5 || !Array.isArray(body.top20)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid body"
    });
  }

  const rows = body.top20.map(f => ({
    image: f.image || null,
    name: f.name || null,
    source: "ticketmaster",
    date: f.dates?.start?.localDate || null,
    city: f._embedded?.venues?.[0]?.city?.name || null,
    country: f._embedded?.venues?.[0]?.country?.name || null,

    lineup: f._embedded?.attractions?.map(a => ({
      name: a.name,
      id: a.id
    })) || [],

    categories: f.classifications?.map(c => ({
      segment: c.segment?.name || null,
      genre: c.genre?.name || null,
      subGenre: c.subGenre?.name || null
    })) || []
  }))

  const result = await db.insert(festivals).values(rows).onConflictDoNothing().returning();

  return { inserted: result.length };
});