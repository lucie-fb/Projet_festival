// @ts-nocheck
export default defineNuxtRouteMiddleware(async () => {
  const { user, loadUser } = useAuth()

  if (!user.value) {
    await loadUser()
  }

  if (!user.value) {
    return navigateTo('/login')
  }
})
