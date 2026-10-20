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
├── scripts/build-og-images.mjs    Génère les images OG (satori + resvg), avant chaque build
├── scripts/build-icons.mjs        Dessine le jeu d'icônes dans public/ (npm run icons, à la main, commité)
├── public/                        Fichiers servis tels quels (icônes, manifeste…)
└── src/
    ├── i18n/                      Dictionnaires (ui.ts) + utilitaires
    ├── content/                   Textes longs (biographie…)
    ├── styles/global.css          Thème « papier / sérif / musicologie »
    ├── lib/
    │   ├── seo.ts                 Utilitaires SEO (canonical, hreflang, robots, images OG…)
    │   ├── routes.ts               Manifeste des pages réelles (source unique : sitemap, OG, jumeaux .md)
    │   ├── markdown.ts             Rendu Markdown du contenu (jumeaux .md)
    │   └── git.ts                  Date de dernier commit d'un fichier (lastmod du sitemap)
    ├── layouts/BaseLayout.astro   Squelette HTML commun
    ├── components/                Header, Footer, Seo, SchemaOrg, contenus de page…
    └── pages/                     Routes
        ├── index.astro            Accueil (fr)
        ├── biographie.astro       L'auteur (fr)
        ├── litterature.astro      Rubrique Littérature (en préparation, noindex)
        ├── theorie.astro          Rubrique Théorie (en préparation)
        ├── player.astro           Player interactif (en préparation)
        ├── mentions-legales.astro Mentions légales et confidentialité (textes : src/content/legal.ts)
        ├── en/, it/               Mêmes pages en anglais (/en/…) et en italien (/it/…)
        ├── [...slug].md.ts        Jumeau Markdown de chaque page (/theorie/introduction.md…)
        ├── sitemap.xml.ts         Sitemap généré à la main (lastmod git, images)
        ├── robots.txt.ts          robots.txt (règles explicites par robot IA)
        └── llms.txt.ts            Index du site pour les moteurs génératifs (GEO)
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

Prérequis : Node 22 ou plus (`.nvmrc` dit la majeure utilisée en CI et dans
l'image Docker, 24).

```bash
npm install      # installer les dépendances
npm run dev      # http://localhost:4321 (rechargement à chaud)
npm run build    # génère le site statique dans ./dist
npm run preview  # sert le build localement
npm run lint     # Biome (biome.json : lint seul, pas de formatage)
npm run check    # vérification TypeScript / Astro
npm test         # tests unitaires (Vitest)
npm run icons    # redessine le jeu d'icônes dans public/ (sources SVG, PNG, favicon.ico) ; commiter le résultat
```

Le jeu d'icônes (`public/icon*.svg`, les PNG, `favicon.ico`,
`site.webmanifest`) est dessiné par `scripts/build-icons.mjs` : le « G » est
le contour du glyphe d'EB Garamond, la police des images de partage, le
bécarre est tracé à la main, et resvg rasterise le tout — aucune police
installée n'entre en jeu, le rendu est le même partout. Un test
(`src/lib/__tests__/icons.test.ts`) tient les fichiers à leurs tailles et le
`<head>` et le manifeste au jeu complet.

`.github/workflows/ci.yml` enchaîne `npm run lint`, `npm run check`,
`npm test` et `npm run build` sur chaque pull request et sur `main`, et
construit l'image Docker ; Dependabot (`.github/dependabot.yml`) propose les
mises à jour des dépendances, des actions et des images de base.

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
  dans une langue retombe automatiquement sur le français ; un test
  (`src/i18n/__tests__/ui.test.ts`) vérifie que les trois dictionnaires ont les
  mêmes clés.
- Chaque page garde son adresse française dans toutes les langues
  (`/en/biographie`). Les rares adresses traduites sont listées dans
  `src/lib/slugs.ts` et nulle part ailleurs : les mentions légales,
  `/mentions-legales`, `/en/legal`, `/it/note-legali`.
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

## Mesure d'audience

Les visites sont comptées avec [Umami](https://umami.is), auto-hébergé par
l'éditeur du site (`insight.steevepommier.com`, la même instance que ses
autres sites) : pas de cookie, pas d'identifiant inter-sites, donc pas de
bandeau de consentement. Le build n'écrit que des réglages dans le `<head>`
(`src/components/Audience.astro`, `src/lib/audience.ts`) ; le script de la
page (`src/lib/audience-client.ts`) charge le traceur, sauf si le navigateur
dit non (Do Not Track, Global Privacy Control, ou la clé `umami.disabled`
dans `localStorage`). Le pied de page le dit quand le build mesure.

Les **mentions légales** (`/mentions-legales`, `/en/legal`, `/it/note-legali`,
liées depuis le pied de page) disent qui édite et héberge le site, ce qu'il
garde sur l'appareil du visiteur (les réglages du player, le refus de la
mesure), ce qui est compté et ce qui ne l'est jamais, et la licence. Leurs
textes (`src/content/legal.ts`) citent les faits du code par des marqueurs
que `src/lib/legal.ts` remplit (l'hôte du traceur, les clés `localStorage`,
le dépôt), et un test (`src/lib/__tests__/legal.test.ts`) tient les deux
ensemble. La page porte un interrupteur qui pose ou retire la clé
`umami.disabled` dans ce navigateur.

- L'identifiant du site dans le tableau de bord Umami est dans
  `src/lib/audience.ts` (`AUDIENCE_DEFAULTS.websiteId`). `UMAMI_WEBSITE_ID`
  le remplace ; **vide, rien n'est mesuré** et rien n'est écrit dans les
  pages (`UMAMI_WEBSITE_ID= npm run build`).
- `UMAMI_SRC` (adresse du traceur) et `UMAMI_DOMAINS` (hôtes autorisés,
  séparés par des virgules) remplacent les autres valeurs par défaut ; un
  hôte qui n'y est pas (localhost, un fork) charge le traceur mais ne compte
  jamais. `UMAMI_DEV=true` mesure aussi hors production.

## Licence

Le code du site est sous [licence MIT](LICENSE). La théorie du Système G, ses
textes (biographie, introduction, articles, aide du player, fichiers de gammes
et partitions) et le « G System Player » d'origine conservé dans
`system-g-player/` (ses sources, qui portent leur propre mention
« Copyright © 2009 Faraj Elias », ses échantillons d'instruments et ses
données) sont © **Nabih Gédéon** et ne sont pas couverts par cette licence :
tous droits réservés, aucune réutilisation sans son accord.
