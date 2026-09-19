import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const { id: linkId } = await params

    const existingLink = await prisma.link.findUnique({
      where: { id: linkId },
    })

    if (!existingLink) {
      return NextResponse.json({ error: "Lien introuvable" }, { status: 404 })
    }

    if (existingLink.userId !== user.userId) {
      return NextResponse.json(
        { error: "Vous n’avez pas l’autorisation de supprimer ce lien" },
        { status: 403 }
      )
    }

    await prisma.link.delete({
      where: { id: linkId },
    })

    return NextResponse.json(
      { message: "Lien supprimé avec succès" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur suppression du lien:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
