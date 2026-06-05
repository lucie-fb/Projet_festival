export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const url = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=genre:pop&apikey=${config.TM_KEY}`

  const data = await $fetch(url)

  return data._embedded?.attractions?.map(a => ({
    image: a.images?.[0]?.url || null,
    id: a.id,
    name: a.name,
    genres: a.genre,
    followers: a.followers?.total||0,
    popularity: a.popularity,
    source: "ticketmaster"
  })) || []
})
