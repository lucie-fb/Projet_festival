<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useApi } from "~/composables/useApi";
import FestivalCard from "../components/FestivalCard.vue";

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
    const result = await top20f();
    festivals.value = result;
    allFestivals.value = result;
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
    <div v-if="isLoading" class="loading-box" role="status" aria-live="polite">
      <div class="pulse-loader"></div>
      <p>{{ t("festival.loading") }}</p>
    </div>

    <div v-else>
      <div class="searchbar-wrapper">
        <SearchBar v-model:query="searchTerm" @search="search" />
      </div>

     <p>{{ t('festival.searchPrompt') }}</p>

      <p
        v-if="errorMessage"
        class="error-message"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </p>

      <div class="filter-row">
        <label for="filter-date" class="sr-only">
          {{ t("festival.filterByDate") }}
        </label>

        <input
          id="filter-date"
          v-model="filterDate"
          type="date"
          class="filter-date"
        />

        <button
          class="filter-btn"
          @click="applyFilter"
          :aria-label="t('festival.filterByDate')"
        >
          {{ t("festival.filterByDate") }}
        </button>
      </div>

      <label for="genre-select" class="sr-only">
        {{ t("festival.allGenres") }}
      </label>

      <select id="genre-select" v-model="selectedGenre" class="filter-select">
        <option value="">{{ t("festival.allGenres") }}</option>
        <option value="Rock">{{ t("genres.rock") }}</option>
        <option value="Pop">{{ t("genres.pop") }}</option>
        <option value="Electronic">{{ t("genres.electronic") }}</option>
        <option value="Hip-Hop">{{ t("genres.hiphop") }}</option>
        <option value="Jazz">{{ t("genres.jazz") }}</option>
      </select>

      <h1 v-if="!hasSearched">{{ t("festival.top20") }}</h1>
      <h1 v-else>{{ t("festival.results") }}</h1>

      <div class="festivals">
        <div class="grid" role="list">
          <FestivalCard
            v-for="festival in filteredFestivals"
            :key="festival.id"
            :festival="festival"
            role="listitem"
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
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.6;
  }
}

.loading-box p {
  margin-top: 12px;
  font-size: 1.1rem;
  color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 1024px) {
  .festival-page {
    padding: 40px 20px;
  }

  .festival-page h1 {
    font-size: 1.6rem;
  }

  .filter-row {
    flex-direction: row;
    gap: 10px;
  }

  .filter-date,
  .filter-btn,
  .filter-select {
    font-size: 0.95rem;
    padding: 8px 12px;
  }

  .festivals .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 650px) {
  .festival-page {
    padding: 30px 16px;
  }

  .festival-page h1 {
    font-size: 1.4rem;
    margin-bottom: 16px;
  }

  .searchbar-wrapper {
    margin-bottom: 20px;
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-date,
  .filter-btn,
  .filter-select {
    width: 100%;
    font-size: 0.9rem;
    padding: 10px;
  }

  .festivals .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 420px) {
  .festival-page h1 {
    font-size: 1.25rem;
  }

  .festivals .grid {
    grid-template-columns: repeat(1, 1fr);
  }

  p {
    font-size: 0.9rem;
  }
}
</style>

<style lang="css">
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
