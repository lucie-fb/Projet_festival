<script setup>
import { ref } from "vue";
import ArtistCard from "~/components/ArtistCard.vue";
import FestivalCard from "~/components/FestivalCard.vue";
import { useRoute } from "vue-router";

definePageMeta({
  middleware: "auth",
});

const searchTerm = ref("");
const artists = ref([]);
const festivals = ref([]);
const errorMessage = ref("");
const route = useRoute();

async function search() {
  errorMessage.value = "";

  if (!searchTerm.value.trim()) {
    errorMessage.value = "Merci de saisir un nom d'artiste.";
    return;
  }

  try {
    const result = await $fetch("/api/spotify/artists", {
      method: "GET",
      query: {
        name: searchTerm.value,
      },
    });

    const artistsAndAlbums = [];

    for (const artist of result) {
      const lastAlbum = await $fetch("/api/spotify/albums", {
        method: "GET",
        query: { id: artist.id },
      });

      artistsAndAlbums.push({
        ...artist,
        lastAlbum,
      });
    }

    artists.value = artistsAndAlbums;

    await $fetch("/api/artists/save", {
      method: "POST",
      body: { artists: artists.value },
    });

    const spotifyArtist = artists.value[0];
    const tmArtists = await $fetch("/api/ticketmaster/artists", {
      query: { name: spotifyArtist.name },
    });

    if (!tmArtists.length) {
      festivals.value = [];
      return;
    }

    const tmFestivals = await $fetch("/api/ticketmaster/festivalsByArtists", {
      query: { id: tmArtists[0].id },
    });

    festivals.value = tmFestivals;
  } catch (error) {
    console.error(error);
    errorMessage.value = "Une erreur est survenue lors de la recherche.";
  }
}
onMounted(async () => {
  if (route.query.name) {
    searchTerm.value = route.query.name
    await search()
  }
})

</script>

<template>
  <div class="page-container">
    <div class="searchbar-wrapper">
      <SearchBar v-model:query="searchTerm" @search="search" />
    </div>

    <p> Recherchez vos artistes favoris et voyez où ils performent !</p>
    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <h1>Artiste trouvé</h1>

    <div class="artists">
      <div class="grid">
        <ArtistCard
          v-for="artist in artists"
          :key="artist.id"
          :artist="artist"
        />
      </div>
    </div>

    <h1 v-if="festivals.length">Festivals où il performe</h1>
    <div class="festivals">
      <div class="grid">
        <FestivalCard
          v-for="festival in festivals"
          :key="festival.id"
          :festival="festival"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
p {
  font-size: 1rem;
  font-style: italic;
  text-align: center;
}
.page-container {
  padding: var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;
}

/* Titre de section */
.page-container h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-top: 24px;
  margin-bottom: 16px;
}

/* Grille artistes */
.artists .grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.festivals .grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 16px;
}
</style>
