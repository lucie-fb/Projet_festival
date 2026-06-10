export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const {festival} = getQuery(event)

  const data = await $fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${config.TM_KEY}&classificationName=festival&keyword=${encodeURIComponent(festival)}&size=50&include=attractions,venues`
  )

  const events = data._embedded?.events || []

  return events.map(e => {
    const localDate = e.dates?.start?.localDate
    const localDateTime = e.dates?.start?.localDateTime
    const dateTime = e.dates?.start?.dateTime
    let normalizedDate = null

    if (localDate){
      normalizedDate = localDate
    } else if (localDateTime){
      normalizedDate = localDateTime.slice(0, 10)
    } else if (dateTime) {
      normalizedDate = dateTime.slice(0, 10)
    }

    return {
    name: e.name,
    date: normalizedDate,
    city: e._embedded?.venues?.[0]?.city?.name || null,
    country: e._embedded?.venues?.[0]?.country?.name || null,
    image: e.images?.[0]?.url || null,
    source: "ticketmaster",

    lineup: e._embedded?.attractions?.map(a=> ({
      id: a.id,
      name: a.name,
      image: a.images?.[0]?.url || null
    })) || []
    }
  })
})