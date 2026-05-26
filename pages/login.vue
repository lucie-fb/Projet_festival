<script setup>
const { user, login, logout, loadUser } = useAuth()

onMounted(() => {
  loadUser()
})
</script>

<template>
  <div>
    <div>
    <h1>Bienvenue sur</h1>
    <img alt="Logo du site Sun and Sound" src="/public/images/logo_sun&sound.png" width="30" height="30">
    </div>

    <div v-if="user">
      <p>Connecté en tant que {{ user.profile.name }}</p>
      <button @click="logout">Se déconnecter</button>
    </div>

    <div v-else>
      <button @click="login">Se connecter avec Zitadel</button>
    </div>
  </div>
</template>