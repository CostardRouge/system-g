# Changelog

What each release of the Système G site brings to the people who visit it. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html); `.github/workflows/release.yml` turns each section into a
tag and a GitHub Release once it reaches `main` (COMMON-PROJECT-SPEC C13 in `second-brain`). Written in English, like
the code, although the site speaks French first. Codenames are gemstones, in alphabetical order. Versions 0.1.0 to
0.3.0 were given after the fact to the history's turning points.

## [Unreleased]

### Added

- Visits are counted with the publisher's own Umami, without cookies; a browser that says no (Do Not Track, Global
  Privacy Control) is never counted, and the footer says so.
- A legal notice in each language (`/mentions-legales`, `/en/legal`, `/it/note-legali`), linked from the footer: who
  publishes and hosts the site, what it keeps on your device, what is measured and what never is, the licence — with a
  switch to stop or resume counting your visits in this browser.

## [0.4.0] - 2026-10-17 — Diamond

The first numbered release: the site as it is deployed today.

### Added

- Every page has its own share image, in each language, so a link shows the page it points to.
- Every page has a plain Markdown twin (`/theorie/introduction.md`…), for readers and tools that prefer text.
- The footer shows the site's version.

### Changed

- The sitemap gives each page its real date of last change and its share image.
- The Literature section, still in preparation, is kept out of search engines until it has content.

### Fixed

- The favicon and the install manifest load on the GitHub Pages address, under its sub-path.

## [0.3.0] - 2026-07-19 — Citrine
<!-- commit: 79975b7e001e13ad650c7d35172b7f2c1694355c -->

### Added

- The player compares a piece in the Système G's just intonation with the same piece in equal temperament, A/B.
- A score editor in the player, checked line by line as you type.
- A piece can be saved as a WAV file.
- A pitch curve shows how each note sits against equal temperament.
- An interactive explorer of the positions, in the Theory section.

### Changed

- The player remembers its settings on this device.
- The player's search lists pieces more clearly, and drops the dash when a piece has no composer.

## [0.2.0] - 2026-07-08 — Beryl
<!-- commit: 49d40a85db57ab30cf9ccf84776d8fc8d06cf9b2 -->

### Added

- The interactive player: the Système G's scales and some two hundred pieces from the original Windows player,
  played in the browser on eighteen sampled instruments or a plain oscillator.
- A help page for the player, and a short guide that folds open above it.
- A theory article comparing the Système G with Partch's 43-tone scale, Johnston's notation and the maqam tradition.
- Icons for the browser tab and the home screen, and share images in each language.

## [0.1.0] - 2026-07-07 — Agate
<!-- commit: c3f35093bc99eee48412e14ef67a5f1d348fd484 -->

### Added

- The site of the Système G, Nabih Gédéon's theory of musical intervals, in French, English and Italian.
- The home page, the author's biography and an introduction to the theory.
- The Literature, Theory and Player sections, announced as in preparation.
