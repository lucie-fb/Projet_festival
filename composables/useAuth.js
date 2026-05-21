export function useAuth() {
  const { $oidc } = useNuxtApp()
  console.log("OIDC plugin loaded")
  return {
    login: () => $oidc.signinRedirect(),
    logout: () => $oidc.signoutRedirect(),
    getUser: () => $oidc.getUser(),
    isAuthenticated: async () => {
      const user = await $oidc.getUser()
      return !!user && !user.expired
    }
  }
}