export default defineEventHandler(async (event) => {
  const { name } = getQuery(event)
  const config = useRuntimeConfig(event)

  try{
  const url = `https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${encodeURIComponent(name)}&apikey=${config.TM_KEY}`

  const data = await $fetch(url)

 const attractions = data._embedded?.attractions || []

  if (!attractions.length) {
      return []
    }
  

  return attractions.map(a => ({
    id: a.id,
    name: a.name,
    image: a.images?.[0]?.url || null
  })) || []

}catch (error) {
    console.error("Erreur Ticketmaster", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne lors de la récupération des artistes"
    });
  }
})
