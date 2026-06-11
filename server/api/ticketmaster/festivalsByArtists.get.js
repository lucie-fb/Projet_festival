export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)
  const config = useRuntimeConfig()

  try{
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=${id}&classificationName=festival&apikey=${config.TM_KEY}`

  const data = await $fetch(url)

  if (!events) {
      throw createError({
        statusCode: 404,
        statusMessage: "Aucun festival et artiste trouvés pour cette recherche"
      });

    }

  return data._embedded?.events?.map(e => ({
    id: e.id,
    name: e.name,
    date: e.dates?.start?.localDate,
    city: e._embedded?.venues?.[0]?.city?.name,
    country: e._embedded?.venues?.[0]?.country?.name,
    image: e.images?.[0]?.url,
    lineup: event._embedded?.attractions || []
  })) || []

}catch (error){
  console.error("Erreur Ticketmaster", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne lors de la récupération des festivals"
    });
}
})
