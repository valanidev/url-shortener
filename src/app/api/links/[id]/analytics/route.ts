import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    const now = new Date()
    let startDate: Date | null = new Date()

    if (period === '1h') {
      startDate.setHours(startDate.getHours() - 1)
    } else if (period === '24h') {
      startDate.setHours(startDate.getHours() - 24)
    } else if (period === '7d') {
      startDate.setDate(startDate.getDate() - 7)
    } else if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30)
    } else {
      startDate = null
    }

    const link = await prisma.link.findFirst({
      where: {
        id,
        userId: user.userId,
      },
      include: {
        clicks: {
          where: startDate ? { createdAt: { gte: startDate } } : undefined,
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!link) {
      return NextResponse.json({ error: 'Lien introuvable' }, { status: 404 })
    }

    const totalClicks = link.clicks.length

    const aggregateBy = (key: 'country' | 'browser' | 'os') => {
      const counts: Record<string, number> = {}
      link.clicks.forEach((click) => {
        const val = click[key] || 'Inconnu'
        counts[val] = (counts[val] || 0) + 1
      })
      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    }

    // Génération des créneaux temporels
    const timeSlots: Record<string, number> = {}

    if (period === '1h') {
      for (let i = 59; i >= 0; i--) {
        const d = new Date(now)
        d.setMinutes(d.getMinutes() - i)
        const minStr = d.toISOString().substring(0, 16) // Format YYYY-MM-DDTHH:mm
        timeSlots[minStr] = 0
      }
      link.clicks.forEach((click) => {
        const minStr = new Date(click.createdAt).toISOString().substring(0, 16)
        if (timeSlots[minStr] !== undefined) timeSlots[minStr]++
      })
    } else if (period === '24h') {
      for (let i = 23; i >= 0; i--) {
        const d = new Date(now)
        d.setHours(d.getHours() - i)
        const hourStr = d.toISOString().substring(0, 13) + ':00'
        timeSlots[hourStr] = 0
      }
      link.clicks.forEach((click) => {
        const hourStr =
          new Date(click.createdAt).toISOString().substring(0, 13) + ':00'
        if (timeSlots[hourStr] !== undefined) timeSlots[hourStr]++
      })
    } else if (period === '7d' || period === '30d') {
      const daysCount = period === '7d' ? 7 : 30
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        timeSlots[dateStr] = 0
      }
      link.clicks.forEach((click) => {
        const dateStr = new Date(click.createdAt).toISOString().split('T')[0]
        if (timeSlots[dateStr] !== undefined) timeSlots[dateStr]++
      })
    } else {
      // Pour 'all', agréger par jour à partir de la date du premier clic / création
      link.clicks.forEach((click) => {
        const dateStr = new Date(click.createdAt).toISOString().split('T')[0]
        timeSlots[dateStr] = (timeSlots[dateStr] || 0) + 1
      })
    }

    const clicksOverTime = Object.entries(timeSlots).map(([time, count]) => ({
      time,
      count,
    }))

    return NextResponse.json({
      link: {
        id: link.id,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        createdAt: link.createdAt,
      },
      totalClicks,
      topCountries: aggregateBy('country'),
      topBrowsers: aggregateBy('browser'),
      topOs: aggregateBy('os'),
      recentClicks: [...link.clicks].reverse().slice(0, 10),
      clicksOverTime,
      period,
    })
  } catch (error) {
    console.error('Erreur API Analytics:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
