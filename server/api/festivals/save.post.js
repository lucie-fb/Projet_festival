import { db } from "~/server/db";
import { festivals } from "~/server/db/schema";
import { z } from "zod";

const LineupSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable()
});

const FestivalSchema = z.object({
  name: z.string(),
  date: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  image: z.string().nullable(),
  source: z.literal("ticketmaster"),
  lineup: z.array(LineupSchema)
})

const BodySchema = z.object({
  festivals: z.array(FestivalSchema)
})

export default defineEventHandler(async (event) => {

  try{
  const body = await readBody(event);
  const parsed = BodySchema.parse(body);

  const rows = parsed.festivals.map(f => ({
     name: f.name,
      date: f.date,
      city: f.city,
      country: f.country,
      image: f.image,
      source: f.source,
      lineup: f.lineup
  }));

  const result = await db.insert(festivals).values(rows).onConflictDoNothing().returning();

  return { inserted: result.length };

} catch(error){
  console.error("Erreur festivals/save", error);

  if (error instanceof z.ZodError){
    throw createError({
      statusCode: 400,
      statusMessage: "Données invalides",
      data: error.errors
    })
  }

  throw createError({
    statusCode: 500,
    statusMessage: "Erreur lors de l'enregistrement des festivals",
  })
}
});