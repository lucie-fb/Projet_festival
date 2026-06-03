<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <h1>Favorites</h1>
</template>

<style lang="css" scoped>
.favorites-page h1 {
  margin-bottom: 30px;
}

.favorites-page .grid {
  grid-template-columns: repeat(5, 1fr);
}

@media (max-width: 1200px) {
  .favorites-page .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .favorites-page .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 650px) {
  .favorites-page .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 450px) {
  .favorites-page .grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>