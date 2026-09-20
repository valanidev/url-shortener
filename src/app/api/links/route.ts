import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { nanoid } from "nanoid"
import { getAuthUser } from "@/lib/auth"
import { Prisma } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const { originalUrl } = await request.json()

    if (!originalUrl) {
      return NextResponse.json({ error: "URL manquante" }, { status: 400 })
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
          error.code === "P2002" // Contrainte d'unicité violée (duplicate key)
        ) {
          attempts++
          continue
        }
        throw error
      }
    }

    if (!newLink) {
      return NextResponse.json(
        { error: "Impossible de générer un code unique, veuillez réessayer" },
        { status: 500 }
      )
    }

    return NextResponse.json(newLink, { status: 201 })
  } catch (error) {
    console.error("Détail de l'erreur API links:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
