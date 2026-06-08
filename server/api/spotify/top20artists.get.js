import { albums } from "../../db/schema"

export default defineEventHandler(async () => {
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

  const searchUrl = `https://api.spotify.com/v1/search?q=genre:pop&type=artist&limit=10`

  const page1 = await $fetch(`${searchUrl}&offset=0`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const page2 = await $fetch(`${searchUrl}&offset=10`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  const items = [
    ...page1.artists.items,
    ...page2.artists.items
  ]

  return items.map(a => ({
    image: a.images?.[0]?.url || null,
    id: a.id,
    name: a.name,
    genres: a.genres,
    followers: a.followers?.total||0,
    popularity: a.popularity,
    source: "spotify"
  }))
})