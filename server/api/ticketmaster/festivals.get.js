export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const {festival} = getQuery(event)

  const data = await $fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?&keyword=${encodeURIComponent(festival)}&apikey=${config.TM_KEY}`
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
      normalized = date.Time.slice(0,10)
    }

    return {
    name: e.name,
    date: normalizedDate,
    city: e._embedded?.venues?.[0]?.city?.name || null,
    country: e._embedded?.venues?.[0]?.country?.name || null,
    image: e.images?.[0]?.url || null,
    source: "ticketmaster"
    }
  })
})