import { db } from "~/server/db";
import { festivals, top5 } from "../../db/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.top5 || !Array.isArray(body.top5)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid body"
    });
  }

  const rows = body.top5.map(f => ({
    image: f.image || null,
    name: f.name,
    source: "ticketmaster"
  }));

  const result = await db.insert(festivals).values(rows).onConflictDoNothing().returning();

  return { inserted: result.length };
});