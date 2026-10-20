/**
 * La clé sous laquelle le player garde ses réglages dans le stockage local du
 * navigateur (mode, instrument, intonation, tempo, transposition, suivi).
 *
 * Une seule maison : le player l'écrit (src/components/GPlayer.astro), les
 * mentions légales la nomment (src/content/legal.ts), et un test tient les
 * deux ensemble. Changer la clé, c'est perdre les réglages des visiteurs :
 * à dire dans le CHANGELOG.
 */
export const PLAYER_SETTINGS_KEY = 'systemg.player.settings';
