<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { login, logout, getUser, isAuthenticated } = useAuth()
const user = ref(null)

onMounted(async () => {
  if (await isAuthenticated()) {
    user.value = await getUser()
  }
})
</script>

<template>
  <div>
    <button v-if="!user" @click="login">Se connecter</button>
    <div v-else>
      <p>Bonjour {{ user.profile.name }}</p>
      <button @click="logout">Disconnected</button>
    </div>
  </div>
</template>
