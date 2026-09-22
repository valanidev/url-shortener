'use server'

import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { getAuthUser } from '@/lib/auth'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function createLink(originalUrl: string) {
  if (!originalUrl) {
    return { error: 'URL manquante' }
  }

  const user = await getAuthUser()

  let expiresAt: Date | null = null
  if (!user) {
    expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
  }

  const maxRetries = 5
  let attempts = 0
  let newLink = null

  while (attempts < maxRetries) {
    try {
      const shortCode = nanoid(6)

      newLink = await prisma.link.create({
        data: {
          originalUrl,
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
