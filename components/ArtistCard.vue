<script setup>

import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n'

const props = defineProps({
  artist: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const route = useRoute ();
const emit = defineEmits(['select'])
const { t } = useI18n()
const clickArtists = () => {

if (route.path === "/artists") {
    emit("select", props.artist.name)
    return;

}
  router.push(`/artists/[id]?name=${encodeURIComponent(props.artist.name)}`)
}
</script>

<template>
  <article class="card artist-card" @click="clickArtists">
    <img :src="artist.image" :alt="t('artist.alt', { name: artist.name })" />
    <h2>{{ artist.name }}</h2>
  </article>
</template>

<style lang="css" scoped>
.artist-card {
  background: var(--color-white);
  border-radius: 20px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid rgba(153, 0, 112, 0.25);
  box-shadow: 0 6px 18px rgba(153, 0, 112, 0.25);

  transition: transform .2s ease, box-shadow .2s ease;
}

.artist-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 26px rgba(153, 0, 112, 0.35);
}

.artist-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 12px;
}

.artist-card h2 {
  background: var(--color-secondary);
  color: var(--color-primary);
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 10px;
}

.artist-card p {
  font-size: .9rem;
  color: #444;
  margin-top: 6px;
}
</style>