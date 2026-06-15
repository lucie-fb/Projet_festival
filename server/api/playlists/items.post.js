import { db } from "~/server/db"
import { playlists, playlistItems } from "~/server/db/schema"
import { eq, and } from "drizzle-orm"
import { getUserId } from "~/server/utils/auth"
import { z } from "zod"

const ItemsSchema = z.object({
  playlistId: z.number()
})

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)

  let body
  try {
    body = ItemsSchema.parse(await readBody(event))
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data",
      data: error.errors
    })
  }

  const { playlistId } = body

  const playlist = await db
    .select()
    .from(playlists)
    .where(and(
      eq(playlists.id, playlistId),
      eq(playlists.userId, userId)
    ))

  if (playlist.length === 0) {
    throw createError({
      statusCode: 403,
      statusMessage: "Playlist not found or not yours"
    })
  }

  const items = await db
    .select()
    .from(playlistItems)
    .where(eq(playlistItems.playlistId, playlistId))

  return {
    items
  }
})
