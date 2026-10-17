# Instructions for LLM agents (Claude Code, Codex, Cursor, etc.)

Agents read this file at the start of every session. These rules override the agent's default behaviour and apply for the whole session, not only the first turn. They are cut from `COMMON-PROJECT-SPEC.md` in the private `second-brain` repository; only the versions rule (C13) has been adopted here so far.

## Context

- **Le Système G** — the site of Nabih Gédéon's theory of musical intervals (positions and expressiveness, the natural semitone 22/21), in French (at `/`), English (`/en/`) and Italian (`/it/`), with an interactive player ported from the original Windows player. `README.md` describes the layout.
- **Owner**: Steeve Pommier (GitHub `CostardRouge`). He writes in **French**: answer in French. The texts and the theory belong to Nabih Gédéon.
- **Stack**: Astro 4 (static), TypeScript, Vitest; npm, `package-lock.json` is the only lockfile. Share images are drawn at build time by `scripts/build-og-images.mjs` (satori + resvg, the `prebuild` script).
- **Commands that exist**: `npm run dev`, `npm run build` (OG images, then `astro build` into `dist/`), `npm run preview`, `npm run check` (`astro check`), `npm test` (Vitest). A change is finished when `npm run check`, `npm test` and `npm run build` are green.
- **Deploy**: `.github/workflows/deploy.yml` builds and publishes `main` to GitHub Pages on every push. There is no CI gate on pull requests apart from `release.yml`'s `check` job.
- Several agent sessions may run in parallel on this repo: one commit = one task, staged file by file. Local sessions never push; cloud sessions push their branch and open a pull request. Never push to `main`.

## Versions and releases (MANDATORY)

The project carries **one version**, `version` in the root `package.json`, in
[Semantic Versioning](https://semver.org/spec/v2.0.0.html): `MAJOR.MINOR.PATCH`.
`CHANGELOG.md` says what each release brings to the people who use the
project, newest first, in the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
shape. **It is written in English, like the code, even when the project
speaks French.** Each release has a **codename**: here a gemstone, in
alphabetical order (0.1.0 Agate … 0.4.0 Diamond; the next starts with E or
later).

- **Every pull request that changes what users get** adds its lines under
  `## [Unreleased]` (`### Added`, `### Changed`, `### Fixed`, `### Removed`,
  `### Security`), written for a user, not a developer. Tooling, a refactor or
  a test adds nothing there. It does not touch the version.
- **A release is its own pull request**, made when the owner asks for one: it
  moves the `Unreleased` lines under `## [x.y.z] - YYYY-MM-DD — Codename` and
  sets `package.json` to the same version, nothing else. PATCH for fixes only;
  MINOR for anything new; MAJOR when something users relied on stops working
  (stored data that does not carry over, a link, a protocol, a removed
  feature). Before 1.0.0, MINOR covers both. A new MINOR or MAJOR takes a new
  codename, never reused; a PATCH keeps its minor's. When a milestone ends or
  `Unreleased` holds something worth announcing, say so in the final message:
  the owner decides when to release.
- **Never tag nor publish a release by hand.** On `main`,
  `.github/workflows/release.yml` gives every section that has none its tag
  `vX.Y.Z` and its GitHub Release; on every pull request its `check` job
  refuses a `CHANGELOG.md` that disagrees with `package.json` or breaks the
  shape. Run `node .github/release.mjs check` before pushing a release.
- **A backfilled release** — a version given after the fact to a past state —
  is a section placed at its rank in the file, with
  `<!-- commit: <full sha> -->` right under its heading; the workflow tags that
  commit. It never rewrites a section that already has its release. GitHub
  refuses the workflow's own token a tag on a commit whose workflows differ
  from `main`'s, so here a backfill is skipped with a warning and the rest
  still ships; `second-brain`'s "Backfill releases" workflow, which holds the
  owner's token, publishes it (`release.mjs backfill`).
- **A repo that serves a page shows its version** where a user can find it (a
  footer, an about line, a settings screen), read from `package.json` at build
  time, so a phone in hand says which build it runs.

Here the footer shows it, through `src/lib/version.ts`. The deploy is
unchanged: a release is a tag beside it, not a gate in front of it. If a deploy
ever has to follow releases, note that a tag or Release made with the
workflow's `GITHUB_TOKEN` triggers no other workflow: the deploy would have to
run as a job of `release.yml`'s `publish`, never `on: release`.

## Related files

- `README.md`: the site's layout, i18n and deploy, for people.
- `CHANGELOG.md`: what each release brings; `.github/release.mjs` + `.github/workflows/release.yml` tag and publish it.
- `docs/plan-portage-player.md`: how the original Windows player was ported.
