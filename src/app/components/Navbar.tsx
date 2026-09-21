import { getAuthUser } from '@/lib/auth'
import Link from 'next/link'
import UserMenu from './UserMenu'

export default async function Navbar() {
  const user = await getAuthUser()

  console.log(
    '--- NAVBAR RENDER --- User status:',
    user ? user.email : 'DECONNECTE'
  )

  return (
    <header className="w-full border-b border-border-light bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground shadow-sm">
            U
          </span>
          <span className="text-foreground">
            URL<span className="text-primary">Shortener</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                Mes Liens
              </Link>

              {/* Composant interactif contenant la lettre et le menu */}
              <UserMenu email={user.email} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
