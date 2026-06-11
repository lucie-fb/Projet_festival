import { albums } from "../../db/schema"
import { spotifyToken } from "../../utils/spotifyToken.get"

export default defineEventHandler(async () => {
  const accessToken = await spotifyToken();

  const searchUrl = `https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=5`

  const data = await $fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return data.artists.items.map(a => ({
    image: a.images?.[0]?.url || null,
    id: a.id,
    name: a.name,
    genres: a.genre,
    followers: a.followers?.total||0,
    popularity: a.popularity,
    source: "spotify"
  }))
})