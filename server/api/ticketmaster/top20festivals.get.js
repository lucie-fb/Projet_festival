export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=festival&sort=date,asc&apikey=${config.TM_KEY}`

  try {
    const data = await $fetch(url)

    const events = data._embedded?.events || []

    return events.slice(0, 20).map(e => ({
      id: e.id,
      name: e.name,
      date: e.dates?.start?.localDate || null,
      city: e._embedded?.venues?.[0]?.city?.name || null,
      country: e._embedded?.venues?.[0]?.country?.name || null,
      image: e.images?.[0]?.url || null,
      source: "ticketmaster",
      lineup: e._embedded?.attractions?.map(a => ({
        name: a.name,
        id: a.id
      })) || [],
      categories: e.classifications?.map(c => ({
      segment: c.segment?.name || null,
      genre: c.genre?.name || null,
      subGenre: c.subGenre?.name || null
      })) || [],

    }))

  } catch (error) {
    console.error("Ticketmaster error:", error)
    return []
  }
})
