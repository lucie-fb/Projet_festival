<script setup>
import { ref } from "vue";
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";

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
    <input
      type="search"
      :placeholder="t('search.placeholder')"
      v-model="query"
      @keyup.enter="onSearch"
      class="search-input"
    />

    <button class="search-btn" @click="onSearch">
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

/* Bouton */
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

</style>