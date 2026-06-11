export const useApi = () => {
    
  const searchAlbums = async () => {
    return await $fetch("/api/spotify/albums")
  }

  const searchArtists = async (name) => {
    return await $fetch(`/api/spotify/artists?name=${encodeURIComponent(name)}`)
  }

  const top5 = async () => {
    return await $fetch("/api/spotify/top5artists")
  }

  const top20 = async () => {
    return await $fetch("/api/spotify/top20artists")
  }

  const top5f = async () => {
    return await $fetch("/api/ticketmaster/top5festivals")
  }

  const top20f = async () => {
    return await $fetch("/api/ticketmaster/top20festivals")
  }

  return { searchAlbums, searchArtists, top5, top20, top5f, top20f }
}