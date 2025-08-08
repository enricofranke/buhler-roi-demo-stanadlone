export const useAuth = () => {
  // Get user session from nuxt-auth-utils
  const { user, loggedIn, fetch: fetchSession, clear: clearSession } = useUserSession()

  // Login function
  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: credentials
      })

      if (response.success) {
        // Refresh session after successful login
        await fetchSession()
        return { success: true, user: response.user }
      }
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 401,
        statusMessage: error.data?.message || 'Login failed'
      })
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      // Even if server logout fails, clear local session
      console.warn('Server logout failed:', error)
    } finally {
      // Clear local session
      await clearSession()
    }
  }

  // Check if user has specific role
  const hasRole = (role: string) => {
    return computed(() => user.value?.role === role)
  }

  // Check if user is admin
  const isAdmin = computed(() => user.value?.role === 'admin')

  return {
    user: readonly(user),
    loggedIn: readonly(loggedIn),
    login,
    logout,
    fetchSession,
    hasRole,
    isAdmin
  }
}