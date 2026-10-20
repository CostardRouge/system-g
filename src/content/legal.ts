/**
 * Mentions légales et confidentialité : qui édite le site, qui l'héberge, ce
 * qu'il garde sur l'appareil du visiteur, ce qu'il mesure, sous quelle licence.
 *
 * Des faits, pas une formule : les paragraphes portent des marqueurs
 * (`{host}`, `{tracker}`, `{source}`, `{license}`, `{settingsKey}`,
 * `{optOutKey}`) remplis par src/lib/legal.ts depuis le code, et un test
 * tient les textes au code. Les chaînes peuvent porter un peu de HTML de
 * confiance en ligne (<a>, <b>, <i>, <code>) ; le jumeau Markdown le
 * convertit. Même structure dans les trois langues (mêmes identifiants de
 * sections, dans le même ordre). Vouvoiement : le site est celui d'un
 * musicologue, pas une app.
 */
import type { Lang } from '../i18n/utils';

export type LegalSectionId =
  | 'publisher'
  | 'hosting'
  | 'device'
  | 'measurement'
  | 'cookies'
  | 'logs'
  | 'rights'
  | 'licence'
  | 'liability';

export interface LegalSection {
  id: LegalSectionId;
  heading: string;
  paragraphs: string[];
}

export interface LegalDoc {
  /** Titre de la page (et de l'onglet). */
  title: string;
  /** Description pour les moteurs. */
  description: string;
  overline: string;
  intro: string;
  updated: string;
  tocAria: string;
  /** Les textes de l'interrupteur de mesure d'audience. */
  switch: { on: string; off: string; signal: string; none: string; stop: string; resume: string };
  sections: LegalSection[];
}

const GITHUB_PRIVACY = 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement';

