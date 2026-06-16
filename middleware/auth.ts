// @ts-nocheck
export default defineNuxtRouteMiddleware(async () => {

  const { user, loadUser } = useAuth()
  const localePath = useLocalePath()

  if (!user.value) {
    await loadUser()
  }

  if (!user.value) {
    return navigateTo(localePath('/login'))
  }
})
