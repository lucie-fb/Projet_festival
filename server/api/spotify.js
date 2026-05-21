export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const artist = query.artist || "Festival"

  const config = useRuntimeConfig()

  const clientId = config.SPOTIFY_ID
  const clientSecret = config.SPOTIFY_KEY

  // 1) Obtenir un token Spotify
  const tokenResponse = await $fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const accessToken = tokenResponse.access_token

  // 2) Rechercher un artiste
  const searchUrl = `https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=5`

  const artistData = await $fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  // 3) Extraire uniquement les noms
  const artistNames = artistData.artists.items.map(a => a.name)

  return artistNames
})
