import { db } from "~/server/db"
import { playlists } from "~/server/db/schema"
import { eq, and } from "drizzle-orm"
import { getUserId } from "~/server/utils/auth"
import { z } from "zod"

const CreatePlaylistSchema = z.object({
    name: z.string().min(1, "Ajouter un nom à votre playlist")
})

export default defineEventHandler(async(event)=> {
    const userId = getUserId(event)

    let body
    try{
        body = CreatePlaylistSchema.parse(await readBody(event))
    } catch (error){
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid data",
            data: error.errors
        })
    }

    const {name} = body
    const existing = await db
    .select()
    .from(playlists)
    .where(
        and(
            eq(playlists.userId, userId),
            eq(playlists.name, name)
        )
    )
    if (existing.length>0) {
        throw createError({
            status: 409,
            statusMessage: "Une playlist avec ce nom existe déjà"
        })
    }

    const result = await db
    .insert(playlists)
    .values({
        userId,
        name,
        isDefault: false
    })
    .returning()

    return{
        success: true,
        playlist: result[0]
    }
})