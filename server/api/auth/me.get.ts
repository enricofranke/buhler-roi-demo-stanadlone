export default defineEventHandler(async (event) => {
  // Get current user session
  const session = await getUserSession(event)
  
  if (!session || !session.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }
  
  return { user: session.user, session }
})