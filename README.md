# Le Système G <span aria-hidden="true">♮</span>

> **L'intonation juste enfin trouvée : positions et expressivité**
> Site autour de la théorie des intervalles musicaux de **Nabih Gédéon**.

Site statique construit avec [Astro](https://astro.build). Pensé pour durer :
pas de CMS propriétaire, pas de vendor lock — juste des fichiers, du HTML/CSS
et un déploiement reproductible.

## Structure du projet

```
.
├── .github/workflows/deploy.yml   Déploiement automatique GitHub Pages
├── Dockerfile                     Images dev / build / prod (multi-étapes)
├── docker-compose.yml             Profils dev & prod
├── nginx.conf                     Service statique en production
├── astro.config.mjs               Config Astro + i18n (fr par défaut, en)
├── public/                        Fichiers servis tels quels (favicon…)
└── src/
    ├── i18n/                      Dictionnaires (ui.ts) + utilitaires
    ├── content/                   Textes longs (biographie…)
    ├── styles/global.css          Thème « papier / sérif / musicologie »
    ├── layouts/BaseLayout.astro   Squelette HTML commun
    ├── components/                Header, Footer, contenus de page…
    └── pages/                     Routes
        ├── index.astro            Accueil (fr)
        ├── biographie.astro       L'auteur (fr)
        ├── litterature.astro      Rubrique Littérature (en préparation)
        ├── theorie.astro          Rubrique Théorie (en préparation)
        ├── player.astro           Player interactif (en préparation)
        └── en/                    Mêmes pages en anglais (/en/…)
```

## Deux rubriques + un player

Le site s'organise autour de trois entrées, telles que prévues :

1. **Littérature** — œuvres, résumés et traductions nés autour de la théorie.
2. **Théorie** — le demi-ton naturel (22/21), les positions et l'expressivité.
3. **Player interactif** — écoute audiovisuelle pour *ressentir* la théorie.

Pour l'instant, seules l'**Accueil** et la **Biographie** sont remplies ; les
trois rubriques existent comme pages « en préparation », prêtes à recevoir les
« pièces du puzzle ».

## Développement

Prérequis : Node 20+.

```bash
npm install      # installer les dépendances
npm run dev      # http://localhost:4321 (rechargement à chaud)
npm run build    # génère le site statique dans ./dist
npm run preview  # sert le build localement
npm run check    # vérification TypeScript / Astro
```

### Avec Docker

```bash
# Développement (hot reload)
docker compose up dev          # → http://localhost:4321

# Production (build + Nginx)
docker compose up prod --build # → http://localhost:8080
```

## Internationalisation

- Langue de référence : **français** (servi à la racine `/`).
- **Anglais** préfixé : `/en/` — **Italien** préfixé : `/it/`.
- Toutes les chaînes d'interface vivent dans `src/i18n/ui.ts`. Une clé absente
  dans une langue retombe automatiquement sur le français.
- Les textes longs (bio, introduction) sont dans `src/content/*.ts`, avec une
  entrée par langue (`fr`, `en`, `it`).
- Pour ajouter une langue : ajouter le code dans `astro.config.mjs`
  (`i18n.locales`), dans `src/i18n/ui.ts`, dans les modules `src/content/*.ts`,
  puis dupliquer les pages sous `src/pages/<code>/`.

## Déploiement (GitHub Pages)

Le workflow `.github/workflows/deploy.yml` construit et publie le site à chaque
push sur `main`. Dans les réglages du dépôt : **Settings → Pages → Build and
deployment → Source : GitHub Actions**.

- **Domaine personnalisé** (ex. `intervalles-systeme-g.com`) : ajouter un
  fichier `public/CNAME` contenant le domaine, et configurer le DNS.
- **Dépôt projet** (`user.github.io/systeme-g`) : le workflow détecte
  automatiquement le bon `base_path`. Rien à changer.

En local, l'URL et le sous-chemin sont pilotés par variables d'environnement :

```bash
SITE_URL="https://intervalles-systeme-g.com" BASE_PATH="/" npm run build
```

## Licence

Code sous licence MIT. Les textes, la théorie du Système G et la biographie
sont la propriété de **Nabih Gédéon**.
