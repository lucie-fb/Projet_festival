<script setup>
const { user, login, logout, loadUser } = useAuth();

onMounted(() => {
  loadUser();
});
</script>

<template>
  <div class="login-page">
    <div class="login-box">
      <h1 class="login-title">Bienvenue sur</h1>

      <img
        alt="Logo du site Sun and Sound"
        src="/public/images/logo_sun&sound.png"
        class="login-logo"
      />

      <div v-if="user" class="login-content">
        <p class="login-text">Connecté en tant que {{ user.profile.email }}</p>
        <button class="btn-login" @click="logout">Se déconnecter</button>
      </div>

      <div v-else class="login-content">
        <button class="btn-login" @click="login">Se connecter</button>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.login-page {
  background: var(--color-white);
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  font-family: "Poppins", sans-serif;
}

/* Bloc violet */
.login-box {
  background: var(--color-primary);
  padding: 40px 50px;
  border-radius: 22px;
  text-align: center;
  width: 100%;
  max-width: 420px;
  box-shadow: var(--shadow-strong);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Titre */
.login-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
}

/* Logo */
.login-logo {
  width: 180px;
  margin: 0 auto 10px;
  display: block;
}

/* Texte connecté */
.login-text {
  font-size: 1.1rem;
  color: var(--color-white);
  margin-bottom: 10px;
}

/* Conteneur des infos */
.login-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Boutons */
.btn-login {
  background: var(--color-secondary);
  color: var(--color-primary);
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s ease;
  display: inline-block;
  text-decoration: none;
}

.btn-login:hover {
  background: #ffd6f4;
}

/* Lien "Supprimer mon compte" */
.login-content a.btn-login {
  margin-top: 6px;
}

</style>
