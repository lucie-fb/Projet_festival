import { albums } from "../../db/schema"
import { spotifyToken } from "../../utils/spotifyToken.get"

export default defineEventHandler(async (event) => {
  const accessToken = await spotifyToken();

  try{
  const {name} = getQuery(event)
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=1`

  const data = await $fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const items = data?.artists?.items || [];

  if (!items.length) {
      throw createError({
        statusCode: 404,
        statusMessage: "Aucun artiste trouvé pour cette recherche"
      });

    }

  return items.map(a => ({
    image: a.images?.[0]?.url || null,
    id: a.id,
    name: a.name,
    source: "spotify"
  }))
}
catch (error){
  console.error("Erreur Spotify", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne lors de la récupération des artistes"
    });
}
})