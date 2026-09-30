import Link from 'next/link'

export default function CGUPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-10 sm:px-8">
      {/* En-tête */}
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Conditions Générales d'Utilisation (CGU)
        </h1>
        <p className="text-xs text-muted-foreground">
          Dernière mise à jour : 29 septembre 2026
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            1. Objet du service
          </h2>
          <p>
            Le présent service a pour objet de fournir un outil de
            raccourcissement d'URL permettant de transformer des liens longs en
            liens courts et faciles à partager. Le service est accessible à tout
            utilisateur, de manière anonyme ou via la création d'un compte
            personnel.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            2. Conditions d'accès et durée des liens
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">
                Utilisateurs invités (sans compte) :
              </strong>{' '}
              Les liens créés sans authentification ont une durée de validité
              limitée à 7 jours. À l'expiration de ce délai, le lien est
              automatiquement désactivé ou supprimé.
            </li>
            <li>
              <strong className="text-foreground">
                Utilisateurs inscrits :
              </strong>{' '}
              Les utilisateurs disposant d'un compte peuvent créer des liens
              sans date d'expiration automatique, gérer leurs URL depuis leur
              tableau de bord et modifier ou supprimer leurs liens à tout
              moment.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            3. Usages interdits et modération
          </h2>
          <p>
            L'utilisateur s'engage à utiliser le service dans le respect des
            lois en vigueur. Sont strictement interdits les liens redirigeant
            vers :
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
            <li>
              Des sites de phishing, d'escroquerie ou de logiciels malveillants
              (malwares, virus).
            </li>
            <li>
              Des contenus incitant à la haine, à la violence, à la
              discrimination ou à caractère diffamatoire.
            </li>
            <li>
              Des contenus contrefaits ou portant atteinte aux droits d'auteur
              de tiers.
            </li>
            <li>Toute activité d'envoi massif de spams.</li>
          </ul>
          <p className="pt-2 text-xs text-muted-foreground">
            L'éditeur se réserve le droit de suspendre ou de supprimer sans
            préavis ni indemnité tout lien ou compte ne respectant pas ces
            règles.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            4. Limite de responsabilité
          </h2>
          <p>
            L'éditeur du service agit uniquement en tant qu'intermédiaire
            technique en fournissant une redirection vers des URL tierces. Par
            conséquent :
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
            <li>
              L'éditeur ne saurait être tenu responsable du contenu hébergé sur
              les sites cibles vers lesquels les liens raccourcis redirigent.
            </li>
            <li>
              L'accès au service est fourni "en l'état" sans garantie de
              disponibilité ininterrompue ou d'absence d'erreurs techniques.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            5. Modification du service et résiliation
          </h2>
          <p>
            L'utilisateur peut à tout moment décider de supprimer son compte
            depuis la page des paramètres. La suppression du compte entraîne la
            suppression définitive de l'ensemble de ses liens et des données
            associées.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            6. Contact & Signalement
          </h2>
          <p>
            Pour signaler un lien malveillant ou non conforme aux présentes CGU,
            veuillez contacter l'administration du site à l'adresse e-mail
            indiquée sur la page des{' '}
            <Link
              href="/mentions-legales"
              className="font-medium text-primary hover:underline"
            >
              Mentions Légales
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
