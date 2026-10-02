# URL Shortener

Raccourcisseur d'URL performant avec gestion d'utilisateurs, analytics détaillés et conformité légale.

## Démo & Stack

- **Stack :** Next.js (App Router), TypeScript, Tailwind CSS, Prisma, PostgreSQL
- **Démo :** *Soon*

## Fonctionnalités

### 🔗 Gestion des Liens
- **Utilisateurs invités :** Création de liens courts sans inscription (expiration automatique sous 7 jours).
- **Utilisateurs inscrits :** Liens permanents, personnalisables et gérables depuis un tableau de bord.
- **Lien temporaire :** Association automatique d'un lien créé en mode invité lors de la création d'un compte.

### 📊 Analytics en Temps Réel
- Suivi du nombre de clics filtrable par période (`1h`, `24h`, `7d`, `30d`, `all`).
- Analyse détaillée des visiteurs : **Sources (Referers)**, **Pays**, **Systèmes d'exploitation (OS)** et **Navigateurs**.
- Graphique d'évolution du trafic et historique des dernières visites.

### 🔒 Sécurité & Compte Utilisateur
- Gestion du profil (modification sécurisée du mot de passe avec validation).
- Suppression définitive du compte et purge associée des données.
- Respect du RGPD (anonymisation des adresses IP / hachage).

### ⚖️ Conformité Légale
- Pages dédiées pour les **CGU**, les **Mentions Légales** et la **Politique de Confidentialité**.

---

## Installation & Configuration

1. **Cloner le projet :**
   ```bash
   git clone https://github.com/valanidev/url-shortener.git
   cd url-shortener
