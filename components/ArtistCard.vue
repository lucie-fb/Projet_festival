<script setup>
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserDataStore } from "@/stores/userData";

const props = defineProps({
  artist: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const route = useRoute();
const emit = defineEmits(["select"]);
const userData = useUserDataStore();
const { t } = useI18n();
const localePath = useLocalePath();
const clickArtists = () => {
  if (route.path === "/artists") {
    emit("select", props.artist.name);
    return;
  }
  router.push(
    localePath(`/artists/[id]?name=${encodeURIComponent(props.artist.name)}`),
  );
};

const isFavorite = computed(()=>
  userData.isFavorite(props.artist.id)
);

const toggleFavorite = async () => {

  if (isFavorite.value) {
    await $fetch("/api/favorites/unlike", {
       method: "POST",
      body: {
        artistId: props.artist.id,
      },
      credentials: "include",
    });
     userData.favorites = userData.favorites.filter(
      f => f.artistId !== props.artist.id
    );
    }
   else {
    await $fetch("/api/favorites/like", {
     method: "POST",
      body: {
        artistId: props.artist.id,
        name: props.artist.name,
        image: props.artist.image,
      },
      credentials: "include",
    });
     userData.favorites.push({
      artistId: props.artist.id,
      name: props.artist.name,
      image: props.artist.image
})
   };
  }
  
const showMenu = ref(false);

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

async function addToPlaylist(playlistId) {
  await $fetch("/api/playlists/add-item", {
    method: "POST",
    body: {
      playlistId,
      artistId: props.artist.id,
      name: props.artist.name,
      image: props.artist.image,
    },
    credentials: "include",
  });
  showMenu.value = false;
}

function goToCreatePlaylist() {
  router.push(localePath("/favorites"));
}

const playlists = computed(()=>userData.playlists)
</script>

<template>
  <article
    class="card artist-card"
    tabindex="0"
    role="button"
    @click="clickArtists"
    @keydown.enter="clickArtists"
    @keydown.space.prevent="clickArtists"
    :aria-label="t('artist.openArtist', { name: artist.name })"
  >
    <button
      v-if="!compact"
      class="fav-btn"
      @click.stop="toggleFavorite"
      :aria-pressed="isFavorite"
      :aria-label="
        isFavorite ? t('artist.removeFromLiked') : t('artist.addToLiked')
      "
    >
      <svg
        v-if="isFavorite"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#FF2D55"
      >
        <path
          d="M12 21s-6.2-4.35-9.33-8.48C-1.2 8.4 1.02 3 5.6 3c2.3 0 4.07 1.33 5.4 3.09C12.93 4.33 14.7 3 17 3c4.58 0 6.8 5.4 2.93 9.52C18.2 16.65 12 21 12 21z"
        />
      </svg>

      <svg
        v-else
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF2D55"
        stroke-width="2"
      >
        <path
          d="M12.1 20.3l-.1.1-.1-.1C7.14 16.36 3.6 13.28 3.6 9.5 3.6 6.42 6.02 4 9.1 4c1.74 0 3.41.81 4.4 2.09C14.49 4.81 16.16 4 17.9 4c3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.54 6.86-8.3 10.8z"
        />
      </svg>
    </button>

    <button
      v-if="!compact"
      class="menu-btn"
      @click.stop="toggleMenu"
      aria-haspopup="true"
      :aria-expanded="showMenu"
      aria-controls="artist-menu"
      :aria-label="t('artist.openMenu')"
    >
      ⋮
    </button>

    <div
      v-if="showMenu && !compact"
      class="menu-popup"
      id="artist-menu"
      role="menu"
      @keydown.esc="showMenu = false"
      @click.stop
    >
      <button role="menuitem" @click="addToDefault">
        {{ t("artist.addToLiked") }}
      </button>

      <button
        v-for="p in playlists"
        :key="p.id"
        role="menuitem"
        @click="addToPlaylist(p.id)"
      >
        {{ t("artist.addToPlaylist", { name: p.name }) }}
      </button>

      <button class="create-btn" role="menuitem" @click="goToCreatePlaylist">
        {{ t("artist.createPlaylist") }}
      </button>
    </div>

    <img
      :src="artist.image"
      :alt="t('artist.alt', { name: artist.name })"
      :class="{ compact: compact }"
    />
    <h2 :class="{ compact: compact }">{{ artist.name }}</h2>
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
  border: 1px solid rgba(153, 0, 112, 0.15);
  box-shadow: 0 4px 14px rgba(153, 0, 112, 0.15);
  position: relative;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  cursor: pointer;
}

.artist-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 28px rgba(153, 0, 112, 0.25);
}

/* IMAGE */
.artist-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 12px;
  transition: transform 0.25s ease;
}

.artist-card:hover img {
  transform: scale(1.03);
}

/* NOM ARTISTE */
.artist-card h2 {
  background: var(--color-secondary);
  color: var(--color-primary);
  padding: 8px 14px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 10px;
  transition: background 0.25s ease;
}

.artist-card:hover h2 {
  background: var(--color-primary);
  color: white;
}

.artist-card img.compact {
  height: 110px !important;
  border-radius: 12px;
}

.artist-card h2.compact {
  font-size: 0.85rem !important;
  padding: 6px 10px !important;
}

/* ❤️ FAVORI */
.fav-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: white;
  border: none;
  border-radius: 50%;
  padding: 6px;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.fav-btn:hover {
  transform: scale(1.15);
}

/* ⋮ MENU BUTTON */
.menu-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  background: white;
  border: none;
  border-radius: 50%;
  padding: 6px 8px;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  font-size: 18px;
  transition: transform 0.2s ease;
}

.menu-btn:hover {
  transform: scale(1.15);
}

.menu-popup {
  position: absolute;
  top: 48px;
  left: 12px;
  background: white;
  border-radius: 14px;
  padding: 10px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 30;
  min-width: 180px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-popup button {
  background: none;
  border: none;
  text-align: left;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 0.9rem;
  border-radius: 8px;
  transition:
    background 0.2s ease,
    padding-left 0.2s ease;
}

.menu-popup button:hover {
  background: rgba(153, 0, 112, 0.1);
  padding-left: 14px;
}

.create-btn {
  color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 900px) {
  .artist-card {
    padding: 14px;
    border-radius: 18px;
  }

  .artist-card img {
    height: 180px;
  }

  .artist-card h2 {
    font-size: 0.95rem;
    padding: 6px 12px;
  }

  .fav-btn,
  .menu-btn {
    padding: 5px 7px;
  }

  .menu-popup {
    min-width: 160px;
  }
}

@media (max-width: 600px) {
  .artist-card {
    padding: 12px;
    border-radius: 16px;
  }

  .artist-card img {
    height: 150px;
  }

  .artist-card h2 {
    font-size: 0.9rem;
    padding: 6px 10px;
  }

  .fav-btn,
  .menu-btn {
    padding: 5px 6px;
    font-size: 16px;
  }

  .menu-popup {
    min-width: 140px;
    padding: 8px;
  }

  .menu-popup button {
    font-size: 0.85rem;
    padding: 6px 8px;
  }
}

@media (max-width: 400px) {
  .artist-card img {
    height: 130px;
  }

  .artist-card h2 {
    font-size: 0.85rem;
  }

  .menu-popup {
    min-width: 130px;
  }
}
</style>

<style lang="css">
:focus {
  outline: 3px solid #151414;
  outline-offset: 4px;
}
</style>
