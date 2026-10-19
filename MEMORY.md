# Project memory — decisions, reasons, traps

Long-term memory of this repo, read at the start of **every** agent session (imported by `CLAUDE.md`). It holds what the code and `git log` cannot tell you: the choices made and their reasons, what was tried and rejected, the traps that cost time, how the maintainer likes to work.

This file is the **always-loaded index**. The detail lives in `docs/memory/<topic>.md`, one file per area, loaded **on demand**: read the topic file(s) matching the area you are about to touch **before** acting (table at the bottom). Do not `@import` them into `CLAUDE.md`.

The memory was opened on 2026-10-19, three months into the project, and seeded from the README, the port plan (`docs/plan-portage-player.md`), the code's own comments and the four merged pull requests. Treat a seeded entry as read off the disk that day, not as a conversation with the maintainer.

## How to maintain (mandatory — CLAUDE.md rule 2)

- **When**: at the end of every task, before its commit, in the same commit. Writing is the **default**; only skip if there is truly nothing a future agent could use, and say so explicitly in the final message.
- **What**: a design/product decision, a non-obvious technical choice, an explicit rejection ("the maintainer did not want X because Y"), a trap and its remedy, a working preference. Not implementation detail readable in the diff, not what `git log` or the README already say.
- **Where**: the matching `docs/memory/<topic>.md`; a new file only when no topic fits (kebab-case name, add it to the table below). Cross-cutting rules, working style, decisions-at-a-glance and open items stay in this index.
- **How**: search first and **update** the existing entry rather than adding a near-duplicate; delete what became false. One entry = one short paragraph: *decision → why → how to apply*, dated `YYYY-MM-DD` on first write and on each revision. Say the same thing **once**.
- **Language**: **English**, dense, factual. No session narration. No test counts (they rot).
- Budget: keep this index under ~200 lines and each topic file under ~150; if one outgrows that, split it.

## Working with Steeve Pommier

