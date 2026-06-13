import { db } from "~/server/db";
import { playlists, playlistItems } from "~/server/db/schema";
import { eq, and } from "drizzle-orm"
import { getUserId } from "~/server/utils/auth"

export default defineEventHandler(async (event) => {
  const userId = getUSerId(event)

  const defaultPlaylist = await db
  .select()
  .from(playlists)
  .where(and(eq(playlists.userId, userId), eq(playlists.isDefault, true)))

  const playlistId = defaultPlaylist[0].isDefault
  const items = await db
  .select()
  .from(playlistItems)
  .where(eq(playlistItems.playlistId, playlistId))

  return { favorites: items }
})