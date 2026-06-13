import { db } from "~/server/db";
import { playlists, playlistItems } from "~/server/db/schema";
import { z } from "zod";
import { eq, and } from "drizzle-orm"
import { getUserId } from "~/server/utils/auth"

const LikeSchema = z.object({
    image: z.string().nullable().optional(),
    name: z.string(),
    artistId: z.string(),
})

export default defineEventHandler (async (event) => {

    const userId = getUserId(event)

    let body;
    try{
        body = LikeSchema.parse(await readBody(event))
    }
    catch (error){
        throw createError({
            statusCode: 400,
            statusMessage: "Donnee invalide",
            data: error.errors
        })
    }
    
    const { artistId, name, image } = body

    const defaultPlaylist = await db
    .select()
    .from(playlists)
    .where(and(eq(playlists.userId, userId), eq(playlists.isDefault, true)))

    const playlistId = defaultPlaylist[0].id

    const existing = await db
        .select()
        .from(playlistItems)
        .where(
            and(
                eq(playlistItems.playlistId, playlistId),
                eq(playlistItems.artistId, artistId)
            ) );

        if (existing.length>0){
            return {success: true, alreadyLiked: true}
        }

        await db.insert(playlistItems).values({
            playlistId,
            artistId,
            name,
            image
        })

        return {success:true};
    })