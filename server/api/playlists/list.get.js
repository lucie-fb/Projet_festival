import { db } from "~/server/db"
import { playlists, playlistItems } from "~/server/db/schema"
import { eq } from "drizzle-orm"
import { getUserId } from "~/server/utils/auth"

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)

  const allPlaylists = await db
  .select()
  .from(playlists)
  .where(eq(playlists.userId, userId))

  const defaultPlaylist = allPlaylists.find(p=>p.isDefault)
  const userPlaylists = allPlaylists.filter(p=>!p.isDefault)

  return {
    default: defaultPlaylist,
    playlists: userPlaylists
  }
})