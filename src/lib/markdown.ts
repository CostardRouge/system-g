/**
 * Rendu Markdown brut du contenu des pages — le jumeau texte servi à
 * `{page}.md` (voir `src/pages/[...slug].md.ts`), pour les crawlers GEO qui
 * préfèrent du texte simple au HTML.
 *
 * Réutilise directement les mêmes sources que les composants de rendu HTML
 * (`content/*.ts`, `ui.ts`) : aucun texte n'est recopié ici.
 */
import { useTranslations, type Lang } from '../i18n/utils';
import { localizedPathname } from './seo';
import { bioParagraphs } from '../content/bio';
import { introduction, type IntroBlock } from '../content/introduction';
import { aide, type AideBlock } from '../content/aide';
import { comparaison, type CompareBlock } from '../content/comparaison';

type AnyBlock = IntroBlock | AideBlock | CompareBlock;

function linkTargets(lang: Lang, base: string): Record<string, string> {
  return {
    theory: localizedPathname('/theorie', lang, base),
    theoryIntro: localizedPathname('/theorie/introduction', lang, base),
    intro: localizedPathname('/theorie/introduction', lang, base),
    player: localizedPathname('/player', lang, base),
  };
}

function blockToMarkdown(block: AnyBlock, targets: Record<string, string>): string {
  switch (block.t) {
    case 'h2':
      return `## ${block.text}`;
    case 'p':
      return block.text;
    case 'epigraph':
      return `> *${block.text}*`;
    case 'list':
      return block.items.map((item) => `- ${item}`).join('\n');
    case 'note':
      return block.lines.map((line) => `> ${line}`).join('\n>\n');
    case 'callout': {
      const links = block.links?.map((l) => `[${l.label}](${targets[l.to]})`).join(' · ') ?? '';
      return links ? `${block.text}\n\n${links}` : block.text;
    }
    case 'resources':
      return block.items.map((item) => `- **[${item.label}](${targets[item.to]})** — ${item.desc}`).join('\n');
    case 'sources':
      return [`## ${block.label}`, ...block.items.map((item) => `- [${item.label}](${item.href})`)].join('\n');
    case 'table': {
      const header = `| ${block.headers.join(' | ')} |`;
      const sep = `| ${block.headers.map(() => '---').join(' | ')} |`;
      const rows = block.rows.map((row) => `| ${row.join(' | ')} |`);
      return [`**${block.caption}**`, '', header, sep, ...rows].join('\n');
    }
    case 'steps':
    case 'try':
      return block.items.map((item, i) => `${i + 1}. **${item.title}** — ${item.text}`).join('\n');
    case 'keys': {
      const rows = block.rows.map((row) => `| \`${row.k}\` | ${row.v} |`);
      const caption = block.caption ? `**${block.caption}**\n\n` : '';
      return `${caption}| | |\n| --- | --- |\n${rows.join('\n')}`;
    }
    default:
      return '';
  }
}

function renderBlocks(overline: string, title: string, subtitle: string, blocks: AnyBlock[], lang: Lang, base: string): string {
  const targets = linkTargets(lang, base);
  const body = blocks.map((b) => blockToMarkdown(b, targets)).join('\n\n');
  return `# ${title}\n\n> ${overline} — ${subtitle}\n\n${body}\n`;
}

function renderHome(lang: Lang, base: string): string {
  const t = useTranslations(lang);
  return [
    `# ${t('home.hero.title')}`,
    '',
    `> ${t('home.hero.subtitle')} — ${t('home.hero.author')}`,
    '',
    t('home.hero.lede'),
    '',
    `## ${t('home.explore.title')}`,
    '',
    t('home.explore.lede'),
    '',
    `- **[${t('home.card.literature.title')}](${localizedPathname('/litterature', lang, base)})** — ${t('home.card.literature.desc')}`,
    `- **[${t('home.card.theory.title')}](${localizedPathname('/theorie', lang, base)})** — ${t('home.card.theory.desc')}`,
    `- **[${t('home.card.player.title')}](${localizedPathname('/player', lang, base)})** — ${t('home.card.player.desc')}`,
    '',
    `## ${t('home.findings.title')}`,
    '',
    `- **${t('home.findings.one.title')}** (22/21) — ${t('home.findings.one.desc')}`,
    `- **${t('home.findings.two.title')}** — ${t('home.findings.two.desc')}`,
    '',
    `> ${t('home.quote')}`,
    '',
  ].join('\n');
}

