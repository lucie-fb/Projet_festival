export default defineEventHandler(async (event) => {
  const { name } = getQuery(event)
  const config = useRuntimeConfig()

  const url = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${encodeURIComponent(name)}&apikey=${config.TM_KEY}`

  const data = await $fetch(url)

  return data._embedded?.attractions?.map(a => ({
    id: a.id,
    name: a.name,
    image: a.images?.[0]?.url || null
  })) || []
})
