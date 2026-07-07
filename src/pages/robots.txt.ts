/**
 * robots.txt généré au build.
 *
 * L'URL du sitemap est dérivée de `site` (variable SITE_URL) : rien n'est
 * codé en dur, un changement de domaine est répercuté automatiquement.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = site ? new URL('sitemap-index.xml', site).href : '/sitemap-index.xml';
  const llmsUrl = site ? new URL('llms.txt', site).href : '/llms.txt';

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
    `# Moteurs génératifs (GEO) : voir aussi ${llmsUrl}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
