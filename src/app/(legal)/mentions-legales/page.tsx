import Link from 'next/link'

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-10 sm:px-8">
      {/* En-tête */}
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Mentions Légales
        </h1>
        <p className="text-xs text-muted-foreground">
          Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004
          pour la confiance en l'économie numérique (LCEN).
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
        {/* Éditeur */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            1. Éditeur du site
          </h2>
          <p>
            Ce site est édité à titre non professionnel dans le cadre d'un
            projet personnel.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Éditeur :</strong> Développeur
              indépendant (identité préservée conformément à l'article 6, III,
              2° de la loi n° 2004-575 du 21 juin 2004). Les coordonnées
              personnelles de l'auteur ont été transmises à l'hébergeur.
            </li>
            <li>
              <strong className="text-foreground">E-mail de contact :</strong>{' '}
              contact@urlshortener.com
            </li>
          </ul>
        </section>

        {/* Hébergeur */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">2. Hébergement</h2>
          <p>
            Le site est hébergé sur un serveur privé virtuel (VPS) fourni par:
          </p>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Hébergeur :</strong> OVH SAS
            </li>
            <li>
              <strong className="text-foreground">Adresse :</strong> 2 rue
              Kellermann, 59100 Roubaix, France
            </li>
            <li>
              <strong className="text-foreground">Téléphone :</strong> 1007 (ou
              +33 9 72 10 10 07 depuis l'étranger)
            </li>
            <li>
              <strong className="text-foreground">Site web :</strong>{' '}
              https://www.ovhcloud.com
            </li>
          </ul>
        </section>

        {/* Propriété intellectuelle */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            3. Propriété intellectuelle
          </h2>
          <p>
            L'ensemble des éléments constituant ce site (textes, graphismes,
            logiciels, logos, icônes) est la propriété exclusive de l'éditeur,
            sauf mention contraire. Toute reproduction, distribution ou
            modification sans autorisation préalable est strictement interdite.
          </p>
        </section>

        {/* Données personnelles */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            4. Protection des données (RGPD)
          </h2>
          <p>
            Les données personnelles collectées (adresse email) servent
            exclusivement au fonctionnement du compte utilisateur et à la
            gestion des liens. Aucune donnée n'est cédée ou vendue à des tiers.
            Pour en savoir plus sur la gestion de vos données et exercer vos
            droits, consultez nos{' '}
            <Link
              href="/cgu"
              className="font-medium text-primary hover:underline"
            >
              Conditions Générales d'Utilisation
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
