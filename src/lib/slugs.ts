/**
 * Les adresses traduites.
 *
 * Par convention, chaque page garde son slug français dans toutes les langues
 * (`/en/biographie`, `/it/theorie`) : les utilitaires SEO ne font qu'ajouter
 * ou retirer le préfixe de langue. Les quelques pages dont l'adresse est
 * traduite sont listées ici, et ici seulement : `localizedPathname`,
 * `neutralPath` (src/lib/seo.ts), `localizedPath` (src/i18n/utils.ts), les
 * jumeaux Markdown et le sitemap lisent cette table. Le chemin neutre (la clé)
 * reste le nom de la route dans `src/lib/routes.ts` et celui de l'image de
 * partage ; seul le slug servi change.
 */
import type { ui } from '../i18n/ui';

type Lang = keyof typeof ui;

/** Chemin neutre (français) → slug servi dans les autres langues. */
export const LOCALIZED_SLUGS: Readonly<Record<string, Partial<Record<Lang, string>>>> = {
  '/mentions-legales': { en: '/legal', it: '/note-legali' },
};

const bare = (path: string): string => path.replace(/\/$/, '') || '/';

/** Le slug servi pour un chemin neutre dans une langue (le chemin lui-même sans traduction). */
export function localizedSlug(neutral: string, lang: Lang): string {
  const slug = LOCALIZED_SLUGS[bare(neutral)]?.[lang];
  if (!slug) return neutral;
  return neutral.endsWith('/') && bare(neutral) !== '/' ? `${slug}/` : slug;
}

/** Le chemin neutre d'un slug servi dans une langue (le slug lui-même s'il n'est pas traduit). */
export function neutralSlug(localized: string, lang: Lang): string {
  const target = bare(localized);
  for (const [neutral, slugs] of Object.entries(LOCALIZED_SLUGS)) {
    if (slugs[lang] === target) {
      return localized.endsWith('/') && target !== '/' ? `${neutral}/` : neutral;
    }
  }
  return localized;
}
