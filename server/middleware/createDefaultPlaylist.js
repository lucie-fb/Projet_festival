import { db } from "~/server/db"
import { playlists } from "~/server/db/schema"
import { eq, and } from "drizzle-orm"
import { getUserId } from "~/server/utils/auth"

export default defineEventHandler(async (event) => {
  const userId = getUserId(event)

    if(!userId) return
        
    const existing = await db
    .select()
    .from(playlists)
    .where(and(
        eq(playlists.userId, userId),
        eq(playlists.isDefault, true)
    ))

    if (existing.length === 0){
        await db.insert(playlists).values({
            userId,
            name: "Artistes Likées",
            isDefault: true
        })
    }

})