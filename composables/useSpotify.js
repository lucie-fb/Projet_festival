export const useSpotify = () => {
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

  return { searchAlbums, searchArtists, top5, top20 }
}
