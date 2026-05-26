export const useSpotify = () => {
  const searchAlbums = async () => {
    return await $fetch("/api/spotify/albums")
  }

  const searchArtists = async () => {
    return await $fetch("/api/spotify/artists")
  }

  return { searchAlbums, searchArtists }
}
