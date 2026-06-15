<script setup>
import { ref } from "vue";
import { useApi } from "~/composables/useApi";
import FestivalCard from "../components/FestivalCard.vue";
import ArtistCard from "~/components/ArtistCard.vue"

definePageMeta({
  middleware: "auth",
});

const { top5, top5f } = useApi();
const artists = ref([]);
const festivals = ref([]);
const isLoading = ref(true);
const searchTerm = ref("");
const { t } = useI18n();
const errorMessage = ref("")


function search() {}


onMounted(async () => {
  try {
    artists.value = await top5();
    festivals.value = await top5f();
  } catch (e) {
    errorMessage.value = t("home.error");
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="page-container">
    <div v-if="isLoading" class="loading-box">
  <div class="pulse-loader"></div>
  <p>{{ t('home.loading') }}</p>
</div>

    <div v-else>
      <div class="searchbar-wrapper">
        <SearchBar v-model:query="searchTerm" @search="search" />
      </div>

      <p>{{ t('home.subtitle') }}</p>
      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <h2>{{ t('home.topArtists') }}</h2>
      <div class="artists">
        <div class="grid">
          <ArtistCard
            v-for="artist in artists"
            :key="artist.id"
            :artist="artist"
          />
        </div>
      </div>

      <h2>{{ t('home.topFestivals') }}</h2>
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

  h2 {
    font-size: 1.7rem;
  }

  .artists .grid,
  .festivals .grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

/* 📱 Mobiles */
@media (max-width: 600px) {
  .page-container {
    padding: 30px 16px;
  }

  h2 {
    font-size: 1.4rem;
    margin-top: 1.4rem;
    margin-bottom: 1.4rem;
  }

  p {
    font-size: 0.95rem;
  }

  .artists .grid,
  .festivals .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* 📱 Très petits écrans */
@media (max-width: 400px) {
  .artists .grid,
  .festivals .grid {
    grid-template-columns: repeat(1, 1fr);
  }

  h2 {
    font-size: 1.25rem;
  }
}

</style>
