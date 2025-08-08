export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  // Validate credentials (using your existing basic auth)
  if (username === 'buhler' && password === 'demo2025') {
    // Set user session using nuxt-auth-utils
    await setUserSession(event, {
      user: {
        username: 'buhler',
        role: 'admin',
        name: 'Bühler Admin'
      },
      loggedInAt: new Date()
    })

    return { success: true, user: { username: 'buhler', role: 'admin', name: 'Bühler Admin' } }
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }
})