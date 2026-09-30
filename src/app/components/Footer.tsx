import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border/40 px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Copyright ou nom du projet à gauche */}
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} URLShortener. Tous droits réservés.
        </p>

        {/* Liens légaux en bas à droite */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <Link
            href="/cgu"
            className="transition hover:text-foreground hover:underline"
          >
            CGU
          </Link>
          <Link
            href="/politique-de-confidentialite"
            className="transition hover:text-foreground hover:underline"
          >
            Confidentialité
          </Link>
          <Link
            href="/mentions-legales"
            className="transition hover:text-foreground hover:underline"
          >
            Mentions Légales
          </Link>
        </div>
      </div>
    </footer>
  )
}
