<script setup>
import { ref } from "vue";
/**
 * On expose un v-model personnalisé : v-model:query
 * Ça veut dire que le parent pourra faire :
 * <SearchBar v-model:query="searchTerm" />
 */
const query = defineModel('query')
/**
 * On déclare un événement "search"
 * Le parent pourra écouter : @search="search"
 */
const emit = defineEmits(['search'])
</script>

<template>
    <div>
    <input type="search" placeholder="Recherche" v-model="query">
    <button @click="emit('search')"><img width="16" height="16" alt="Bouton de recherche" src="/images/icon_search.png"></button>
    </div>
</template>