<script setup>

definePageMeta({
  middleware: 'auth'
})

const { user, loadUser } = useAuth();
const isLoading = ref(true);

onMounted(() => {
  loadUser();
  isLoading.value = false
});
</script>

<template>
  <div class="account-page">
    <div class="account-box">

      <h1 class="account-title">Mon Compte</h1>

      <div v-if="user" class="account-info">
        <p><strong>Prénom :</strong> {{ user.profile.given_name }}</p>
        <p><strong>Nom :</strong> {{ user.profile.family_name }}</p>
        <p><strong>Email :</strong> {{ user.profile.email }}</p>

        <a
          class="btn-danger"
          href="https://sun-and-sound-q7pe8b.eu1.zitadel.cloud/ui/console/users/me"
        >
          Supprimer mon compte
        </a>
      </div>
      <div v-else="isLoading" class="loading-box">
      <div class="spinner"></div>
      <p>Chargement de votre compte…</p>
    </div>

    </div>
  </div>
</template>



<style lang="css" scoped>
.account-page {
  background: var(--color-white);
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  font-family: "Poppins", sans-serif;
}

/* Carte blanche */
.account-box {
  background: #ffffff;
  padding: 40px 50px;
  border-radius: 22px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: left;
}

/* Titre */
.account-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 10px;
  text-align: center;
}

/* Bloc infos */
.account-info {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.account-info p {
  font-size: 1.1rem;
  color: #333;
  background: #f8f8f8;
  padding: 12px 16px;
  border-radius: 12px;
  border-left: 4px solid var(--color-primary);
}

/* Boutons */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-white);
  padding: 14px 20px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s ease;
  text-align: center;
  text-decoration: none;
}

.btn-primary:hover {
  background: #7a005a;
}

.btn-danger {
  background: var(--color-secondary);
  color: var(--color-primary);
  padding: 14px 20px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s ease;
  text-align: center;
  text-decoration: none;
}

.btn-danger:hover {
  background: #ffd6f4;
}

</style>

