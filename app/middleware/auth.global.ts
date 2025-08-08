export default defineNuxtRouteMiddleware(async (to) => {
  const publicPaths = new Set(['/login', '/customer-data'])

  // Allow public pages
  if (publicPaths.has(to.path)) return

  // Check session
  const { loggedIn, fetch } = useUserSession()

  // Ensure session is fetched on server during SSR
  if (process.server) {
    try {
      await fetch()
    } catch {
      // Ignore fetch errors and treat as not logged in
    }
  }

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})


