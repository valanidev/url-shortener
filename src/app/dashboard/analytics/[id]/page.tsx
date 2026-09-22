'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface AnalyticsData {
  link: {
    id: string
    shortCode: string
    originalUrl: string
    createdAt: string
  }
  totalClicks: number
  topCountries: { name: string; count: number }[]
  topBrowsers: { name: string; count: number }[]
  topOs: { name: string; count: number }[]
  recentClicks: {
    id: string
    createdAt: string
    country?: string
    browser?: string
    os?: string
  }[]
  clicksOverTime: { time: string; count: number }[]
  period: string
}

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()

  const [period, setPeriod] = useState<'1h' | '24h' | '7d' | '30d' | 'all'>(
    '30d'
  )
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/links/${resolvedParams.id}/analytics?period=${period}`
        )
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('Impossible de charger les statistiques.')
        }
        const json = await res.json()
        setData(json)
      } catch (err) {
        if (err instanceof Error) setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [resolvedParams.id, period, router])

  // Formater les étiquettes de l'axe X du graphique
  const formatTimeLabel = (timeStr: string) => {
    const date = new Date(timeStr)
    if (period === '1h') {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    if (period === '24h') {
      return `${date.getHours()}h`
    }
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const chartData = data
    ? {
        labels: data.clicksOverTime.map((item) => formatTimeLabel(item.time)),
        datasets: [
          {
            label: 'Clics',
            data: data.clicksOverTime.map((item) => item.count),
            fill: true,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            tension: 0.35,
            pointRadius: period === '1h' || period === '24h' ? 2 : 3,
            pointHoverRadius: 6,
          },
        ],
      }
    : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, font: { size: 10 } },
      },
    },
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-10 sm:px-8">
      {/* En-tête */}
      <div className="space-y-3 border-b border-border-light pb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          ← Retour aux liens
        </Link>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Statistiques : /r/{data?.link.shortCode || '...'}
            </h1>
            <p className="mt-1 max-w-xl truncate text-xs text-muted-foreground">
              {data?.link.originalUrl}
            </p>
          </div>

          {/* Sélecteur de période */}
          <div className="flex shrink-0 gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1">
            {(
              [
                { id: '1h', label: '1 heure' },
                { id: '24h', label: '24 heures' },
                { id: '7d', label: '7 jours' },
                { id: '30d', label: '30 jours' },
                { id: 'all', label: 'Depuis le début' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  period === p.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-card-muted hover:text-foreground'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && !data ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
          Chargement des données...
        </div>
      ) : error || !data ? (
        <div className="rounded-2xl border border-danger/20 bg-danger-bg p-8 text-center text-sm text-danger">
          {error || 'Données introuvables.'}
        </div>
      ) : (
        <>
          {/* Métrique Clics Totaux sur la période */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div>
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Clics (
                {period === '1h'
                  ? 'dernière heure'
                  : period === '24h'
                    ? 'dernières 24h'
                    : period === '7d'
                      ? '7 derniers jours'
                      : period === '30d'
                        ? '30 derniers jours'
                        : 'depuis la création'}
                )
              </p>
              <p className="mt-1 text-4xl font-black text-primary">
                {data.totalClicks}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>

          {/* Graphique temporel */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
              Évolution du trafic
            </h2>
            <div className="h-64 w-full">
              {chartData && <Line data={chartData} options={chartOptions} />}
            </div>
          </div>

          {/* Grille des répartitions */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Top Pays */}
            <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Pays
              </h2>
              {data.topCountries.length === 0 ? (
                <p className="py-2 text-xs text-muted-foreground">
                  Aucune donnée
                </p>
              ) : (
                <div className="space-y-2">
                  {data.topCountries.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="truncate font-semibold text-foreground">
                        {item.name}
                      </span>
                      <span className="rounded-lg border border-border bg-card-muted px-2 py-0.5 font-bold text-primary">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Navigateurs */}
            <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Navigateurs
              </h2>
              {data.topBrowsers.length === 0 ? (
                <p className="py-2 text-xs text-muted-foreground">
                  Aucune donnée
                </p>
              ) : (
                <div className="space-y-2">
                  {data.topBrowsers.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="truncate font-semibold text-foreground">
                        {item.name}
                      </span>
                      <span className="rounded-lg border border-border bg-card-muted px-2 py-0.5 font-bold text-primary">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top OS */}
            <div className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Systèmes d'exploitation
              </h2>
              {data.topOs.length === 0 ? (
                <p className="py-2 text-xs text-muted-foreground">
                  Aucune donnée
                </p>
              ) : (
                <div className="space-y-2">
                  {data.topOs.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="truncate font-semibold text-foreground">
                        {item.name}
                      </span>
                      <span className="rounded-lg border border-border bg-card-muted px-2 py-0.5 font-bold text-primary">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Historique des derniers clics */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
              Dernières visites sur la période
            </h2>

            {data.recentClicks.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Aucun clic sur cette période.
              </p>
            ) : (
              <div className="divide-y divide-border-light">
                {data.recentClicks.map((click) => (
                  <div
                    key={click.id}
                    className="flex items-center justify-between py-2.5 text-xs"
                  >
                    <div className="space-x-2">
                      <span className="font-semibold text-foreground">
                        {click.country || 'Inconnu'}
                      </span>
                      <span className="text-muted-foreground">
                        • {click.browser || 'N/A'} / {click.os || 'N/A'}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(click.createdAt).toLocaleString('fr-FR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </main>
  )
}
