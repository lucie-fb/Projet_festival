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

const isFavorite = ref(false);

onMounted(async()=>{
  const res = await $fetch("/api/favorites/list", {
    credentials: "include"
  });
  isFavorite.value = res.favorites.some(f =>f.itemId === props.artist.id);
})

const toggleFavorite = async () => {
  isFavorite.value = !isFavorite.value;

  if(isFavorite.value){
  await $fetch("/api/favorites/add", {
    method: "POST",
    body: {
      itemId: props.artist.id,
      itemType: "artist",
      name: props.artist.name,
      image: props.artist.image
    },
    credentials: "include"
  })
}

else {
  await $fetch("/api/favorites/remove", {
    method: "POST",
    body: {
      itemId: props.artist.id
    },
    credentials: "include"
  })
}
}

</script>

<template>
  <article class="card artist-card" @click="clickArtists">
    <button class="fav-btn" @click.stop="toggleFavorite">
    <svg v-if="isFavorite" width="24" height="24" viewBox="0 0 24 24" fill="#FF2D55" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 21s-6.2-4.35-9.33-8.48C-1.2 8.4 1.02 3 5.6 3c2.3 0 4.07 1.33 5.4 3.09C12.93 4.33 14.7 3 17 3c4.58 0 6.8 5.4 2.93 9.52C18.2 16.65 12 21 12 21z"/>
</svg>
<svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF2D55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.1 20.3l-.1.1-.1-.1C7.14 16.36 3.6 13.28 3.6 9.5 3.6 6.42 6.02 4 9.1 4c1.74 0 3.41.81 4.4 2.09C14.49 4.81 16.16 4 17.9 4c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.54 6.86-8.3 10.8z"/>
</svg>
</button>
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
  position: relative;
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
.fav-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: white;
  border: none;
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.fav-btn:hover {
  transform: scale(1.1);
}
</style>