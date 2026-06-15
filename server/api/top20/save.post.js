import { db } from "~/server/db";
import { top20 } from "../../db/schema";
import { z } from "zod";

const LineupSchema = z.object({
  id: z.string(),
  name: z.string()
});

const CategorySchema = z.object({
  segment: z.string().nullable(),
  genre: z.string().nullable(),
  subGenre: z.string().nullable()
});

const FestivalSchema = z.object({
  image: z.string().nullable(),
  name: z.string(),
  source: z.literal("ticketmaster"),
  date: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  lineup: z.array(LineupSchema),
  categories: z.array(CategorySchema)
});

const BodySchema = z.object({
  top20: z.array(FestivalSchema)
});

export default defineEventHandler(async (event) => {

  try{

  const body = await readBody(event);

  const parsed = BodySchema.parse(body);

  const rows = parsed.top20.map(f => ({
   image: f.image,
      name: f.name,
      source: f.source,
      date: f.date,
      city: f.city,
      country: f.country,
      lineup: f.lineup,
      categories: f.categories
  }))

  const result = await db.insert(top20).values(rows).onConflictDoNothing().returning();

  return { inserted: result.length };
} catch (error){
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