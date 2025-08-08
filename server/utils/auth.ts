import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'

export interface User {
  id: string
  username: string
  role: string
}

export function createToken(user: User): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User
  } catch {
    return null
  }
}

export function getUserFromCookie(event: any): User | null {
  const token = getCookie(event, 'auth-token')
  if (!token) return null
  return verifyToken(token)
}