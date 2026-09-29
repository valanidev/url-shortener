'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import {
  hashPassword,
  verifyPassword,
  generateToken,
  getAuthUser,
} from '@/lib/auth'

type ActionResult<T = undefined> =
  | { success: true; message: string; data?: T }
  | { success: false; error: string }

export async function login(
  email: string,
  password: string
): Promise<ActionResult<{ id: string; email: string }>> {
  try {
    if (!email || !password) {
      return { success: false, error: 'Champs manquants' }
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { success: false, error: 'Identifiants invalides' }
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return { success: false, error: 'Identifiants invalides' }
    }

    const token = generateToken({ userId: user.id, email: user.email })

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return {
      success: true,
      message: 'Connexion réussie',
      data: { id: user.id, email: user.email },
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return { success: false, error: 'Erreur serveur' }
  }
}

export async function logout(): Promise<ActionResult> {
  const cookieStore = await cookies()
  cookieStore.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  })

  return { success: true, message: 'Déconnexion réussie' }
}

export async function register(
  email: string,
  password: string,
  confirmPassword: string
): Promise<ActionResult<{ id: string; email: string; createdAt: Date }>> {
  try {
    if (!email || !password || !confirmPassword) {
      return { success: false, error: 'Champs manquants' }
    }

    if (password !== confirmPassword) {
      return { success: false, error: 'Les mots de passe ne correspondent pas' }
    }

    const minPasswordLength =
      Number(process.env.NEXT_PUBLIC_MIN_PASSWORD_LENGTH) || 8
    if (password.length < minPasswordLength) {
      return {
        success: false,
        error: `Le mot de passe doit contenir au moins ${minPasswordLength} caractères`,
      }
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { success: false, error: 'Cet email est déjà utilisé' }
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true, createdAt: true },
    })

    const cookieStore = await cookies()
    const pendingLinkId = cookieStore.get('pending_link_id')?.value
    if (pendingLinkId) {
      await prisma.link.update({
        where: { id: pendingLinkId, userId: null },
        data: { userId: user.id, expiresAt: null },
      })
      cookieStore.delete('pending_link_id')
    }

    return { success: true, message: 'Compte créé avec succès', data: user }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return { success: false, error: 'Erreur serveur' }
  }
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<ActionResult> {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return { success: false, error: 'Non authentifié' }
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: 'Veuillez remplir tous les champs' }
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: 'Les nouveaux mots de passe ne correspondent pas',
      }
    }

    if (currentPassword === newPassword) {
      return {
        success: false,
        error: "Le nouveau mot de passe doit être différent de l'ancien",
      }
    }

    const minPasswordLength =
      Number(process.env.NEXT_PUBLIC_MIN_PASSWORD_LENGTH) || 8
    if (newPassword.length < minPasswordLength) {
      return {
        success: false,
        error: `Le nouveau mot de passe doit contenir au moins ${minPasswordLength} caractères`,
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    })

    if (!user) {
      return { success: false, error: 'Utilisateur introuvable' }
    }

    const isValid = await verifyPassword(currentPassword, user.password)
    if (!isValid) {
      return { success: false, error: 'Mot de passe actuel incorrect' }
    }

    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id: authUser.userId },
      data: { password: hashedPassword },
    })

    return { success: true, message: 'Mot de passe mis à jour avec succès' }
  } catch (error) {
    console.error('Erreur mise à jour mot de passe:', error)
    return { success: false, error: 'Erreur serveur' }
  }
}

export async function deleteAccount(password: string): Promise<ActionResult> {
  try {
    const authUser = await getAuthUser()
    if (!authUser) {
      return { success: false, error: 'Non authentifié' }
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
    })

    if (!user) {
      return { success: false, error: 'Utilisateur introuvable' }
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return { success: false, error: 'Mot de passe incorrect' }
    }

    await prisma.user.delete({ where: { id: authUser.userId } })

    const cookieStore = await cookies()
    cookieStore.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    })

    return { success: true, message: 'Compte supprimé avec succès' }
  } catch (error) {
    console.error('Erreur suppression compte:', error)
    return { success: false, error: 'Erreur serveur' }
  }
}
