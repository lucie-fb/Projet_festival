<script setup>
import { onMounted, nextTick } from 'vue'
import { useAuth } from '~/composables/useAuth'

const nuxtApp = useNuxtApp()
const { loadUser } = useAuth()
const localePath = useLocalePath()
const { t } = useI18n()

onMounted(async () => {
  await nextTick()

  await nuxtApp.$oidc.signinRedirectCallback()

  await loadUser()

  navigateTo(localePath('/'))
})
</script>

<template>
  <div class="loading-connection">
  <div class="loading-spinner"></div>
  <p class="loading-text">{{ t('login.loading') }}</p>
</div>

</template>

<style lang="css" scoped>
.loading-connection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  gap: 20px;
  animation: fadeIn 0.4s ease;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 5px solid rgba(255, 192, 238, 0.3); /* rose clair transparent */
  border-top-color: #FFC0EE; /* rose clair */
  animation: spin 1s linear infinite;
  box-shadow: 0 0 12px rgba(255, 192, 238, 0.6);
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

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

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>