<script setup>

definePageMeta({
  middleware: 'auth'
})

async function search() {
  errorMessage.value = "";

  if (!searchTerm.value.trim()) {
    errorMessage.value = "Merci de saisir un nom d'artiste.";
    return;
  }

  try {
  }
}

</script>

<template>
  <h1>Accueil</h1>
  
</template>