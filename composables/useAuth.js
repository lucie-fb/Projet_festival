export function useAuth() {
  const user = useState('user', () => null)
  const nuxtApp = useNuxtApp()

  async function login() {
    await nuxtApp.$oidc.signinRedirect()
  }

  async function logout() {
    await nuxtApp.$oidc.signoutRedirect()
  }

  async function loadUser() {
    const u = await nuxtApp.$oidc.getUser()
    user.value = u
  }

  return { user, login, logout, loadUser }
}