- 2026-10-19 — **Answers in French, short, results first.** He does not write code: every line is an agent's, he decides, reviews and tests by hand, on a phone as much as on a computer. Size work in commits, never in developer days; what costs is his time (checks on real devices, decisions), not code volume.
- 2026-10-19 — **The content is not his to change, nor the agent's.** The theory, the biography and the articles are Nabih Gédéon's words; the site exists to carry them faithfully into three languages and an interactive player. A session that finds a text awkward asks, it does not rewrite.
- 2026-10-19 — Observed from the history: work reaches `main` through pull requests (#1 to #4), titles in English imperative since the versioning PR (the earliest were French); the owner merges. A cloud session pushes its branch and opens the PR.

## Direction in five lines

- A site built to last around one theory: static files, no CMS, no vendor lock, a deploy that is a push to `main`.
- Three entries — Literature, Theory, the interactive player — of which Theory and the player are filled; Literature is announced "in preparation" and kept out of search engines until it has content.
- The player is a faithful port of the 2009 Windows "G System Player": same scale files, same score format (the original `.txt`, unchanged), same instruments and coefficients, and only *better* where the web allows it (sample-accurate timing, click-free envelopes, A/B against equal temperament, a WAV export).
- French first, served at the root; English and Italian as working translations with the same slugs; every page findable (canonical, hreflang, sitemap with real dates, share images, Markdown twins, `llms.txt`, every AI crawler allowed on purpose).
- Honest measurement: the publisher's own Umami, cookie-free, off for a browser that says no, and the footer says when a build counts.

## Decisions at a glance (details in the topic files)

- The site is Astro 4, static, with its `site` and `base` taken from `SITE_URL` / `BASE_PATH` so the same build works on a custom domain, on `costardrouge.github.io/system-g` and in Docker — `deployment.md`.
- The portfolio standard, `COMMON-PROJECT-SPEC.md` in second-brain, adopted 2026-10-19: the agent scaffold (this memory, `AGENTS.md`, `/memorize`), the registry rule and its workflow, the trailer whatever the harness asks for, Node pinned (`.nvmrc` 24, `engines` ≥ 22, exact Docker tags), Biome in a PR gate (`ci.yml`) with Dependabot — `deployment.md`.
- French is the source language and lives at `/`; `en` and `it` are prefixed and reuse the French slugs; a missing dictionary key falls back to French in silence, so a key is added in the three languages at once — `site-and-i18n.md`.
- `src/lib/routes.ts` is the one manifest of real pages: the sitemap, the share images, the Markdown twins and `llms.txt` read it, nothing is hand-written in a shell; a section in preparation is `noindex` and out of the sitemap but keeps a share image — `site-and-i18n.md`.
- Share images are generated at every build with satori + resvg-wasm (never sharp: it resolves fonts by name and draws nothing on a machine without the font) and gitignored so they cannot drift from the content — `site-and-i18n.md`.
- The sitemap's `lastmod` is the page's last git commit, which needs a full clone (`fetch-depth: 0`); a shallow one falls back to the build date — `deployment.md`.
- Every AI crawler is allowed in `robots.txt`, bot by bot and deliberately: the site's goal is the theory's visibility, training and citation alike — `site-and-i18n.md`.
- Umami is the publisher's own instance at `insight.steevepommier.com/insight` (filter lists block `/script.js`), the build writes settings in the head and the page's script decides, auto-track is fine because every page is a full load, the site id is in the code (not a secret) and an empty `UMAMI_WEBSITE_ID` turns everything off — `site-and-i18n.md`.
- The version is shown in the footer from `package.json`, releases are made by `release.yml` from `CHANGELOG.md` (gemstone codenames, 0.1.0–0.3.0 backfilled, 0.4.0 "Diamond" the first numbered one) — `deployment.md`, CLAUDE.md rule 4.
- The player's engine is pure TypeScript (parsers, an evaluator in exact rationals, a Web Audio scheduler, an instrument table), tested against values the legacy computed; the legacy's semantics are kept even where odd (no sample looping, monophony) and improved only on timing and clicks — `player.md`.
- The scores stay the original `.txt` files (the archive's canonical format), copied and catalogued by `scripts/build-library.mjs` into `public/player/scores/` and `library.json`; the metadata lives beside the files, never inside — `player.md`.
- A single light "paper" theme (`color-scheme: light`); no dark theme was built — `site-and-i18n.md`.
- 2026-10-19 — **MIT for the code, nothing else** (`LICENSE`, like `tamalou` and `metube-extension`; `package.json` had said MIT since the first commit with no file behind it). The theory, every text, the scales and scores, and the whole legacy player under `system-g-player/` are carved out as © Nabih Gédéon, all rights reserved — the legacy sources carry "© 2009 Faraj Elias", which the carve-out names rather than contradicts. The README's Licence section says the same in French; keep the two in step.

## Open items

- 2026-10-19 — The owner runs `bin/registry-setup.sh system-g` in `second-brain` (from his machine, `gh` logged in) so `registry.yml`'s `send` job can report; until then it says so and stays green. The fiche's slug is `systeme-g`.
- 2026-10-19 — The backfilled releases v0.1.0–v0.3.0 wait on `second-brain`'s "Backfill releases" workflow, run once by the owner with his token; v0.4.0 is `release.yml`'s own.
- 2026-10-19 — The original Windows player is tracked whole in `system-g-player/` (14 MB: C# sources, `.dll`/`.exe`, 37 WAV samples, the scores), in a public repository. Its sources carry "© 2009 Faraj Elias"; the plan of 2026-07-07 (`docs/plan-portage-player.md` §5) said the rights on the code and the samples were to be clarified with the family before publication. Nothing records that it was. The owner's call.
- 2026-10-19 — Literature is still an empty section (`noindex`); the Theory index announces three sub-pages "coming soon" (rules, coding, marking). Content is Nabih Gédéon's to give.
- 2026-10-19 — `README.md` says the custom domain is an example (`intervalles-systeme-g.com`) and the audience settings count that host and `costardrouge.github.io`; which address is live, and whether `public/CNAME` exists on the deployed site, has not been checked from a session.
- 2026-10-19 — No parity test holds the three dictionaries together yet; parity was measured by hand on 2026-10-19 (122 keys each).
- 2026-10-19 — Biome lints but does not format (`biome.jsonc`, `formatter.enabled: false`): the repo-wide reformat is its own pull request, when the owner wants one; `biome format .` would then say how far the files are from Biome's defaults.

## Topic files

| file | read when |
| --- | --- |
| `docs/memory/site-and-i18n.md` | touching the pages, the layout, the dictionaries, the content modules, SEO/GEO, the share images, measurement |
| `docs/memory/player.md` | touching `src/lib/systemg/`, `GPlayer.astro`, the scores, the instruments, the positions explorer |
| `docs/memory/deployment.md` | touching `deploy.yml`, the Docker files, `astro.config.mjs`, the version and releases, CI, the toolchain |
