import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('La variable d’environnement JWT_SECRET n’est pas définie.')
  }
  return secret
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashed)
}

export function generateToken(payload: {
  userId: string
  email: string
}): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' })
}

export function verifyToken(
  token: string
): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, getJwtSecret()) as {
      userId: string
      email: string
    }
  } catch {
    return null
  }
}

export async function getAuthUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null
  return verifyToken(token)
}
