export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, fetch } = useUserSession()

  if (process.server) {
    try {
      await fetch()
    } catch {}
  }

  if (loggedIn.value) {
    return navigateTo('/')
  }
})