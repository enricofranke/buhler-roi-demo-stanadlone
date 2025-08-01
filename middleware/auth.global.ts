export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on server side and in production
  if (process.client || process.env.NODE_ENV !== 'production') {
    return
  }

  // Skip auth check for health checks and static assets
  if (to.path.startsWith('/health') || 
      to.path.startsWith('/_nuxt') || 
      to.path.startsWith('/favicon') ||
      to.path.startsWith('/robots')) {
    return
  }

  const headers = useRequestHeaders()
  const authorization = headers.authorization

  // Basic Auth credentials (you can set these via environment variables)
  const username = process.env.BASIC_AUTH_USER || 'buhler'
  const password = process.env.BASIC_AUTH_PASSWORD || 'demo2024'
  const expectedAuth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`

  if (!authorization || authorization !== expectedAuth) {
    // Send 401 Unauthorized with WWW-Authenticate header
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: {
        headers: {
          'WWW-Authenticate': 'Basic realm="Bühler ROI Calculator Demo"'
        }
      }
    })
  }
})