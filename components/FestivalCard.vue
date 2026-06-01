<script setup>

const props = defineProps({
  festival: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="card">
    <img :src="festival.image" :alt="festival.name" />
    <h2>{{ festival.name }}</h2>

    <p v-if="allFestival">
      Tous les festivals : <strong>{{ allFestival.name }}</strong>
    </p>
  </article>
</template>

<style scoped>
.card {
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
}

.card img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
}
</style>
