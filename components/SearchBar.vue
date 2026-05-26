<script setup>
import { ref } from "vue";

const query = defineModel('query')
const emit = defineEmits(['search'])
</script>

<template>
    <div>
    <input type="search" placeholder="Recherche" v-model="query">
    <button @click="emit('search')"><img width="16" height="16" alt="Bouton de recherche" src="/images/icon_search.png"></button>
    </div>
</template>