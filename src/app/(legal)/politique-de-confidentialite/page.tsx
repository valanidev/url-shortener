import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-10 sm:px-8">
      <div className="space-y-2 border-b border-border pb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Politique de Confidentialité
        </h1>
        <p className="text-xs text-muted-foreground">
          Dernière mise à jour : 29 septembre 2026
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-foreground/90">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            1. Responsable du traitement
          </h2>
          <p>
            Les données personnelles collectées sur ce site sont traitées par
            l'éditeur du site (voir les{' '}
            <Link
              href="/mentions-legales"
              className="font-medium text-primary hover:underline"
            >
              Mentions Légales
            </Link>
            ).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            2. Données collectées et finalités
          </h2>
          <p>
            Nous collectons uniquement les données strictement nécessaires au
            bon fonctionnement du service :
          </p>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Adresse e-mail :</strong>{' '}
              Nécessaire à la création de votre compte, à votre authentification
              et à la gestion de vos liens.
            </li>
            <li>
              <strong className="text-foreground">Mot de passe :</strong> Stocké
              sous forme hachée (sécurisée) pour valider vos accès.
            </li>
            <li>
              <strong className="text-foreground">
                Identifiant temporaire (cookie `pending_link_id`) :
              </strong>{' '}
              Permet d'attribuer automatiquement à votre compte les liens créés
              en mode invité (expire au bout de 24 heures).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            3. Durée de conservation
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">
                Liens d'utilisateurs invités :
              </strong>{' '}
              Supprimés automatiquement au bout de 7 jours.
            </li>
            <li>
              <strong className="text-foreground">
                Compte utilisateur et liens associés :
              </strong>{' '}
              Conservés jusqu'à ce que vous décidiez de supprimer votre compte
              depuis l'espace Paramètres.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            4. Partage et transfert des données
          </h2>
          <p>
            Aucune donnée personnelle n'est vendue, louée ou cédée à des tiers à
            des fins commerciales ou publicitaires.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">
            5. Vos droits (RGPD)
          </h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données
            (RGPD), vous disposez d'un droit d'accès, de rectification et de
            suppression de vos données.
          </p>
          <p className="text-xs text-muted-foreground">
            Vous pouvez directement exercer votre droit à l'oubli en supprimant
            votre compte dans vos paramètres, ou nous contacter par e-mail via
            l'adresse indiquée dans les mentions légales.
          </p>
        </section>
      </div>
    </main>
  )
}
