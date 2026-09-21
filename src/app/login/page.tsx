'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { login } from '../actions/auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const showSuccessMessage = searchParams.get('registered') === 'true'

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await login(email, password)

      if (!res.success) {
        setError(res.error)
        return
      }

      router.push('/dashboard')
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Une erreur inconnue est survenue.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Connexion
        </h1>
        <p className="text-sm text-muted-foreground">
          Accédez à votre espace pour gérer tous vos liens raccourcis.
        </p>
      </div>

      {showSuccessMessage && (
        <p className="rounded-xl border border-success/20 bg-success-bg p-3 text-xs font-medium text-success">
          Compte créé avec succès ! Vous pouvez maintenant vous connecter.
        </p>
      )}

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
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>

      <p className="border-t border-border-light pt-2 text-center text-xs text-muted-foreground">
        Vous n’avez pas encore de compte ?{' '}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          S’inscrire
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
      <Suspense
        fallback={
          <div className="text-sm text-muted-foreground">Chargement...</div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  )
}
