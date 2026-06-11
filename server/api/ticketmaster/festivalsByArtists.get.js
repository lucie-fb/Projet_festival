export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  const config = useRuntimeConfig(event)

  try {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=${id}&classificationName=festival&apikey=${config.TM_KEY}`

    const data = await $fetch(url)

    const events = data._embedded?.events || []

    if (!events.length) {
      return []
    }

    return events.map(e => ({
      id: e.id,
      name: e.name,
      date: e.dates?.start?.localDate || null,
      city: e._embedded?.venues?.[0]?.city?.name || null,
      country: e._embedded?.venues?.[0]?.country?.name || null,
      image: e.images?.[0]?.url || null,
      lineup: e._embedded?.attractions || []
    }))

  } catch (error) {
    console.error("Erreur Ticketmaster", error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne lors de la récupération des festivals"
    })
  }
})
