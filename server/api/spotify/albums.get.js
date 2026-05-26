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

  const query = encodeURIComponent("album")
  const searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=album&limit=10`

  const data = await $fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return data.albums.items.map(a => ({
    name: a.name,
    source: "spotify"
  }))
})