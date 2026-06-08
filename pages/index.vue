<script setup>
import {ref, onMounted} from 'vue' 
import {useSpotify} from '~/composables/useSpotify'
import {useTicketmaster} from '~/composables/useTicketmaster'
import FestivalCard from '../components/FestivalCard.vue';

definePageMeta({
  middleware: 'auth'
})

const { top5 } = useSpotify();
const { top5f } = useTicketmaster();
const artists = ref ([]);
const festivals = ref ([]);

onMounted (async()=> {
  artists.value = await top5()
  festivals.value = await top5f()
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

  <h2>Top 5 des artistes les plus écoutés</h2>
<div class="artists">
      <div class="grid">
        <ArtistCard
          v-for="artist in artists"
          :key="artist.id"
          :artist="artist"
        />
      </div>
    </div>

    <h2>Top 5 des festivals à venir</h2>
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

h2 {
  text-align: center;
  font-size: 2rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.artists {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 1rem;
}

.festivals {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
}

.artists .grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
}

.festivals .grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  margin-top: 16px;
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>