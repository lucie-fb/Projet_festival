export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const artist = query.artist || "artist"

  const config = useRuntimeConfig()

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${config.TM_KEY}&keyword=${artist}`

  const data = await $fetch(url)

  // Sécuriser l'accès aux données
  const events = data?._embedded?.events || []

  const festivalNames = events.map(ev => ev.name)

  return festivalNames
})
