/**
 * /llms.txt — présentation du site pour les moteurs génératifs (GEO).
 *
 * Convention llms.txt : un document Markdown concis qui aide les assistants
 * IA à comprendre et citer le site. Entièrement généré depuis les
 * dictionnaires i18n (`ui.ts`) et la configuration (`site`, `base`) :
 * si le contenu change, ce fichier suit.
 */
import type { APIRoute } from 'astro';
import { ui, languages, defaultLang } from '../i18n/ui';
import { useTranslations, type Lang } from '../i18n/utils';
import { localizedPathname, absoluteUrl } from '../lib/seo';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL;
  const url = (path: string, lang: Lang) =>
    absoluteUrl(localizedPathname(path, lang, base), site);

  const langs = Object.keys(ui) as Lang[];
  const tDefault = useTranslations(defaultLang);

  const lines: string[] = [
    `# ${tDefault('site.title')} — ${tDefault('site.tagline')}`,
    '',
    `> ${tDefault('site.description')}`,
    '',
    tDefault('home.hero.lede'),
    '',
    `## ${tDefault('home.findings.title')}`,
    '',
    `- ${tDefault('home.findings.one.title')} : ${tDefault('home.findings.one.desc')}`,
    `- ${tDefault('home.findings.two.title')} : ${tDefault('home.findings.two.desc')}`,
    '',
  ];

  for (const lang of langs) {
    const t = useTranslations(lang);
    lines.push(
      `## ${languages[lang]}`,
      '',
      `- [${t('nav.home')}](${url('/', lang)}) : ${t('site.description')}`,
      `- [${t('nav.theory')}](${url('/theorie', lang)}) : ${t('theory.index.lede')}`,
      `- [${t('theory.sub.intro.title')}](${url('/theorie/introduction', lang)}) : ${t('theory.sub.intro.desc')}`,
      `- [${t('nav.literature')}](${url('/litterature', lang)}) : ${t('home.card.literature.desc')}`,
      `- [${t('nav.player')}](${url('/player', lang)}) : ${t('home.card.player.desc')}`,
      `- [${t('nav.bio')}](${url('/biographie', lang)}) : ${t('bio.title')}, ${t('bio.subtitle')}`,
      '',
    );
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
