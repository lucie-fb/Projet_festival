<script setup>
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const query = defineModel('query')
const emit = defineEmits(['search'])
const router = useRouter();
const route = useRoute();
const localePath = useLocalePath();
const props = defineProps({})
const { t } = useI18n();

function onSearch() {
  if (route.path.includes('/artists') || route.path.includes('/festivals')) {
    emit("search")
    return;
  }
  router.push(localePath(`/artists/[id]?name=${encodeURIComponent(query.value)}`))
}
</script>

<template>
  <div class="searchbar">
    <label for="search-input" class="sr-only">
      {{ t('search.label') }}
    </label>
    <input
      id="search-input"
      type="search"
      :placeholder="t('search.placeholder')"
      v-model="query"
      @keyup.enter="onSearch"
      class="search-input"
      aria-label="Recherche"
    />

    <button
      class="search-btn"
      @click="onSearch"
      @keydown.enter="onSearch"
      @keydown.space.prevent="onSearch"
      :aria-label="t('search.button')"
    >
      <img
        width="16"
        height="16"
        :alt="t('search.alt')"
        src="/images/icon_search.png"
      />
    </button>
  </div>
</template>

<style lang="css" scoped>

.searchbar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-white);
  border: 2px solid var(--color-primary); 
  border-radius: 16px;
  padding: 8px 12px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: var(--shadow-soft);
}


.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 8px;
  background: transparent;
  color: var(--color-black);
  font-family: 'Poppins', sans-serif;
}

.search-input::placeholder {
  color: #777;
}

.search-btn {
  background: var(--color-secondary); /* Rose clair */
  border: none;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background: #ffd6f4;
}

.search-btn img {
  width: 18px;
  height: 18px;
}

@media (max-width: 900px) {
  .searchbar {
    max-width: 420px;
    padding: 6px 10px;
    gap: 8px;
  }

  .search-input {
    font-size: 0.95rem;
    padding: 6px;
  }

  .search-btn {
    padding: 8px 12px;
  }

  .search-btn img {
    width: 16px;
    height: 16px;
  }
}

@media (max-width: 600px) {
  .searchbar {
    max-width: 100%;
    padding: 6px 10px;
    border-radius: 14px;
  }

  .search-input {
    font-size: 0.9rem;
    padding: 6px;
  }

  .search-btn {
    padding: 8px 10px;
    border-radius: 10px;
  }

  .search-btn img {
    width: 15px;
    height: 15px;
  }
}

@media (max-width: 400px) {
  .searchbar {
    padding: 5px 8px;
    gap: 6px;
  }

  .search-input {
    font-size: 0.85rem;
  }

  .search-btn {
    padding: 7px 8px;
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