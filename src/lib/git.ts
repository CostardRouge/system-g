/**
 * Date de dernière modification d'un fichier via l'historique git.
 *
 * Utilisé pour le `<lastmod>` du sitemap : plus fiable qu'une date de build
 * (qui serait identique pour toutes les pages à chaque déploiement) ou
 * qu'un `mtime` disque (perdu au clonage). Nécessite un clone non-superficiel
 * (voir `fetch-depth: 0` dans le workflow de déploiement) ; à défaut, ou si
 * le fichier n'est pas encore commité, on retombe sur la date du build.
 */
import { execSync } from 'node:child_process';

const cache = new Map<string, string>();

export function gitLastModified(relativePath: string): string {
  const cached = cache.get(relativePath);
  if (cached) return cached;

  let iso: string;
  try {
    const output = execSync(`git log -1 --format=%cI -- "${relativePath}"`, {
      cwd: process.cwd(),
      encoding: 'utf-8',
    }).trim();
    iso = output || new Date().toISOString();
  } catch {
    iso = new Date().toISOString();
  }

  cache.set(relativePath, iso);
  return iso;
}
