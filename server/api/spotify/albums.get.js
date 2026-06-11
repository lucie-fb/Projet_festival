import { spotifyToken } from "../../utils/spotifyToken.get"

export default defineEventHandler(async (event) => {
  const accessToken = await spotifyToken();

  const {id} = getQuery(event)
  const safeId = encodeURIComponent(id)
  const searchUrl = `https://api.spotify.com/v1/artists/${safeId}/albums?include_groups=album&limit=1&market=FR`

  try {
  const data = await $fetch(searchUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return data
} catch (err) {
  console.error("Spotify rate limit:", err.status)
  return { error: true, status: err.status }
}


  return data.items.map(a => ({
    name: a.name,
    release_date: a.release_date,
    source: "spotify"
  }))
})