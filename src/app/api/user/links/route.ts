import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const links = await prisma.link.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        _count: {
          select: { clicks: true },
        },
        clicks: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(links, { status: 200 })
  } catch (error) {
    console.error('Erreur récupération des liens:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
