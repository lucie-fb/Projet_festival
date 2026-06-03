<script setup>
import {ref, onMounted} from 'vue' 
import {useSpotify} from '~/composables/useSpotify'

definePageMeta({
  middleware: 'auth'
})

const { top5 } = useSpotify();
const artists = ref ([]);

onMounted (async()=> {
  artists.value = await top5()
})

</script>

<template>

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
  
</template>

<style lang="css" scoped>
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
  grid-template-columns: repeat(4, 1fr);
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