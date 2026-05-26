export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const data = await $fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=artist&apikey=${config.TM_KEY}`
  )

  const events = data._embedded?.events || []

  return events.map(e => ({
    name: e.name,
    source: "ticketmaster"
  }))
})