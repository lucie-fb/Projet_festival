<script setup>
const nuxtApp = useNuxtApp()
const { loadUser } = useAuth()

onMounted(async () => {
  await nuxtApp.$oidc.signinRedirectCallback()
  await loadUser()
  navigateTo('/')
})
</script>

<template>
  <p>Connexion en cours...</p>
</template>
