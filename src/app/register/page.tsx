'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function RegisterPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    const minPasswordLength =
      Number(process.env.NEXT_PUBLIC_MIN_PASSWORD_LENGTH) || 8
    if (password.length < minPasswordLength) {
      setError(
        `Le mot de passe doit contenir au moins ${minPasswordLength} caractères.`
      )
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.error || 'Une erreur est survenue lors de l’inscription.'
        )
      }

      router.push('/login?registered=true')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Une erreur inconnue est survenue.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Créer un compte
            </h1>
            <p className="text-sm text-muted-foreground">
              Rejoignez-nous pour gérer vos liens sans limite d'expiration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Adresse email
              </label>
              <input
                type="email"
                required
                placeholder="nom@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-card-muted px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground transition focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Mot de passe
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-card-muted px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground transition focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-card-muted px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground transition focus:border-primary focus:ring-2 focus:ring-primary-light focus:outline-none"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-danger/20 bg-danger-bg p-3 text-xs font-medium text-danger">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? 'Création du compte...' : 'S’inscrire'}
            </button>
          </form>

          <p className="border-t border-border-light pt-2 text-center text-xs text-muted-foreground">
            Vous avez déjà un compte ?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
