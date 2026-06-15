<script setup>

definePageMeta({
  middleware: 'auth'
})

const { user, loadUser } = useAuth();
const isLoading = ref(true);
const { t } = useI18n();

onMounted(() => {
  loadUser();
  isLoading.value = false
});
</script>

<template>
  <div class="account-page">
    <div class="account-box">

      <h1 class="account-title">{{ t('account.title') }}</h1>

      <div v-if="user" class="account-info">
        <p><strong>{{ t('account.firstname') }} :</strong> {{ user.profile.given_name }}</p>
        <p><strong>{{ t('account.lastname') }} :</strong> {{ user.profile.family_name }}</p>
        <p><strong>{{ t('account.email') }} :</strong> {{ user.profile.email }}</p>

        <a
          class="btn-danger"
          href="https://sun-and-sound-q7pe8b.eu1.zitadel.cloud/ui/console/users/me"
        >
          {{ t('account.delete') }}
        </a>
      </div>
      <div v-else class="loading-box">
  <div class="pulse-loader"></div>
  <p>{{ t('account.loading') }}</p>
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

.account-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 10px;
  text-align: center;
}

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

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.pulse-loader {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: pulse 1s infinite ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.6; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.6; }
}

.loading-box p {
  margin-top: 12px;
  font-size: 1.1rem;
  color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 900px) {
  .account-page {
    padding: 30px 16px;
  }

  .account-box {
    padding: 32px 36px;
    max-width: 420px;
  }

  .account-title {
    font-size: 1.6rem;
  }

  .account-info p {
    font-size: 1rem;
    padding: 10px 14px;
  }

  .btn-danger {
    font-size: 0.95rem;
    padding: 12px 16px;
  }
}

@media (max-width: 600px) {
  .account-page {
    padding: 20px 12px;
  }

  .account-box {
    padding: 26px 22px;
    max-width: 100%;
    border-radius: 18px;
  }

  .account-title {
    font-size: 1.4rem;
  }

  .account-info p {
    font-size: 0.95rem;
    padding: 10px 12px;
  }

  .btn-danger {
    width: 100%;
    font-size: 0.9rem;
    padding: 12px;
    border-radius: 12px;
  }
}

@media (max-width: 400px) {
  .account-title {
    font-size: 1.25rem;
  }

  .account-info p {
    font-size: 0.9rem;
  }
}
</style>

