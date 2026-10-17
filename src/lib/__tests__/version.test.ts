import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SITE_VERSION } from '../version';

describe('SITE_VERSION', () => {
  it('est la version du package.json racine', () => {
    const manifest = JSON.parse(
      readFileSync(new URL('../../../package.json', import.meta.url), 'utf8'),
    );
    expect(SITE_VERSION).toBe(manifest.version);
    expect(SITE_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
