<script setup>
import { ref } from 'vue'
import ArtistCard from '~/components/ArtistCard.vue'

definePageMeta({
  middleware: 'auth'
})

const searchTerm = ref("")
const artists = ref([])
const errorMessage = ref("")

async function search() {
  errorMessage.value = ""

  if (!searchTerm.value.trim()) {
    errorMessage.value = "Merci de saisir un nom d'artiste."
    return
  }

  try {
    const result = await $fetch('/api/spotify/artists', {
      method: 'GET',
      query: {
        name: searchTerm.value
      }
    })

    const artistsAndAlbums = []

    for (const artist of result) {
      const lastAlbum = await $fetch('/api/spotify/albums', {
        method: 'GET',
        query: {id:artist.id}
      })

      artistsAndAlbums.push({
        ...artist,
        lastAlbum
      })
    }
    
    artists.value = artistsAndAlbums

    await $fetch('/api/artists/save', {
      method: 'POST',
      body: { artists: artists.value }
    })

  } catch (error) {
    console.error(error)
    errorMessage.value = "Une erreur est survenue lors de la recherche."
  }
}
</script>

<template>
  <div>
    <SearchBar v-model:query="searchTerm" @search="search" />

    <p v-if="errorMessage" style="color: red;">
      {{ errorMessage }}
    </p>

    <h1>Artistes trouvés</h1>

    <div class="grid">
  <ArtistCard 
    v-for="artist in artists" 
    :key="artist.id" 
    :artist="artist" 
  />
</div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
</style>
