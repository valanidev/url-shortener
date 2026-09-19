import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, confirmPassword } = await request.json()

    if (!email || !password || !confirmPassword) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Les mots de passe ne correspondent pas" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { message: "Compte créé avec succès", user },
      { status: 201 }
    )
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
