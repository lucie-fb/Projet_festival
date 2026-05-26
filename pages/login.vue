<script setup>
const { user, login, logout, loadUser } = useAuth()

onMounted(() => {
  loadUser()
})
</script>

<template>
  <div>
    <h1>Connexion</h1>

    <div v-if="user">
      <p>Connecté en tant que {{ user.profile.name }}</p>
      <button @click="logout">Se déconnecter</button>
    </div>

    <div v-else>
      <button @click="login">Se connecter avec Zitadel</button>
    </div>
  </div>
</template>
