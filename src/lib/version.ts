/**
 * Version du site, lue dans le package.json racine au moment du build.
 *
 * Un import JSON nommé : seule la chaîne arrive dans la page, pas le
 * manifeste entier. CHANGELOG.md dit ce que chaque version a apporté, et
 * .github/workflows/release.yml la tague sur main (CLAUDE.md, « Versions
 * and releases »). Affichée dans le pied de page, pour qu'un téléphone en
 * main dise quel build il montre.
 */
import { version } from '../../package.json';

export const SITE_VERSION: string = version;
