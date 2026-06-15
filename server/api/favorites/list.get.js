import { db } from "~/server/db";
import { playlists, playlistItems } from "~/server/db/schema";
import { eq, and } from "drizzle-orm"
import { getUserId } from "~/server/utils/auth"

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)

  const defaultPlaylist = await db
  .select()
  .from(playlists)
  .where(and(eq(playlists.userId, userId), eq(playlists.isDefault, true)))

  if (defaultPlaylist.length === 0) {
  return { favorites: [] }
}

  const playlistId = defaultPlaylist[0].id
  const items = await db
  .select()
  .from(playlistItems)
  .where(eq(playlistItems.playlistId, playlistId))

  return { favorites: items }
})