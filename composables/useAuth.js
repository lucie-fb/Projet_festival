// composables/useAuth.js
import { ref } from 'vue'

export const useAuth = () => {
  const user = ref(null)
  const nuxtApp = useNuxtApp()

  function login() {
    nuxtApp.$oidc.signinRedirect()
  }

  function logout() {
    nuxtApp.$oidc.signoutRedirect()
  }

  async function loadUser() {
    if (!nuxtApp.$oidc) {
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    if (!nuxtApp.$oidc) {
      console.warn('OIDC non chargé')
      return
    }

    const u = await nuxtApp.$oidc.getUser()
    user.value = u
  }

  async function isAuthenticated() {
    await loadUser()
    return !!user.value && !user.value.expired
  }

  return { user, login, logout, loadUser, isAuthenticated }
}