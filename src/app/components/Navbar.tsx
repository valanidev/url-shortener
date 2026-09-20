import Link from 'next/link'

export default function Navbar() {
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
          <Link
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Mes Liens
          </Link>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border-light bg-accent text-sm font-semibold text-accent-foreground">
            A
          </div>
        </div>
      </div>
    </header>
  )
}
