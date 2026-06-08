<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useTicketmaster } from "~/composables/useTicketmaster";
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
const { top20f } = useTicketmaster();
const route = useRoute();
const isLoading = ref(true);

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
    errorMessage.value = "Merci de saisir un nom de festival.";
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
    allFestivals.value = festivals.value;
    festivals.value = result;

    await $fetch("/api/festivals/save", {
      method: "POST",
      body: { festivals: result },
    });
  } catch (error) {
    console.error(error);
    errorMessage.value = "Une erreur est survenue lors de la recherche.";
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
      <div class="spinner"></div>
      <p>Chargement…</p>
    </div>
    <div v-else>
    <div class="searchbar-wrapper">
      <SearchBar v-model:query="searchTerm" @search="search" />
    </div>

    <p>Recherchez le festival de votre choix</p>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <div class="filter-row">
      <input v-model="filterDate" type="date" class="filter-date" />
      <button class="filter-btn" @click="applyFilter">Filtrer par date</button>
    </div>

    <select v-model="selectedGenre" class="filter-select">
      <option value="">Tous les genres</option>
      <option value="Rock">Rock</option>
      <option value="Pop">Pop</option>
      <option value="Electronic">Electro</option>
      <option value="Hip-Hop">Hip-Hop</option>
      <option value="Jazz">Jazz</option>
    </select>
    
      <h1 v-if="!hasSearched">Top 20 des festivals à venir</h1>
      <h1 v-else>Festivals trouvés</h1>

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
</style>
