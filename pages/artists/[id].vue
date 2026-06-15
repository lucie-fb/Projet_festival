<script setup>
import { onMounted, ref } from "vue";
import ArtistCard from "~/components/ArtistCard.vue";
import FestivalCard from "~/components/FestivalCard.vue";
import { useRoute } from "vue-router";
import { useApi } from "~/composables/useApi";


definePageMeta({
  middleware: "auth",
});

const searchTerm = ref("");
const artists = ref([]);
const festivals = ref([]);
const errorMessage = ref("");
const route = useRoute();
const { top20 } = useApi();
const hasSearched = ref(false);
const isLoading = ref(true);
const { t } = useI18n() 


async function search() {
  errorMessage.value = "";
  hasSearched.value = true;

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
  if (!route.query.name) {
    artists.value = await top20();
  }
  if (route.query.name) {
    searchTerm.value = route.query.name;
    await search();
  }
  isLoading.value = false;
});

</script>

<template>
  <div class="page-container">
    <div class="searchbar-wrapper">
      <SearchBar v-model:query="searchTerm" @search="search" />
    </div>

    <p>{{ t('search.artists') }}</p>

    <p v-if="errorMessage" class="error-message">
      {{ t('search.error') }}
    </p>

    <div v-if="isLoading" class="loading-box">
      <div class="pulse-loader"></div>
      <p>{{ t('loading.artists') }}</p>
    </div>

    <h1 v-if="!hasSearched">{{ t('titles.topArtists') }}</h1>
    <h1 v-else>{{ t('titles.artistFound') }}</h1>

    <div class="artists">
      <div class="grid">
        <ArtistCard
          v-for="artist in artists"
          :key="artist.id"
          :artist="artist"
        />
      </div>
    </div>

    <h1 v-if="festivals.length">{{ t('titles.festivalsFound') }}</h1>
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

.page-container h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-top: 24px;
  margin-bottom: 16px;
}

.artists .grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
}

.festivals .grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 16px;
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.pulse-loader {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: pulse 1s infinite ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.6; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.6; }
}

.loading-box p {
  margin-top: 12px;
  font-size: 1.1rem;
  color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 1024px) {
  .page-container {
    padding: 40px 20px;
  }

  .page-container h1 {
    font-size: 1.6rem;
  }

  .artists .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .festivals .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  p {
    font-size: 0.95rem;
  }
}

@media (max-width: 650px) {
  .page-container {
    padding: 30px 16px;
  }

  .page-container h1 {
    font-size: 1.4rem;
    margin-top: 18px;
    margin-bottom: 14px;
  }

  .searchbar-wrapper {
    margin-bottom: 20px;
  }

  .artists .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .festivals .grid {
    grid-template-columns: repeat(1, 1fr);
    gap: 16px;
  }

  p {
    font-size: 0.9rem;
  }
}

@media (max-width: 420px) {
  .page-container h1 {
    font-size: 1.25rem;
  }

  .artists .grid {
    grid-template-columns: repeat(1, 1fr);
  }

  p {
    font-size: 0.85rem;
  }
}

</style>