export const legal: Record<Lang, LegalDoc> = {
  fr: {
    title: 'Mentions légales et confidentialité',
    description: 'Qui édite le site du Système G, qui l’héberge, et ce qu’il sait de vous : très peu.',
    overline: 'Le Système G',
    intro: 'Qui édite ce site, qui l’héberge, et ce qu’il sait de vous : très peu.',
    updated: 'Dernière mise à jour le 19 octobre 2026.',
    tocAria: 'Sur cette page',
    switch: {
      on: 'Vos visites sont comptées, anonymement, dans ce navigateur.',
      off: 'Vos visites ne sont pas comptées dans ce navigateur.',
      signal: 'Votre navigateur demande à ne pas être suivi : vos visites ne sont pas comptées.',
      none: 'Cette copie du site ne compte pas les visites.',
      stop: 'Ne plus compter mes visites',
      resume: 'Compter à nouveau mes visites',
    },
    sections: [
      {
        id: 'publisher',
        heading: 'Éditeur',
        paragraphs: [
          'Le site du Système G est édité par <b>Steeve Pommier</b>, particulier, à titre non commercial : il est gratuit, sans publicité, et ne vend rien. La théorie, les textes et le player d’origine sont l’œuvre de <b>Nabih Gédéon</b>, l’auteur (voir Licence et contenus).',
          'Contact : par le <a href="{source}/issues">dépôt du site</a> (GitHub).',
          'En tant qu’éditeur non professionnel, les informations d’identification prévues par la loi (Loi pour la confiance dans l’économie numérique, art. 6-III) sont conservées auprès de l’hébergeur ci-dessous.',
        ],
      },
      {
        id: 'hosting',
        heading: 'Hébergement',
        paragraphs: [
          '<b>{host}</b> est servi par GitHub Pages : GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis, <a href="https://github.com">github.com</a>.',
          'La mesure d’audience tourne sur un serveur de l’éditeur (voir ci-dessous).',
        ],
      },
      {
        id: 'device',
        heading: 'Sur votre appareil',
        paragraphs: [
          'En bref : le site ne sait pas qui vous êtes et ne cherche pas à le savoir. Pas de compte, pas de cookie, pas de publicité.',
          'Le player interactif garde ses réglages (mode, instrument, intonation, tempo, transposition, suivi) dans le stockage local de votre navigateur, sous la clé <code>{settingsKey}</code>, sur cet appareil seulement. Une partition que vous déposez ou écrivez dans l’éditeur, et un fichier WAV que vous exportez, sont traités dans votre navigateur et n’en sortent pas. Si vous refusez la mesure d’audience ci-dessous, ce choix est gardé sous la clé <code>{optOutKey}</code>. Rien d’autre n’est enregistré ; pour l’effacer, supprimez les données de ce site dans les réglages de votre navigateur.',
        ],
      },
      {
        id: 'measurement',
        heading: 'Mesure d’audience',
        paragraphs: [
          'Les visites sont comptées avec <a href="https://umami.is">Umami</a>, auto-hébergé sur un serveur de l’éditeur à l’adresse <code>{tracker}</code> : aucun tiers ne reçoit les données, et rien ne sert à la publicité.',
          '<b>Ce qui est compté :</b> les pages vues (leur adresse seule, sans paramètres ni fragment), le site d’où vous venez, votre navigateur, votre système, le type d’appareil, la taille d’écran, la langue et le pays. Aucun événement n’est envoyé : ce que vous jouez, écrivez ou exportez dans le player n’est jamais transmis.',
          '<b>Ce qui ne l’est jamais :</b> votre adresse IP (elle donne le pays, puis est oubliée), ni rien qui puisse vous suivre d’un site à l’autre. Aucun cookie n’est déposé.',
          'Le compteur n’est même pas chargé quand votre navigateur envoie <i>Do Not Track</i> ou <i>Global Privacy Control</i>, ou quand vous le coupez ci-dessous ; ce choix est gardé dans ce navigateur.',
        ],
      },
      {
        id: 'cookies',
        heading: 'Cookies',
        paragraphs: [
          'Le site ne dépose aucun cookie, donc pas de bandeau de consentement : il n’y a rien à accepter.',
        ],
      },
      {
        id: 'logs',
        heading: 'Hébergement et journaux',
        paragraphs: [
          `Comme tout hébergeur, GitHub traite votre adresse IP pour délivrer les pages et protéger le site : voir la <a href="${GITHUB_PRIVACY}">déclaration de confidentialité de GitHub</a>. Le site lui-même n’a pas de serveur et ne tient aucun journal.`,
        ],
      },
      {
        id: 'rights',
        heading: 'Vos droits',
        paragraphs: [
          'Le RGPD vous permet de demander l’accès aux données qui vous concernent ou leur effacement. Le site n’en garde aucune qui vous nomme : les réglages du player sont sur votre appareil, et la mesure d’audience ne porte aucun identifiant. Pour toute question ou demande, écrivez par le <a href="{source}/issues">dépôt du site</a> ; vous pouvez aussi adresser une réclamation à la <a href="https://www.cnil.fr">CNIL</a>.',
        ],
      },
      {
        id: 'licence',
        heading: 'Licence et contenus',
        paragraphs: [
          'Le code du site est un logiciel libre : son <a href="{source}">code source</a> est publié sous <a href="{license}">licence MIT</a>.',
          'La théorie du Système G, ses textes (biographie, introduction, articles, aide du player), les fichiers de gammes et de partitions et le player Windows d’origine sont © Nabih Gédéon, tous droits réservés : aucune réutilisation sans son accord. Les partitions de la bibliothèque sont celles du player d’origine ; les œuvres qu’elles transcrivent restent à leurs auteurs.',
        ],
      },
      {
        id: 'liability',
        heading: 'Responsabilité',
        paragraphs: [
          'Le site est fourni tel quel, de bonne foi, sans garantie d’aucune sorte. Les liens vers d’autres sites sont donnés par commodité ; leur contenu leur appartient.',
        ],
      },
    ],
  },

  en: {
    title: 'Legal notice and privacy',
    description: 'Who publishes the Système G site, who hosts it, and what it knows about you: very little.',
    overline: 'The G System',
    intro: 'Who publishes this site, who hosts it, and what it knows about you: very little.',
    updated: 'Last updated on 19 October 2026.',
    tocAria: 'On this page',
    switch: {
      on: 'Your visits are counted, anonymously, in this browser.',
      off: 'Your visits aren’t counted in this browser.',
      signal: 'Your browser asks not to be tracked: your visits aren’t counted.',
      none: 'This copy of the site doesn’t count visits.',
      stop: 'Stop counting my visits',
      resume: 'Count my visits again',
    },
    sections: [
      {
        id: 'publisher',
        heading: 'Publisher',
        paragraphs: [
          'The Système G site is published by <b>Steeve Pommier</b>, a private individual, on a non-commercial basis: it is free, shows no ads and sells nothing. The theory, the texts and the original player are the work of <b>Nabih Gédéon</b>, the author (see Licence and content).',
          'Contact: through the <a href="{source}/issues">site’s repository</a> (GitHub).',
          'As a non-professional publisher, the personal details required by French law (Loi pour la confiance dans l’économie numérique, art. 6-III) are kept with the hosting provider named below.',
        ],
      },
      {
        id: 'hosting',
        heading: 'Hosting',
        paragraphs: [
          '<b>{host}</b> is served by GitHub Pages: GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States, <a href="https://github.com">github.com</a>.',
          'Audience measurement runs on the publisher’s own server (see below).',
        ],
      },
      {
        id: 'device',
        heading: 'On your device',
        paragraphs: [
          'In short: the site doesn’t know who you are and doesn’t try to. No account, no cookie, no advertising.',
          'The interactive player keeps its settings (mode, instrument, tuning, tempo, transposition, follow) in your browser’s local storage, under the key <code>{settingsKey}</code>, on this device only. A score you drop or write in the editor, and a WAV file you export, are processed in your browser and never leave it. If you decline audience measurement below, that choice is kept under the key <code>{optOutKey}</code>. Nothing else is stored; to erase it, clear this site’s data in your browser’s settings.',
        ],
      },
      {
        id: 'measurement',
        heading: 'Audience measurement',
        paragraphs: [
          'Visits are counted with <a href="https://umami.is">Umami</a>, self-hosted on the publisher’s own server at <code>{tracker}</code>: no third party receives the data, and none of it serves advertising.',
          '<b>Counted:</b> the pages viewed (their address alone, without parameters or fragment), the site you came from, your browser, system, type of device, screen size, language and country. No event is sent: what you play, write or export in the player is never transmitted.',
          '<b>Never counted:</b> your IP address (it gives the country, then is discarded), or anything that could follow you from one site to another. No cookie is set.',
          'The counter isn’t even loaded when your browser sends <i>Do Not Track</i> or <i>Global Privacy Control</i>, or when you switch it off below; that choice is kept in this browser.',
        ],
      },
      {
        id: 'cookies',
        heading: 'Cookies',
        paragraphs: ['The site sets no cookie, so there is no consent banner: there is nothing to consent to.'],
      },
      {
        id: 'logs',
        heading: 'Hosting and logs',
        paragraphs: [
          `Like any host, GitHub processes your IP address to deliver the pages and protect the site: see <a href="${GITHUB_PRIVACY}">GitHub’s privacy statement</a>. The site itself has no server and keeps no log.`,
        ],
      },
      {
        id: 'rights',
        heading: 'Your rights',
        paragraphs: [
          'Under the GDPR you may ask to access or erase data about you. The site keeps none that names you: the player’s settings are on your device, and audience measurement carries no identifier. For any question or request, write through the <a href="{source}/issues">site’s repository</a>; you may also lodge a complaint with the <a href="https://www.cnil.fr">CNIL</a> (the French authority) or with the authority of your own country.',
        ],
      },
      {
        id: 'licence',
        heading: 'Licence and content',
        paragraphs: [
          'The site’s code is free software: its <a href="{source}">source code</a> is published under the <a href="{license}">MIT licence</a>.',
          'The Système G theory, its texts (the biography, the introduction, the articles, the player’s help), the scale and score files and the original Windows player are © Nabih Gédéon, all rights reserved: no reuse without his permission. The library’s scores are those of the original player; the works they transcribe remain their authors’.',
        ],
      },
      {
        id: 'liability',
        heading: 'Liability',
        paragraphs: [
          'The site is provided as is, in good faith, with no warranty of any kind. Links to other sites are given for convenience; their content is theirs.',
        ],
      },
    ],
  },

  it: {
    title: 'Note legali e riservatezza',
    description: 'Chi pubblica il sito del Sistema G, chi lo ospita e che cosa sa di voi: molto poco.',
    overline: 'Il Sistema G',
    intro: 'Chi pubblica questo sito, chi lo ospita e che cosa sa di voi: molto poco.',
    updated: 'Ultimo aggiornamento: 19 ottobre 2026.',
    tocAria: 'In questa pagina',
    switch: {
      on: 'Le vostre visite sono contate, in forma anonima, in questo browser.',
      off: 'Le vostre visite non sono contate in questo browser.',
      signal: 'Il vostro browser chiede di non essere tracciato: le vostre visite non sono contate.',
      none: 'Questa copia del sito non conta le visite.',
      stop: 'Non contare più le mie visite',
      resume: 'Contare di nuovo le mie visite',
    },
    sections: [
      {
        id: 'publisher',
        heading: 'Editore',
        paragraphs: [
          'Il sito del Sistema G è pubblicato da <b>Steeve Pommier</b>, privato, a titolo non commerciale: è gratuito, senza pubblicità e non vende nulla. La teoria, i testi e il player originale sono opera di <b>Nabih Gédéon</b>, l’autore (si veda Licenza e contenuti).',
          'Contatto: tramite il <a href="{source}/issues">repository del sito</a> (GitHub).',
          'In quanto editore non professionale, i dati identificativi previsti dalla legge francese (Loi pour la confiance dans l’économie numérique, art. 6-III) sono conservati presso l’host indicato qui sotto.',
        ],
      },
      {
        id: 'hosting',
        heading: 'Hosting',
        paragraphs: [
          '<b>{host}</b> è servito da GitHub Pages: GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, Stati Uniti, <a href="https://github.com">github.com</a>.',
          'La misurazione del pubblico gira su un server dell’editore (si veda sotto).',
        ],
      },
      {
        id: 'device',
        heading: 'Sul vostro dispositivo',
        paragraphs: [
          'In breve: il sito non sa chi siete e non cerca di saperlo. Nessun account, nessun cookie, nessuna pubblicità.',
          'Il player interattivo conserva le sue impostazioni (modalità, strumento, intonazione, tempo, trasposizione, scorrimento) nella memoria locale del vostro browser, sotto la chiave <code>{settingsKey}</code>, soltanto su questo dispositivo. Una partitura che caricate o scrivete nell’editor, e un file WAV che esportate, sono elaborati nel vostro browser e non ne escono. Se rifiutate la misurazione del pubblico qui sotto, la scelta è conservata sotto la chiave <code>{optOutKey}</code>. Nient’altro viene registrato; per cancellarlo, eliminate i dati di questo sito nelle impostazioni del browser.',
        ],
      },
      {
        id: 'measurement',
        heading: 'Misurazione del pubblico',
        paragraphs: [
          'Le visite sono contate con <a href="https://umami.is">Umami</a>, ospitato su un server dell’editore all’indirizzo <code>{tracker}</code>: nessun terzo riceve i dati, e nulla serve alla pubblicità.',
          '<b>Che cosa viene contato:</b> le pagine viste (soltanto il loro indirizzo, senza parametri né frammento), il sito da cui venite, il browser, il sistema, il tipo di dispositivo, le dimensioni dello schermo, la lingua e il paese. Nessun evento viene inviato: ciò che suonate, scrivete o esportate nel player non viene mai trasmesso.',
          '<b>Che cosa non lo è mai:</b> il vostro indirizzo IP (fornisce il paese, poi viene dimenticato), né nulla che possa seguirvi da un sito all’altro. Nessun cookie viene depositato.',
          'Il contatore non viene nemmeno caricato quando il browser invia <i>Do Not Track</i> o <i>Global Privacy Control</i>, o quando lo disattivate qui sotto; la scelta è conservata in questo browser.',
        ],
      },
      {
        id: 'cookies',
        heading: 'Cookie',
        paragraphs: ['Il sito non deposita alcun cookie, quindi nessun banner di consenso: non c’è nulla da accettare.'],
      },
      {
        id: 'logs',
        heading: 'Hosting e registri',
        paragraphs: [
          `Come ogni host, GitHub tratta il vostro indirizzo IP per servire le pagine e proteggere il sito: si veda l’<a href="${GITHUB_PRIVACY}">informativa sulla privacy di GitHub</a>. Il sito stesso non ha server e non tiene alcun registro.`,
        ],
      },
      {
        id: 'rights',
        heading: 'I vostri diritti',
        paragraphs: [
          'Il GDPR vi permette di chiedere l’accesso ai dati che vi riguardano o la loro cancellazione. Il sito non ne conserva nessuno che vi nomini: le impostazioni del player sono sul vostro dispositivo, e la misurazione del pubblico non porta alcun identificativo. Per ogni domanda o richiesta, scrivete tramite il <a href="{source}/issues">repository del sito</a>; potete anche presentare un reclamo alla <a href="https://www.cnil.fr">CNIL</a> (l’autorità francese) o all’autorità del vostro paese.',
        ],
      },
      {
        id: 'licence',
        heading: 'Licenza e contenuti',
        paragraphs: [
          'Il codice del sito è software libero: il suo <a href="{source}">codice sorgente</a> è pubblicato con <a href="{license}">licenza MIT</a>.',
          'La teoria del Sistema G, i suoi testi (biografia, introduzione, articoli, guida del player), i file delle scale e delle partiture e il player Windows originale sono © Nabih Gédéon, tutti i diritti riservati: nessun riutilizzo senza il suo consenso. Le partiture della biblioteca sono quelle del player originale; le opere che trascrivono restano ai loro autori.',
        ],
      },
      {
        id: 'liability',
        heading: 'Responsabilità',
        paragraphs: [
          'Il sito è fornito così com’è, in buona fede, senza garanzia di alcun tipo. I link ad altri siti sono offerti per comodità; il loro contenuto appartiene a loro.',
        ],
      },
    ],
  },
};
