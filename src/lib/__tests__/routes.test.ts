import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ui } from '../../i18n/ui';
import type { Lang } from '../../i18n/utils';
import { routeSlug, routes, sourceFileForRoute } from '../routes';

const langs = Object.keys(ui) as Lang[];
const root = new URL('../../../', import.meta.url);

describe('routes', () => {
  it('ont chacune leur page dans chaque langue', () => {
    for (const route of routes) {
      for (const lang of langs) {
        const file = sourceFileForRoute(route.path, lang);
        expect(existsSync(new URL(file, root)), `${route.path} (${lang}) → ${file}`).toBe(true);
      }
    }
  });

  it("ont un slug d'image de partage sans tiret final, avec ou sans slash final", () => {
    expect(routeSlug('/')).toBe('index');
    expect(routeSlug('/biographie')).toBe('biographie');
    expect(routeSlug('/biographie/')).toBe('biographie');
    expect(routeSlug('/theorie/introduction/')).toBe('theorie-introduction');
    // Le pathname d'une page au build (Seo.astro) porte le slash final.
    expect(routeSlug('/mentions-legales/')).toBe(routeSlug('/mentions-legales'));
  });

  it('ont un titre et une description dans chaque langue', () => {
    for (const route of routes) {
      for (const lang of langs) {
        const meta = route.meta(lang);
        expect(meta.title, `${route.path} (${lang})`).not.toBe('');
        expect(meta.description, `${route.path} (${lang})`).not.toBe('');
      }
    }
  });
});
