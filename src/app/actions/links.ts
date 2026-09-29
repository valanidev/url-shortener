'use server'

import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { getAuthUser } from '@/lib/auth'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) {
    throw new Error('URL vide')
  }

  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`

  let parsed: URL
  try {
    parsed = new URL(withScheme)
  } catch {
    throw new Error('URL invalide')
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Seules les URL http(s) sont acceptées')
  }

  if (!parsed.hostname) {
    throw new Error('Hostname manquant')
  }

  return parsed.toString()
}

export async function createLink(
  originalUrl: string,
  customSlug?: string,
  durationSeconds?: number | null
) {
  if (!originalUrl) {
    return { error: 'URL manquante' }
  }

  const normalizedUrl = normalizeUrl(originalUrl)

  const user = await getAuthUser()

  let expiresAt: Date | null = null
  if (durationSeconds && durationSeconds > 0) {
    expiresAt = new Date(Date.now() + durationSeconds * 1000)
  } else if (!user && durationSeconds === undefined) {
    expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000)
  }

  if (customSlug && customSlug.trim() !== '') {
    const slug = customSlug.trim()

    if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
      return {
        error:
          'Le lien personnalisé ne peut contenir que des lettres, chiffres, tirets et underscores',
      }
    }

    const MIN_SLUG_LENGTH = 6
    const MAX_SLUG_LENGTH = 16
    if (slug.length < MIN_SLUG_LENGTH || slug.length > MAX_SLUG_LENGTH) {
      return {
        error: `Le lien personnalisé doit contenir entre ${MIN_SLUG_LENGTH} et ${MAX_SLUG_LENGTH} caractères`,
      }
    }

    const existing = await prisma.link.findUnique({
      where: { shortCode: slug },
    })

    if (existing) {
      return { error: 'Ce lien personnalisé est déjà utilisé' }
    }

    try {
      const newLink = await prisma.link.create({
        data: {
          originalUrl: normalizedUrl,
          shortCode: slug,
          expiresAt,
          userId: user ? user.userId : null,
        },
      })

      revalidatePath('/')
      revalidatePath('/dashboard')

      return { link: newLink }
    } catch (error) {
      console.error('Erreur création custom slug:', error)
      return { error: 'Impossible de créer le lien personnalisé' }
    }
  }

  const maxRetries = 5
  let attempts = 0
  let newLink = null

  while (attempts < maxRetries) {
    try {
      const shortCode = nanoid(6)

      newLink = await prisma.link.create({
        data: {
          originalUrl: normalizedUrl,
          shortCode,
          expiresAt,
          userId: user ? user.userId : null,
        },
      })
      break
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        attempts++
        continue
      }
      console.error("Détail de l'erreur createLink:", error)
      return { error: 'Erreur serveur' }
    }
  }

  if (!newLink) {
    return { error: 'Impossible de générer un code unique, veuillez réessayer' }
  }

  revalidatePath('/')
  revalidatePath('/dashboard')

  if (!user && newLink) {
    const cookieStore = await cookies()
    cookieStore.set('pending_link_id', newLink.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
  }

  return { link: newLink }
}

export async function deleteLink(id: string) {
  const user = await getAuthUser()
  if (!user) {
    return { error: 'Non authentifié' }
  }

  const existingLink = await prisma.link.findUnique({ where: { id } })
  if (!existingLink) {
    return { error: 'Lien introuvable' }
  }

  if (existingLink.userId !== user.userId) {
    return { error: 'Accès refusé' }
  }

  await prisma.link.delete({ where: { id } })

  revalidatePath('/dashboard')

  return { success: true }
}

export async function updateLink(id: string, data: { isActive?: boolean }) {
  const user = await getAuthUser()
  if (!user) {
    return { error: 'Non authentifié' }
  }

  const existingLink = await prisma.link.findUnique({ where: { id } })
  if (!existingLink) {
    return { error: 'Lien introuvable' }
  }

  if (existingLink.userId !== user.userId) {
    return { error: 'Accès refusé' }
  }

  const updated = await prisma.link.update({
    where: { id },
    data: {
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  })

  revalidatePath('/dashboard')

  return { link: updated }
}
