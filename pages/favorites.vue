<script setup>
import PlaylistCard from '../components/PlaylistCard.vue'
import PlaylistModal from '../components/PlaylistModal.vue'

const { t } = useI18n()

const defaultPlaylist = ref(null)
const playlists = ref([])
const newPlaylistName = ref("")
const isLoading = ref(true)
const showModal = ref(false)
const selectedPlaylist = ref(null)
const playlistItems = ref([])

async function loadPlaylists() {
  const res = await $fetch("/api/playlists/list", { credentials: "include" })
  defaultPlaylist.value = res.default
  playlists.value = res.playlists
}

async function createPlaylist() {
  if (!newPlaylistName.value.trim()) return
  await $fetch("/api/playlists/create", {
    method: "POST",
    body: { name: newPlaylistName.value },
    credentials: "include"
  })
  newPlaylistName.value = ""
  await loadPlaylists()
}

async function openPlaylistModal(playlist) {
  selectedPlaylist.value = playlist
  const res = await $fetch("/api/playlists/items", {
    method: "POST",
    body: { playlistId: playlist.id },
    credentials: "include"
  })
  playlistItems.value = res.items
  showModal.value = true
}

async function renamePlaylist(playlist) {
  const newName = prompt(t("favorites.renamePrompt", { name: playlist.name }))
  if (!newName || !newName.trim()) return
  await $fetch("/api/playlists/rename", {
    method: "POST",
    body: { playlistId: playlist.id, name: newName },
    credentials: "include"
  })
  await loadPlaylists()
}

async function deletePlaylist(playlist) {
  if (!confirm(t("favorites.deleteConfirm", { name: playlist.name }))) return
  await $fetch("/api/playlists/delete", {
    method: "POST",
    body: { playlistId: playlist.id },
    credentials: "include"
  })
  await loadPlaylists()
}

onMounted(async () => {
  await loadPlaylists()
  isLoading.value = false
})

definePageMeta({ middleware: "auth" })
</script>



<template>
  <section class="favorites-page">

    <h1>{{ t("favorites.title") }}</h1>

    <div class="create-playlist">
      <input 
        v-model="newPlaylistName" 
        :placeholder="t('favorites.placeholder')" 
      />
      <button @click="createPlaylist">
        {{ t("favorites.create") }}
      </button>
    </div>

    <div v-if="defaultPlaylist" class="default-playlist">
      <PlaylistCard 
        :playlist="defaultPlaylist" 
        isDefault
        @open="openPlaylistModal"
        @rename="renamePlaylist"
        @delete="deletePlaylist"
      />
    </div>

    <div class="playlists">
      <PlaylistCard 
        v-for="p in playlists" 
        :key="p.id" 
        :playlist="p"
        @open="openPlaylistModal"
        @rename="renamePlaylist"
        @delete="deletePlaylist"
      />
    </div>

  </section>

  <PlaylistModal
    :show="showModal"
    :playlist="selectedPlaylist"
    :items="playlistItems"
    @close="showModal = false"
    @updated="loadPlaylists"
  />
</template>


<style lang="css" scoped>
.favorites-page {
  padding: 20px;
}

.favorites-page h1 {
  margin-bottom: 30px;
  color: var(--color-primary);
  font-size: 2rem;
  font-weight: 700;
}

/* Formulaire création playlist */
.create-playlist {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.create-playlist input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 12px;
  border: 2px solid rgba(153, 0, 112, 0.25);
  font-size: 1rem;
}

.create-playlist button {
  background: var(--color-primary);
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s ease;
}

.create-playlist button:hover {
  background: var(--color-secondary);
}

/* Grille playlists */
.playlists,
.default-playlist {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 40px;
}

@media (max-width: 1200px) {
  .playlists,
  .default-playlist {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .playlists,
  .default-playlist {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 650px) {
  .playlists,
  .default-playlist {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 450px) {
  .playlists,
  .default-playlist {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>