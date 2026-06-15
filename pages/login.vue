<script setup>


const { user, login, logout, loadUser } = useAuth();
const { t } = useI18n();
const isLoadingUser = ref(true);

onMounted(async() => {
  await loadUser();
  isLoadingUser.value = false;
});
</script>

<template>
  <div class="login-page">
    <div class="login-box">
      <h1 class="login-title">{{ t('login.welcome') }}</h1>

      <img
        :alt="t('login.logoAlt')"
        src="/public/images/logo_sun&sound.png"
        class="login-logo"
      />
      <div v-if="isLoadingUser" class="loading-connection">
        <div class="loading-spinner"></div>
        <p class="loading-text">{{ t('login.loading') }}</p>
      </div>

      <div v-else-if="user" class="login-content">
        <p class="login-text">{{ t('login.loggedInAs') }} {{ user.profile.email }}</p>
        <button class="btn-login" @click="logout">{{ t('login.logout') }}</button>
      </div>

      <div v-else class="login-content">
        <button class="btn-login" @click="login">{{ t('login.login') }}</button>
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

.loading-connection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 30px 0;
  animation: fadeIn 0.4s ease;
}

/* Cercle animé */
.loading-spinner {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  border: 5px solid rgba(255, 192, 238, 0.4); /* rose clair transparent */
  border-top-color: var(--color-secondary);   /* rose clair */
  animation: spin 1s linear infinite;
  box-shadow: 0 0 12px rgba(255, 192, 238, 0.6);
}

/* Texte */
.loading-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-white);
  letter-spacing: 0.5px;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
}

/* Animation rotation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Apparition douce */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
