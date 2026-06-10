<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <h1>Favorites</h1>

  <div v-if="isLoading" class="loading-box">
  <div class="pulse-loader"></div>
  <p>Chargement des listes…</p>
</div>


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