function renderBio(lang: Lang): string {
  const t = useTranslations(lang);
  const paragraphs = bioParagraphs[lang] ?? bioParagraphs.fr;
  return [`# ${t('bio.title')}`, '', `> ${t('bio.subtitle')}`, '', ...paragraphs, ''].join('\n\n');
}

function renderTheoryIndex(lang: Lang, base: string): string {
  const t = useTranslations(lang);
  const items: [string, string, string | null][] = [
    [t('theory.sub.intro.title'), t('theory.sub.intro.desc'), localizedPathname('/theorie/introduction', lang, base)],
    [t('theory.sub.rules.title'), t('theory.sub.rules.desc'), null],
    [t('theory.sub.coding.title'), t('theory.sub.coding.desc'), null],
    [t('theory.sub.marking.title'), t('theory.sub.marking.desc'), null],
    [t('theory.sub.compare.title'), t('theory.sub.compare.desc'), localizedPathname('/theorie/comparaison', lang, base)],
    [t('theory.sub.positions.title'), t('theory.sub.positions.desc'), localizedPathname('/theorie/positions', lang, base)],
  ];
  const lines = items.map(([title, desc, href]) => {
    const label = href ? `[${title}](${href})` : `${title} (${t('badge.soon')})`;
    return `- **${label}** — ${desc}`;
  });
  return [`# ${t('nav.theory')}`, '', `> ${t('theory.index.lede')}`, '', ...lines, ''].join('\n');
}

function renderPositions(lang: Lang): string {
  const t = useTranslations(lang);
  return [
    `# ${t('theory.sub.positions.title')}`,
    '',
    `> ${t('theory.sub.positions.desc')}`,
    '',
    t('positions.lede'),
    '',
    t('positions.note'),
    '',
  ].join('\n');
}

function renderPlayer(lang: Lang, base: string): string {
  const t = useTranslations(lang);
  return [
    `# ${t('nav.player')}`,
    '',
    `> ${t('player.lede')}`,
    '',
    `${t('player.library.hint')}`,
    '',
    `[${t('aide.backToPlayer')}](${localizedPathname('/player/aide', lang, base)})`,
    '',
  ].join('\n');
}

/** Rend le jumeau Markdown d'une route (chemin neutre) pour une langue donnée. */
export function renderRouteMarkdown(path: string, lang: Lang, base: string): string {
  switch (path) {
    case '/':
      return renderHome(lang, base);
    case '/biographie':
      return renderBio(lang);
    case '/theorie':
      return renderTheoryIndex(lang, base);
    case '/theorie/introduction': {
      const doc = introduction[lang] ?? introduction.fr;
      return renderBlocks(doc.overline, doc.title, doc.subtitle, doc.blocks, lang, base);
    }
    case '/theorie/comparaison': {
      const doc = comparaison[lang] ?? comparaison.fr;
      return renderBlocks(doc.overline, doc.title, doc.subtitle, doc.blocks, lang, base);
    }
    case '/theorie/positions':
      return renderPositions(lang);
    case '/player':
      return renderPlayer(lang, base);
    case '/player/aide': {
      const doc = aide[lang] ?? aide.fr;
      return renderBlocks(doc.overline, doc.title, doc.subtitle, doc.blocks, lang, base);
    }
    default:
      throw new Error(`Pas de rendu Markdown pour la route « ${path} ».`);
  }
}
