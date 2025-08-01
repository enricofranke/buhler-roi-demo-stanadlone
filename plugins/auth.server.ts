export default defineNitroPlugin(async (nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    const url = event.node.req.url || ''
    
    // Skip auth for health checks and static assets
    if (url.startsWith('/api/health') || 
        url.startsWith('/_nuxt') || 
        url.startsWith('/favicon') ||
        url.startsWith('/robots')) {
      return
    }

    // Only apply auth in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Skipping auth - not production:', process.env.NODE_ENV)
      return
    }

    // Get authorization header
    const authorization = getHeader(event, 'authorization')

    // Basic Auth credentials
    const username = process.env.BASIC_AUTH_USER || 'buhler'
    const password = process.env.BASIC_AUTH_PASSWORD || 'demo2024'
    const expectedAuth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`

    console.log('Nitro Auth Check:', { 
      url, 
      hasAuth: !!authorization, 
      nodeEnv: process.env.NODE_ENV,
      expectedAuth: expectedAuth.substring(0, 20) + '...', 
      username,
      receivedAuth: authorization?.substring(0, 20) + '...' || 'none'
    })

    if (!authorization || authorization !== expectedAuth) {
      console.log('Auth failed - sending 401')
      
      // Set 401 status and WWW-Authenticate header
      setResponseStatus(event, 401)
      setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="Bühler ROI Calculator Demo"')
      setResponseHeader(event, 'Content-Type', 'text/plain')
      
      // Send 401 response
      return send(event, 'Authentication required')
    }

    console.log('Auth successful for:', url)
  })
})