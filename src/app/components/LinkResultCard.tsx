'use client'

import { useState } from 'react'
import Link from 'next/link'

interface LinkResultCardProps {
  shortUrl: string
}

export default function LinkResultCard({ shortUrl }: LinkResultCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 mx-auto max-w-xl space-y-5 rounded-2xl border border-border bg-card p-6 text-left shadow-sm duration-200">
      <div>
        <span className="mb-2 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Votre lien raccourci
        </span>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border-light bg-card-muted p-3">
          <span className="truncate text-sm font-bold text-primary">
            {shortUrl}
          </span>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background transition hover:opacity-90"
          >
            {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>
      </div>

      {/* Bloc CTA Inscription */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-t border-accent bg-primary-light/60 p-4 pt-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground">
            Ce lien expirera dans 7 jours ⏳
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Créez un compte gratuit pour garder vos liens à vie et suivre leurs
            clics en temps réel.
          </p>
        </div>
        <Link
          href="/register"
          className="self-stretch rounded-xl bg-primary px-4 py-2.5 text-center text-xs font-semibold whitespace-nowrap text-primary-foreground shadow-sm transition hover:bg-primary-hover sm:self-auto"
        >
          Créer un compte
        </Link>
      </div>
    </div>
  )
}
