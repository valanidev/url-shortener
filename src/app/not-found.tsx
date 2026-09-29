import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-8">
      <div className="max-w-md space-y-6">
        <div className="inline-flex items-center justify-center rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase shadow-sm">
          404 - Page introuvable
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Oups ! Page inconnue...
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            La page que vous recherchez n'existe pas, a été supprimée ou le lien
            raccourci a expiré.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
          >
            Retourner à l'accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
