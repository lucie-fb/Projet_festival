import { db } from "~/server/db"
import { playlists, playlistItems } from "~/server/db/schema"
import { eq, and } from "drizzle-orm"
import { getUserId } from "~/server/utils/auth"
import { z } from "zod"

const AddItemSchema = z.object({
  playlistId: z.number(),
  artistId: z.string(),
  name: z.string(),
  image: z.string().nullable().optional()
})

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)

  let body
  try {
    body = AddItemSchema.parse(await readBody(event))
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data",
      data: error.errors
    })
  }

  const { playlistId, artistId, name, image } = body

  const playlist = await db
    .select()
    .from(playlists)
    .where(and(eq(playlists.id, playlistId), eq(playlists.userId, userId)))

  if (playlist.length === 0) {
    throw createError({
      statusCode: 403,
      statusMessage: "Playlist not found or not yours"
    })
  }

  const existing = await db
    .select()
    .from(playlistItems)
    .where(and(
      eq(playlistItems.playlistId, playlistId),
      eq(playlistItems.artistId, artistId)
    ))

  if (existing.length > 0) {
    return { success: true, alreadyInPlaylist: true }
  }

  await db.insert(playlistItems).values({
    playlistId,
    artistId,
    name,
    image
  })

  return { success: true }
})
