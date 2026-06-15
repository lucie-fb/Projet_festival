import { db } from "~/server/db"
import { playlists, playlistItems } from "~/server/db/schema"
import { eq, and } from "drizzle-orm"
import { getUserId } from "~/server/utils/auth"
import { z } from "zod"

const RemoveItemSchema = z.object({
  itemId: z.number()
})

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)

  let body
  try {
    body = RemoveItemSchema.parse(await readBody(event))
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data",
      data: error.errors
    })
  }

  const { itemId } = body

  const item = await db
    .select({
      playlistId: playlistItems.playlistId
    })
    .from(playlistItems)
    .where(eq(playlistItems.id, itemId))

  if (item.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Item not found"
    })
  }

  const playlist = await db
    .select()
    .from(playlists)
    .where(and(
      eq(playlists.id, item[0].playlistId),
      eq(playlists.userId, userId)
    ))

  if (playlist.length === 0) {
    throw createError({
      statusCode: 403,
      statusMessage: "You cannot remove items from this playlist"
    })
  }

  await db.delete(playlistItems).where(eq(playlistItems.id, itemId))

  return { success: true }
})
