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

  const {id} = getQuery(event)
  const safeId = encodeURIComponent(id)
  const searchUrl = `https://api.spotify.com/v1/artists/${safeId}/albums?include_groups=album&limit=1&market=FR`

  const data = await $fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return data.items.map(a => ({
    name: a.name,
    release_date: a.release_date,
    source: "spotify"
  }))
})