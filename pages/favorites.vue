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

async function onPlaylistUpdated() {
  await loadPlaylists()
  if (selectedPlaylist.value) {
    const updated = playlists.value.find(p => p.id === selectedPlaylist.value.id) || 
                    (defaultPlaylist.value && defaultPlaylist.value.id === selectedPlaylist.value.id ? defaultPlaylist.value : null)
    if (updated) {
      selectedPlaylist.value = updated
    }
    const res = await $fetch("/api/playlists/items", {
      method: "POST",
      body: { playlistId: selectedPlaylist.value.id },
      credentials: "include"
    })
    playlistItems.value = res.items
  }
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
      <label for="new-playlist" class="sr-only">
  {{ t('favorites.placeholder') }}
</label>

<input 
  id="new-playlist"
  v-model="newPlaylistName" 
  :placeholder="t('favorites.placeholder')" 
/>

     <button 
  @click="createPlaylist"
  :aria-label="t('favorites.create') + ' : ' + newPlaylistName"
>
  {{ t("favorites.create") }}
</button>
    </div>

    <div v-if="defaultPlaylist" class="default-playlist" role="list">
      <PlaylistCard 
        :playlist="defaultPlaylist" 
        isDefault
        role="listitem"
        @open="openPlaylistModal"
        @rename="renamePlaylist"
        @delete="deletePlaylist"
      />
    </div>

    <div class="playlists"  role="list">
      <PlaylistCard 
        v-for="p in playlists" 
        :key="p.id" 
        :playlist="p"
         role="listitem"
        @open="openPlaylistModal"
        @rename="renamePlaylist"
        @delete="deletePlaylist"
      />
    </div>

  </section>

  <PlaylistModal
  v-if="selectedPlaylist"
  :show="showModal"
  :playlist="selectedPlaylist"
  :items="playlistItems"
  @close="showModal = false"
  @updated="onPlaylistUpdated"
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

.playlists,
.default-playlist {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 40px;
}

@media (max-width: 1024px) {
  .favorites-page {
    padding: 16px;
  }

  .favorites-page h1 {
    font-size: 1.7rem;
    margin-bottom: 24px;
  }

  .create-playlist input {
    font-size: 0.95rem;
    padding: 8px 12px;
  }

  .create-playlist button {
    padding: 8px 14px;
    font-size: 0.95rem;
  }

  .playlists,
  .default-playlist {
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }
}

@media (max-width: 600px) {
  .favorites-page {
    padding: 14px;
  }

  .favorites-page h1 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .create-playlist {
    flex-direction: column;
  }

  .create-playlist input {
    width: 100%;
    font-size: 0.9rem;
  }

  .create-playlist button {
    width: 100%;
    font-size: 0.9rem;
    padding: 10px;
  }

  .playlists,
  .default-playlist {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 400px) {
  .favorites-page h1 {
    font-size: 1.3rem;
  }

  .playlists,
  .default-playlist {
    grid-template-columns: repeat(1, 1fr);
  }
}

</style>

<style lang="css">
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>