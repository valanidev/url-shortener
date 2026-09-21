'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'

interface LinkItem {
  id: string
  originalUrl: string
  shortCode: string
  createdAt: string
  isActive?: boolean
  _count?: {
    clicks: number
  }
}

export default function DashboardPage() {
  const router = useRouter()

  const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [originalUrl, setOriginalUrl] = useState('')
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadLinks() {
      try {
        const res = await fetch('/api/user/links')
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('Impossible de charger vos liens.')
        }
        const data = await res.json()
        if (isMounted) {
          setLinks(data)
        }
      } catch (err: unknown) {
        if (isMounted && err instanceof Error) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadLinks()

    return () => {
      isMounted = false
    }
  }, [router])

  const refreshLinks = async () => {
    try {
      const res = await fetch('/api/user/links')
      if (res.ok) {
        const data = await res.json()
        setLinks(data)
      }
    } catch {}
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!originalUrl) return

    setCreating(true)
    setError(null)

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création du lien.')
      }

      setOriginalUrl('')
      await refreshLinks()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce lien ?')) return

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Erreur lors de la suppression.')
      }

      setLinks((prev) => prev.filter((link) => link.id !== id))
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      }
    }
  }

  const togglePause = async (id: string, currentStatus: boolean = true) => {
    if (togglingId) return
    setTogglingId(id)

    const newStatus = !currentStatus

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      })

      if (!res.ok) {
        throw new Error("Erreur lors du changement d'état.")
      }

      setLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, isActive: newStatus } : l))
      )
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      }
    } finally {
      setTogglingId(null)
    }
  }

  const handleCopy = (shortCode: string, id: string) => {
    const fullUrl = `${window.location.origin}/r/${shortCode}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-4 py-10 sm:px-8">
      <div className="flex flex-col justify-between gap-4 border-b border-border-light pb-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Mon Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez vos liens raccourcis et consultez leurs performances.
          </p>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
          Raccourcir un nouveau lien
        </h2>

        <form
          onSubmit={handleCreate}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="url"
            required
            placeholder="https://votre-lien-tres-long.com/vraiment-long"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-card-muted px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground transition focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
          />
          <button
            type="submit"
            disabled={creating}
            className="shrink-0 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:opacity-50"
          >
            {creating ? 'Création...' : 'Raccourcir'}
          </button>
        </form>

        {error && (
          <p className="rounded-xl border border-danger/20 bg-danger-bg p-3 text-xs font-medium text-danger">
            {error}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Vos liens enregistrés
        </h2>

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Chargement de vos liens...
          </div>
        ) : links.length === 0 ? (
          <div className="space-y-2 rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm font-semibold text-foreground">
              Aucun lien pour le moment
            </p>
            <p className="text-xs text-muted-foreground">
              Raccourcissez votre premier lien en utilisant le champ ci-dessus.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => {
              const isActive = link.isActive ?? true
              return (
                <div
                  key={link.id}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-border-light sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="truncate text-sm font-bold text-primary">
                        /r/{link.shortCode}
                      </span>

                      <span className="rounded-full border border-border/40 bg-accent px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-accent-foreground">
                        {link._count?.clicks ?? 0}{' '}
                        {(link._count?.clicks ?? 0) !== 1 ? 'clics' : 'clic'}
                      </span>

                      {/* Badge Actif / En pause */}
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                            : 'border-amber-500/20 bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {isActive ? 'Actif' : 'En pause'}
                      </span>
                    </div>

                    <p className="max-w-md truncate text-xs text-muted-foreground">
                      {link.originalUrl}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {/* Bouton Pause / Réactiver */}
                    <button
                      onClick={() => togglePause(link.id, isActive)}
                      disabled={togglingId === link.id}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        isActive
                          ? 'border-border bg-card-muted text-foreground hover:bg-muted'
                          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isActive ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                      {togglingId === link.id
                        ? '...'
                        : isActive
                          ? 'Mettre en pause'
                          : 'Réactiver'}
                    </button>

                    <button
                      onClick={() => handleCopy(link.shortCode, link.id)}
                      title="Copier le lien"
                      className={`rounded-xl border p-2 transition ${
                        copiedId === link.id
                          ? 'border-success/30 bg-success-bg text-success'
                          : 'border-border bg-card-muted text-foreground hover:bg-muted'
                      }`}
                    >
                      {copiedId === link.id ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>

                    <Link
                      href={`/dashboard/analytics/${link.id}`}
                      className="flex items-center gap-1.5 rounded-xl border border-border bg-card-muted px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
                    >
                      <svg
                        className="h-3.5 w-3.5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Analytics
                    </Link>

                    <button
                      onClick={() => handleDelete(link.id)}
                      className="rounded-xl border border-danger/20 bg-danger-bg px-3 py-2 text-xs font-semibold text-danger transition hover:opacity-80"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
