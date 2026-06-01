<script setup>
const props = defineProps({
  artist: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <article class="card">
    <img :src="artist.image" :alt="artist.name" />
    <h2>{{ artist.name }}</h2>

    <p v-if="artist.lastAlbum">
      Dernier album : <strong>{{ artist.lastAlbum.name }}</strong>
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
