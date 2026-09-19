import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { nanoid } from "nanoid"

export async function POST(request: NextRequest) {
  try {
    const { originalUrl } = await request.json()

    if (!originalUrl) {
      return NextResponse.json({ error: "URL manquante" }, { status: 400 })
    }

    const shortCode = nanoid(6)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const newLink = await prisma.link.create({
      data: {
        originalUrl,
        shortCode,
        expiresAt,
      },
    })

    return NextResponse.json(newLink, { status: 201 })
  } catch (error) {
    console.error("Détail de l'erreur API links:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
