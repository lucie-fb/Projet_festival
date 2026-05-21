<script setup>
import { useRouter } from '#app'
import { onMounted } from 'vue'

const router = useRouter()
const { $oidc } = useNuxtApp()

onMounted(async () => {
  await $oidc.signinRedirectCallback()
  router.push('/festivals')
})
</script>

<template>
  <div>Connexion en cours...</div>
</template>
