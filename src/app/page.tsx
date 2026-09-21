'use client'

import { FormEvent, useState } from 'react'
import LinkResultCard from './components/LinkResultCard'

export default function HomePage() {
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setShortUrl(null)

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      const generatedUrl = `${window.location.origin}/r/${data.shortCode}`
      setShortUrl(generatedUrl)
      setOriginalUrl('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Une erreur inconnue est survenue')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
      <div className="w-full max-w-3xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            Raccourcissez. <span className="text-primary">Trackez.</span>{' '}
            Optimisez.
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Créez des liens courts, mémorisables et suivez leurs performances en
            temps réel avec des analytics détaillés.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-center rounded-full border border-border bg-card-muted p-2 pl-6 shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary-light"
        >
          <svg
            className="text-subtle mr-3 h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>

          <input
            type="url"
            required
            placeholder="Collez votre longue URL ici..."
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="placeholder-subtle flex-1 bg-transparent text-sm text-foreground focus:outline-none sm:text-base"
          />

          <button
            type="submit"
            disabled={loading}
            className="ml-2 shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition duration-150 hover:bg-primary-hover disabled:opacity-50"
          >
            {loading ? 'Raccourcissement...' : 'Raccourcir'}
          </button>
        </form>

        {error && (
          <p className="rounded-xl border border-danger/20 bg-danger-bg p-3 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        {shortUrl && <LinkResultCard shortUrl={shortUrl} />}
      </div>
    </main>
  )
}
