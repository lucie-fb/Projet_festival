<script setup>
definePageMeta({
  middleware: "auth",
});

const searchTerm = ref("");
const filterDate = ref("");
const festivals = ref([]);
const allFestivals = ref([]);
const errorMessage = ref("");

async function search() {
  errorMessage.value = "";

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
  // on repart toujours de la liste complète
  let list = [...allFestivals.value];

  if (filterDate.value) {
    list = list.filter((f) => f.date && f.date.startsWith(filterDate.value));
  }

  festivals.value = list;
}
</script>

<template>
  <div class="festival-page">
    <div class="searchbar-wrapper">
      <SearchBar v-model:query="searchTerm" @search="search" />
    </div>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <div class="filter-row">
      <input v-model="filterDate" type="date" class="filter-date" />
      <button class="filter-btn" @click="applyFilter">Filtrer par date</button>
    </div>

    <h1>Festivals trouvés</h1>

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

.festival-page {
  padding: var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Poppins', sans-serif;
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
  font-family: 'Poppins', sans-serif;
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

.card {
  width: 100%;
  height: 420px;
}

</style>
