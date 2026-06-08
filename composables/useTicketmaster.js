export const useTicketmaster = () => {

  const top5f = async () => {
    return await $fetch("/api/ticketmaster/top5festivals")
  }

  const top20f = async () => {
    return await $fetch("/api/ticketmaster/top20festivals")
  }

  return { top5f, top20f }
}