import { db } from "~/server/db"
import { playlists } from "~/server/db/schema"
import { eq, and } from "drizzle-orm"
import { getUserId } from "~/server/utils/auth"
import { getCookie } from "h3"

export default defineEventHandler(async (event) => {
  const token = getCookie(event, "id_token")
  if (!token) return { default: null, playlists: [] }

  const userId = getUserId(event)
  if (!userId) return { default: null, playlists: [] }

  const defaultPlaylist = await db
    .select()
    .from(playlists)
    .where(and(
      eq(playlists.userId, userId),
      eq(playlists.isDefault, true)
    ))

  const userPlaylists = await db
    .select()
    .from(playlists)
    .where(and(
      eq(playlists.userId, userId),
      eq(playlists.isDefault, false)
    ))

  return {
    default: defaultPlaylist[0] || null,
    playlists: userPlaylists
  }
})
