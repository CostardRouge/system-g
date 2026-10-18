import { describe, expect, it } from 'vitest';
import { AUDIENCE_DEFAULTS, audienceJson, audienceSettings } from '../audience';

describe('audienceSettings', () => {
  it('ne mesure que les builds de production, sauf demande', () => {
    expect(audienceSettings({ UMAMI_WEBSITE_ID: 'id' }, { production: false })).toBeNull();
    expect(audienceSettings({ UMAMI_WEBSITE_ID: 'id', UMAMI_DEV: 'true' }, { production: false })).not.toBeNull();
  });

  it("est coupée par un identifiant de site vide", () => {
    expect(audienceSettings({ UMAMI_WEBSITE_ID: '' }, { production: true })).toBeNull();
    expect(audienceSettings({ UMAMI_WEBSITE_ID: '  ' }, { production: true })).toBeNull();
  });

  it("prend l'instance de l'éditeur, l'identifiant du site et ses deux hôtes par défaut", () => {
    expect(audienceSettings({}, { production: true })).toEqual({
      src: AUDIENCE_DEFAULTS.src,
      website: AUDIENCE_DEFAULTS.websiteId,
      domains: 'intervalles-systeme-g.com,costardrouge.github.io',
    });
    expect(AUDIENCE_DEFAULTS.websiteId).toMatch(/^[0-9a-f-]{36}$/);
    expect(audienceSettings({ UMAMI_WEBSITE_ID: ' id ' }, { production: true })?.website).toBe('id');
  });

  it("suit les variables d'environnement, et ignore une adresse inutilisable", () => {
    expect(
      audienceSettings(
        { UMAMI_WEBSITE_ID: 'id', UMAMI_SRC: 'https://insight.example.com/insight', UMAMI_DOMAINS: 'A.com, b.com,' },
        { production: true },
      ),
    ).toEqual({ src: 'https://insight.example.com/insight', website: 'id', domains: 'a.com,b.com' });
    expect(audienceSettings({ UMAMI_WEBSITE_ID: 'id', UMAMI_SRC: 'javascript:alert(1)' }, { production: true })?.src).toBe(
      AUDIENCE_DEFAULTS.src,
    );
    expect(audienceSettings({ UMAMI_WEBSITE_ID: 'id', UMAMI_SRC: 'not a url' }, { production: true })?.src).toBe(
      AUDIENCE_DEFAULTS.src,
    );
  });
});

describe('audienceJson', () => {
  it("écrit un JSON qui ne peut pas fermer la balise <script>", () => {
    const json = audienceJson({ src: 'https://x/</script>', website: 'w', domains: '' });
    expect(json).not.toContain('</script>');
    expect(JSON.parse(json)).toEqual({ src: 'https://x/</script>', website: 'w', domains: '' });
  });
});
