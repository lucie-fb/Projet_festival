import { spotifyToken } from "../../utils/spotifyToken.get"

export default defineEventHandler(async () => {
  const accessToken = await spotifyToken();

  try{
  const searchUrl = `https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=10`

  const [page1, page2] = await Promise.all([
  $fetch(`${searchUrl}&offset=0`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }),
  $fetch(`${searchUrl}&offset=10`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  ])
  
  const items = [
    ...(page1.artists.items || []),
    ...(page2.artists.items || [])
  ]

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
    genres: a.genres,
    followers: a.followers?.total||0,
    popularity: a.popularity,
    source: "spotify"
  }))
}catch (error){
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