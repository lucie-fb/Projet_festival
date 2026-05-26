import { db } from "~/server/db";
import { festivals } from "~/server/db/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.festivals || !Array.isArray(body.festivals)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid body"
    });
  }

  const rows = body.festivals.map(f => ({
    name: f.name,
    source: f.source
  }));

  const result = await db.insert(festivals).values(rows).returning();

  return { inserted: result.length };
});