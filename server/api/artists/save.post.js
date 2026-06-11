import { db } from "~/server/db";
import { artists } from "../../db/schema";
import { z } from "zod";


const ArtistSchema = z.object({
  image: z.string().nullable(),
    name: z.string(),
    id: z.string(),
    source: z.literal("spotify")
})

const BodySchema = z.object({
  artists: z.array(ArtistSchema)
})

export default defineEventHandler(async (event) => {
  
  try{
  const body = await readBody(event);
  const parsed = BodySchema.parse(body);

  const rows = parsed.artists.map(f => ({
    image: f.image,
    name: f.name,
    id: f.id,
    source: f.source
  }));

  const result = await db.insert(artists).values(rows).onConflictDoNothing().returning();

  return { inserted: result.length };
} catch (error){
  console.error("Erreur artists/save", error);

  if (error instanceof z.ZodError){
    throw createError({
      statusCode: 400,
      statusMessage: "Données invalides",
      data: error.errors
    })
  }

  throw createError({
    statusCode: 500,
    statusMessage: "Erreur lors de l'enregistrement des artistes",
  })
}
});