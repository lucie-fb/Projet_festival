<script setup>
definePageMeta({
  middleware: 'auth'
})

const searchTerm = ref("")
const filterDate = ref("")
const festivals = ref([])
const allFestivals = ref([])
const errorMessage = ref("")

async function search() {
  errorMessage.value = ""

  if (!searchTerm.value.trim()) {
    errorMessage.value = "Merci de saisir un nom de festival."
    return
  }

  try {
    const result = await $fetch('/api/ticketmaster/festivals', {
      method: 'GET',
      query: {
        festival: searchTerm.value,
      }
    })

    allFestivals.value = result
    festivals.value = result

    await $fetch('/api/festivals/save', {
      method: 'POST',
      body: { festivals: result }
    })

  } catch (error) {
    console.error(error)
    errorMessage.value = "Une erreur est survenue lors de la recherche."
  }
}

function applyFilter() {
  // on repart toujours de la liste complète
  let list = [...allFestivals.value]

  if (filterDate.value) {
    list = list.filter(f => f.date && f.date.startsWith(filterDate.value))
  }

  festivals.value = list
}
</script>

<template>
  <div>
    <SearchBar v-model:query="searchTerm" @search="search" />

    <p v-if="errorMessage" style="color: red;">
      {{ errorMessage }}
    </p>

    <input v-model="filterDate" type="date">
    <button @click="applyFilter">Filtrer par date</button>

    <h1>Festivals trouvés</h1>
    <pre>{{ festivals }}</pre>
  </div>
</template>
