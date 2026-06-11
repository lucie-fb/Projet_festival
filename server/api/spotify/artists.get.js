import { albums } from "../../db/schema"
import { spotifyToken } from "../../utils/spotifyToken.get"

export default defineEventHandler(async (event) => {
  const accessToken = await spotifyToken();

  const {name} = getQuery(event)
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=1`

  const data = await $fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return data.artists.items.map(a => ({
    image: a.images?.[0]?.url || null,
    id: a.id,
    name: a.name,
    source: "spotify"
  }))
})