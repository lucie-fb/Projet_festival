import { albums } from "../../db/schema"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const tokenResponse = await $fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.SPOTIFY_ID,
      client_secret: config.SPOTIFY_KEY
    })
  })

  const accessToken = tokenResponse.access_token

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
