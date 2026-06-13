import { db } from "~/server/db";
import { playlists, playlistItems } from "~/server/db/schema";
import { z } from "zod";
import { eq, and } from "drizzle-orm"
import { getUserId } from "~/server/utils/auth"

const UnlikeSchema = z.object({
    artistId: z.string(),
})

export default defineEventHandler (async (event) => {

    const userId = getUserId(event)

    let body;
    try{
        body = UnlikeSchema.parse(await readBody(event))
    }
    catch (error){
        throw createError({
            statusCode: 400,
            statusMessage: "Donnee invalide",
            data: error.errors
        })
    }
    
    const { artistId} = body

    const defaultPlaylist = await db
    .select()
    .from(playlists)
    .where(and(eq(playlists.userId, userId), eq(playlists.isDefault, true)))

    const playlistId = defaultPlaylist[0].id

        await db
        .delete(playlistItems)
        .where(and(eq(playlistItems.playlistId, playlistId), eq(playlistItems.artistId)))

        return {success:true};
    })