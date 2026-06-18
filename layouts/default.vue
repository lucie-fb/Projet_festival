<script setup>
import { onMounted } from "vue"
const userData = useUserDataStore()
const { $oidc } = useNuxtApp()

onMounted(async () => {
  if (!$oidc) {
    console.warn("OIDC non chargé")
    return
  }

  const user = await $oidc.getUser()

  if (user && !user.expired) {
    await userData.load()
  }
})
</script>

<template>
  <Header />
  <main><slot/></main>
  <Footer />
</template>
