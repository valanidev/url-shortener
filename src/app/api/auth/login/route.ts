import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      )
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: "Identifiants invalides" },
        { status: 401 }
      )
    }

    const token = generateToken({ userId: user.id, email: user.email })

    const response = NextResponse.json(
      {
        message: "Connexion réussie",
        user: { id: user.id, email: user.email },
      },
      { status: 200 }
    )

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
