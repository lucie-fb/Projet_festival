<script setup>
const props = defineProps({
  show: Boolean,
  playlist: Object,
  items: Array,
});

const emit = defineEmits(["close", "updated"]);
const { t } = useI18n();
const newName = ref("");

watch(
  () => props.playlist,
  (p) => {
    if (p) newName.value = p.name;
  },
);

async function renamePlaylist() {
  if (!newName.value.trim()) return;
  await $fetch("/api/playlists/rename", {
    method: "POST",
    body: {
      playlistId: props.playlist.id,
      name: newName.value,
    },
    credentials: "include",
  });
  emit("updated");
}

async function removeItem(itemId) {
  await $fetch("/api/playlists/remove-item", {
    method: "POST",
    body: { itemId },
    credentials: "include",
  });

  emit("updated");
}

function close() {
  emit("close");
}

function goToArtist(name) {
  router.push(`/artists/[id]?name=${encodeURIComponent(name)}`);
}
</script>

<template>
  <div
    v-if="show"
    class="modal-overlay"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="'playlist-title'"
    @keydown.esc="close"
    @click.self="close"
  >
    <div class="modal-box" ref="modalBox" tabindex="-1">
      <header>
        <h2 id="playlist-title">{{ playlist.name }}</h2>

        <button
          class="close-btn"
          @click="close"
          aria-label="Fermer la fenêtre"
        >
          X
        </button>
      </header>

      <div v-if="!playlist.isDefault" class="rename-box">
        <input
          v-model="newName"
          :placeholder="t('playlist.renamePlaceholder')"
          :aria-label="t('playlist.renameLabel')"

        />
        <button @click="renamePlaylist">
          {{ t('playlist.rename') }}
        </button>
      </div>

      <div class="items-list">
        <div
          v-for="item in items"
          :key="item.id"
          class="artist-wrapper"
        >
          <ArtistCard :artist="item" compact />

          <button
            class="remove-btn"
            @click="removeItem(item.id)"
            :aria-label="t('playlist.removeArtist', { name: item.name })"
          >
            {{ t('playlist.remove') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-box {
  background: white;
  width: 95%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.25);
  animation: fadeIn .25s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
}

.rename-box {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.rename-box input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 10px;
  border: 2px solid rgba(153, 0, 112, 0.25);
}

.rename-box button {
  background: var(--color-primary);
  color: white;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}

.items-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;

  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 22px;
}

.items-list::-webkit-scrollbar {
  width: 8px;
}
.items-list::-webkit-scrollbar-thumb {
  background: rgba(153, 0, 112, 0.35);
  border-radius: 10px;
}

.artist-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.artist-wrapper .artist-card {
  transform: scale(0.85);
  transform-origin: top center;
}

.artist-wrapper .artist-card img.compact {
  height: 110px !important;
  border-radius: 12px;
}

.artist-wrapper .artist-card h2.compact {
  font-size: 0.85rem !important;
  padding: 6px 10px !important;
}

.remove-btn {
  background: rgba(153, 0, 112, 0.35);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  width: 80%;
  text-align: center;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(153, 0, 112, 0.15);
  
}

@media (max-width: 600px) {
  .items-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .artist-wrapper .artist-card img.compact {
    height: 95px !important;
  }
}

</style>