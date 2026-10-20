import { describe, expect, it } from 'vitest';
import { defaultLang, languages, ui } from '../ui';

describe('les dictionnaires', () => {
  const reference = Object.keys(ui[defaultLang]).sort();

  it('ont les mêmes clés dans chaque langue (une clé absente retombe sur le français en silence)', () => {
    for (const lang of Object.keys(languages) as (keyof typeof ui)[]) {
      expect(Object.keys(ui[lang]).sort(), lang).toEqual(reference);
    }
  });

  it("n'ont pas de texte vide", () => {
    for (const [lang, dictionary] of Object.entries(ui)) {
      for (const [key, text] of Object.entries(dictionary)) {
        expect(text.trim(), `${lang} ${key}`).not.toBe('');
      }
    }
  });
});
