<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "~/composables/useApi";
import FestivalCard from "../components/FestivalCard.vue";
import { useI18n } from "vue-i18n";

definePageMeta({
  middleware: "auth",
});

const searchTerm = ref("");
const filterDate = ref("");
const festivals = ref([]);
const allFestivals = ref([]);
const errorMessage = ref("");
const selectedGenre = ref("");
const { top20f } = useApi();
const route = useRoute();
const isLoading = ref(true);
const hasSearched = ref(false);
const { t } = useI18n();

const filteredFestivals = computed(() => {
  if (!selectedGenre.value) return festivals.value;

  return festivals.value.filter((f) =>
    f.categories?.some(
      (c) => c.genre?.toLowerCase() === selectedGenre.value.toLowerCase(),
    ),
  );
});

async function search() {
  errorMessage.value = "";
  hasSearched.value = true;

  if (!searchTerm.value.trim()) {
    errorMessage.value = t("festival.enterName");
    return;
  }

  try {
    const result = await $fetch("/api/ticketmaster/festivals", {
      method: "GET",
      query: {
        festival: searchTerm.value,
      },
    });

    allFestivals.value = result;
    festivals.value = result;

    await $fetch("/api/festivals/save", {
      method: "POST",
      body: { festivals: result },
    });
  } catch (error) {
    console.error(error);
    errorMessage.value = t("festival.searchError");
  }
}

function applyFilter() {
  let list = [...allFestivals.value];

  if (filterDate.value) {
    list = list.filter((f) => f.date && f.date.startsWith(filterDate.value));
  }

  festivals.value = list;
}

onMounted(async () => {
  if (!route.query.name) {
    festivals.value = await top20f();
  }
  if (route.query.name) {
    searchTerm.value = route.query.name;
    await search();
  }
  isLoading.value = false;
});
</script>

<template>
  <div class="festival-page">
    <div v-if="isLoading" class="loading-box">
      <div class="pulse-loader"></div>
      <p>{{ t('festival.loading') }}</p>
    </div>

    <div v-else>
      <div class="searchbar-wrapper">
        <SearchBar v-model:query="searchTerm" @search="search" />
      </div>

      <p>{{ t('festival.searchPrompt') }}</p>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <div class="filter-row">
        <input v-model="filterDate" type="date" class="filter-date" />
        <button class="filter-btn" @click="applyFilter">
          {{ t('festival.filterByDate') }}
        </button>
      </div>

      <select v-model="selectedGenre" class="filter-select">
        <option value="">{{ t('festival.allGenres') }}</option>
        <option value="Rock">{{ t('genres.rock') }}</option>
        <option value="Pop">{{ t('genres.pop') }}</option>
        <option value="Electronic">{{ t('genres.electronic') }}</option>
        <option value="Hip-Hop">{{ t('genres.hiphop') }}</option>
        <option value="Jazz">{{ t('genres.jazz') }}</option>
      </select>

      <h1 v-if="!hasSearched">{{ t('festival.top20') }}</h1>
      <h1 v-else>{{ t('festival.results') }}</h1>

      <div class="festivals">
        <div class="grid">
          <FestivalCard
            v-for="festival in filteredFestivals"
            :key="festival.id"
            :festival="festival"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.filter-select {
  padding: 10px 14px;
  border-radius: 12px;
  border: 2px solid var(--color-primary);
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  margin-bottom: 30px;
  cursor: pointer;
  background: white;
  color: var(--color-primary);
  font-weight: 600;
}

p {
  font-size: 1rem;
  font-style: italic;
  text-align: center;
}

.festival-page {
  padding: var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;
  font-family: "Poppins", sans-serif;
}

.searchbar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.error-message {
  color: red;
  margin-bottom: 20px;
  font-weight: 500;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
}

.filter-date {
  padding: 10px 14px;
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
}

.filter-btn {
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.filter-btn:hover {
  background: #b30085;
}

.festival-page h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 20px;
}

.festivals .grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  width: 100%;
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

</style>
