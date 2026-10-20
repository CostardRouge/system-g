import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { legal, type LegalSectionId } from '../../content/legal';
import { ui } from '../../i18n/ui';
import type { Lang } from '../../i18n/utils';
import { AUDIENCE_OPT_OUT_KEY } from '../audience';
import { LEGAL_FACTS, fillLegal, legalVars, placeholdersOf } from '../legal';
import { inlineHtmlToMarkdown } from '../markdown';
import { PLAYER_SETTINGS_KEY } from '../player-settings';

const langs = Object.keys(ui) as Lang[];
const root = new URL('../../../', import.meta.url).pathname;
const vars = legalVars(new URL('https://example.org'));

/** Tous les fichiers sources sous src/, en texte — les tests exceptés (celui-ci cite ce qu'il cherche). */
function sources(dir = join(root, 'src')): { file: string; text: string }[] {
  return readdirSync(dir).flatMap((name) => {
    const file = join(dir, name);
    if (statSync(file).isDirectory()) return name === '__tests__' ? [] : sources(file);
    return /\.(ts|mjs|astro)$/.test(name) ? [{ file, text: readFileSync(file, 'utf8') }] : [];
  });
}

describe('les mentions légales', () => {
  it('ont la même structure dans chaque langue', () => {
    const shape = (lang: Lang): LegalSectionId[] => legal[lang].sections.map((s) => s.id);
    for (const lang of langs) {
      expect(shape(lang), lang).toEqual(shape('fr'));
      for (const section of legal[lang].sections) {
        expect(section.paragraphs.length, `${lang} ${section.id}`).toBeGreaterThan(0);
      }
      for (const text of Object.values(legal[lang].switch)) expect(text).not.toBe('');
    }
  });

  it('ne portent que des marqueurs connus, tous remplis', () => {
    for (const lang of langs) {
      for (const section of legal[lang].sections) {
        for (const paragraph of section.paragraphs) {
          for (const key of placeholdersOf(paragraph)) expect(key in vars, `${lang} {${key}}`).toBe(true);
          expect(fillLegal(paragraph, vars)).not.toMatch(/\{\w+\}/);
        }
      }
    }
  });

  it("citent les faits du code : l'hôte du traceur, les clés posées dans le navigateur", () => {
    for (const lang of langs) {
      const text = (id: LegalSectionId) =>
        legal[lang].sections
          .filter((s) => s.id === id)
          .flatMap((s) => s.paragraphs)
          .map((p) => fillLegal(p, vars))
          .join('\n');
      expect(text('measurement'), lang).toContain(LEGAL_FACTS.tracker);
      expect(text('device'), lang).toContain(PLAYER_SETTINGS_KEY);
      expect(text('device'), lang).toContain(AUDIENCE_OPT_OUT_KEY);
      expect(text('hosting'), lang).toContain('example.org');
      expect(text('licence'), lang).toContain(LEGAL_FACTS.license);
    }
  });

  it('se rendent en Markdown sans balise', () => {
    for (const lang of langs) {
      for (const section of legal[lang].sections) {
        for (const paragraph of section.paragraphs) {
          expect(inlineHtmlToMarkdown(fillLegal(paragraph, vars))).not.toMatch(/<[a-z/]/);
        }
      }
    }
  });
});

describe('le code tient ce que les mentions légales disent', () => {
  const files = sources();

  it("n'envoie aucun événement au traceur, et compte les pages sans paramètres ni fragment", () => {
    for (const { file, text } of files) {
      expect(text, file).not.toMatch(/umami\.track|data-umami-event/);
    }
    const client = readFileSync(join(root, 'src/lib/audience-client.ts'), 'utf8');
    expect(client).toContain("excludeSearch: 'true'");
    expect(client).toContain("excludeHash: 'true'");
  });

  it("pose la clé des réglages du player depuis sa seule maison", () => {
    const player = readFileSync(join(root, 'src/components/GPlayer.astro'), 'utf8');
    expect(player).toContain('PLAYER_SETTINGS_KEY');
    for (const { file, text } of files) {
      if (file.endsWith('player-settings.ts')) continue;
      expect(text, file).not.toContain(`'${PLAYER_SETTINGS_KEY}'`);
    }
  });

  it("ne pose rien d'autre dans le stockage du navigateur", () => {
    const writes = files.flatMap(({ file, text }) =>
      [...text.matchAll(/localStorage\.setItem\(\s*([^,]+),/g)].map((m) => `${file}: ${m[1].trim()}`),
    );
    expect(writes.map((w) => w.split(': ')[1]).sort()).toEqual(['AUDIENCE_OPT_OUT_KEY', 'SETTINGS_KEY']);
  });
});
