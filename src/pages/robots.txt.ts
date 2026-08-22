/**
 * robots.txt généré au build.
 *
 * L'URL du sitemap est dérivée de `site` (variable SITE_URL) : rien n'est
 * codé en dur, un changement de domaine est répercuté automatiquement.
 *
 * Le choix des robots IA est délibéré, pas un bloc générique copié-collé :
 * l'objectif du site est la visibilité, donc tout est autorisé — aussi bien
 * les robots d'entraînement (le contenu nourrit de futurs modèles, ce qui
 * sert la diffusion de la théorie) que les robots de citation/réponse
 * (le canal GEO recherché : être cité par un assistant IA). Rien n'est
 * bloqué ici ; les entrées ci-dessous documentent ce choix bot par bot
 * plutôt que de s'en remettre implicitement au `User-agent: *`.
 */
import type { APIRoute } from 'astro';

// Entraînement de modèles (le site devient une source d'apprentissage).
const trainingBots = [
  'GPTBot', // OpenAI
  'CCBot', // Common Crawl (jeu de données utilisé par de nombreux modèles)
  'Google-Extended', // Gemini / modèles Google (distinct de Googlebot)
  'Bytespider', // ByteDance
  'Meta-ExternalAgent', // Meta
  'Applebot-Extended', // Apple Intelligence
];

// Citation / réponse (le site devient une source citée par l'assistant).
const answerBots = [
  'OAI-SearchBot', // Recherche ChatGPT
  'ChatGPT-User', // Navigation ChatGPT pour le compte d'un utilisateur
  'PerplexityBot',
  'ClaudeBot', // Anthropic
];

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = site ? new URL('sitemap.xml', site).href : '/sitemap.xml';
  const llmsUrl = site ? new URL('llms.txt', site).href : '/llms.txt';

  const botBlock = (name: string) => [`User-agent: ${name}`, 'Allow: /', ''];

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Robots d\'entraînement IA — autorisés : la présence du Système G dans',
    '# de futurs modèles de langage sert la diffusion de la théorie.',
    ...trainingBots.flatMap(botBlock),
    '# Robots de citation / réponse IA — autorisés : c\'est le canal de',
    '# visibilité recherché (être cité par un assistant IA, GEO).',
    ...answerBots.flatMap(botBlock),
    `Sitemap: ${sitemapUrl}`,
    '',
    `# Moteurs génératifs (GEO) : voir aussi ${llmsUrl}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
