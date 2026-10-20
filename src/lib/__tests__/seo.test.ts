import { describe, expect, it } from 'vitest';
import { languageAlternates, localizedPathname, markdownTwinPathname, neutralPath } from '../seo';
import { LOCALIZED_SLUGS, localizedSlug, neutralSlug } from '../slugs';

const site = new URL('https://example.org');

describe('neutralPath', () => {
  it('retire le base et le préfixe de langue', () => {
    expect(neutralPath('/biographie', '/')).toBe('/biographie');
    expect(neutralPath('/en/biographie', '/')).toBe('/biographie');
    expect(neutralPath('/system-g/it/theorie/introduction', '/system-g')).toBe('/theorie/introduction');
    expect(neutralPath('/en', '/')).toBe('/');
    expect(neutralPath('/system-g/en/', '/system-g/')).toBe('/');
  });

  it("ramène une adresse traduite à son chemin neutre", () => {
    expect(neutralPath('/en/legal', '/')).toBe('/mentions-legales');
    expect(neutralPath('/system-g/it/note-legali', '/system-g')).toBe('/mentions-legales');
    expect(neutralPath('/mentions-legales', '/')).toBe('/mentions-legales');
    expect(neutralPath('/it/note-legali/', '/')).toBe('/mentions-legales/');
  });
});

describe('localizedPathname', () => {
  it('préfixe les autres langues et garde le slug français', () => {
    expect(localizedPathname('/biographie', 'fr', '/')).toBe('/biographie');
    expect(localizedPathname('/biographie', 'en', '/')).toBe('/en/biographie');
    expect(localizedPathname('/', 'it', '/system-g')).toBe('/system-g/it/');
    expect(localizedPathname('/', 'fr', '/')).toBe('/');
  });

  it('traduit les adresses de src/lib/slugs.ts', () => {
    expect(localizedPathname('/mentions-legales', 'fr', '/')).toBe('/mentions-legales');
    expect(localizedPathname('/mentions-legales', 'en', '/')).toBe('/en/legal');
    expect(localizedPathname('/mentions-legales', 'it', '/system-g')).toBe('/system-g/it/note-legali');
  });
});

describe('slugs', () => {
  it('sont réversibles pour chaque langue', () => {
    for (const [neutral, slugs] of Object.entries(LOCALIZED_SLUGS)) {
      for (const lang of ['fr', 'en', 'it'] as const) {
        expect(neutralSlug(localizedSlug(neutral, lang), lang)).toBe(neutral);
        expect(slugs[lang] ?? neutral).toBe(localizedSlug(neutral, lang));
      }
    }
  });
});

describe('languageAlternates', () => {
  it("donne l'adresse de la page dans chaque langue, traduction comprise", () => {
    const hrefs = Object.fromEntries(languageAlternates('/en/legal', '/', site).map((a) => [a.lang, a.href]));
    expect(hrefs).toEqual({
      fr: 'https://example.org/mentions-legales',
      en: 'https://example.org/en/legal',
      it: 'https://example.org/it/note-legali',
    });
  });
});

describe('markdownTwinPathname', () => {
  it('suit le slug servi', () => {
    expect(markdownTwinPathname('/theorie/introduction', '/', 'fr')).toBe('/theorie/introduction.md');
    expect(markdownTwinPathname('/en/', '/', 'en')).toBe('/en/index.md');
    expect(markdownTwinPathname('/it/note-legali', '/system-g', 'it')).toBe('/system-g/it/note-legali.md');
  });
});
