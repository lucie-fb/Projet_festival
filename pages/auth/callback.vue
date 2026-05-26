<script setup>
import { onMounted, nextTick } from 'vue'
import { useAuth } from '~/composables/useAuth'

const nuxtApp = useNuxtApp()
const { loadUser } = useAuth()

onMounted(async () => {
  await nextTick()

  // 1. Finir le login OIDC
  await nuxtApp.$oidc.signinRedirectCallback()

  // 2. Charger l'utilisateur
  await loadUser()

  // 3. Rediriger
  navigateTo('/')
})
</script>

<template>
  <p>Connexion en cours...</p>
</template>
