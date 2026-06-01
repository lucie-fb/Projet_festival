export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  const config = useRuntimeConfig()

  const url = `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=${id}&classificationName=festival&apikey=${config.TM_KEY}`

  const data = await $fetch(url)

  return data._embedded?.events?.map(e => ({
    id: e.id,
    name: e.name,
    date: e.dates?.start?.localDate,
    city: e._embedded?.venues?.[0]?.city?.name,
    country: e._embedded?.venues?.[0]?.country?.name,
    image: e.images?.[0]?.url,
    lineup: event._embedded?.attractions || []
  })) || []
})
