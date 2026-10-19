# Deployment, build, versions, toolchain

Read before touching `.github/workflows/`, `Dockerfile`, `docker-compose.yml`, `nginx.conf`, `astro.config.mjs`, `package.json`, `CHANGELOG.md` or `src/lib/version.ts`.

## Build and deploy (2026-10-19, read off the code)

- **GitHub Pages from `deploy.yml`** on every push to `main` (and by hand): `actions/configure-pages` with `enablement: true` creates the Pages site if the owner never switched it on, and hands the build its `origin` and `base_path`, which `astro.config.mjs` reads as `SITE_URL` and `BASE_PATH` — the same build serves a custom domain (add `public/CNAME`), a project page under `/system-g`, or Docker. Locally: `SITE_URL="https://…" BASE_PATH="/" npm run build`.
- The workflow checks out with **`fetch-depth: 0`** because `src/lib/git.ts` reads each page's last commit date for the sitemap's `lastmod`; a shallow clone silently falls back to the build date for every page. Keep the full history in any job that builds for publication.
- `OUT_DIR`, `ASTRO_CACHE_DIR` and `VITE_CACHE_DIR` override the output and cache folders (useful where `node_modules` is read-only or shared).
- **Docker is for local use, not deployment**: a multi-stage `Dockerfile` (`dev` with hot reload on 4321, `build`, `prod` = nginx serving `dist/` on 8080 with clean URLs, a long cache on `/_astro/`, gzip), driven by `docker-compose.yml`'s two services. Nothing pulls the image anywhere.
- The share images are drawn before the build (`prebuild`); `npm run build:og` draws them alone. They need `node_modules/@fontsource/eb-garamond` and `@resvg/resvg-wasm`, so `npm ci` comes first.

## Versions (2026-10-17, PR #3; CLAUDE.md rule 4)

- One SemVer version in `package.json`, `CHANGELOG.md` in English as the source, tags and GitHub Releases made by `release.yml` on `main`; codenames are gemstones, alphabetical (Agate, Beryl, Citrine, Diamond — the next starts with E). 0.4.0 "Diamond" is the first numbered release; 0.1.0–0.3.0 were backfilled to the history's turning points (first site, the player, phase 3) and wait on `second-brain`'s backfill workflow (open item in `MEMORY.md`).
- The version reaches the footer through `src/lib/version.ts` (a named JSON import of `package.json`, so only the string lands in the page); `src/lib/__tests__/version.test.ts` holds the two together.
- The deploy does not follow releases and does not have to; if it ever does, a tag made with the workflow's `GITHUB_TOKEN` triggers no other workflow, so the deploy would be a job of `release.yml`'s `publish`.

## The portfolio standard (2026-10-19)

- **`COMMON-PROJECT-SPEC.md` (second-brain) applied, scaffold part**: `CLAUDE.md` rewritten in the standard shape (Context with the visibility, rules 1–4, "trust the disk", other rules), this memory opened, `AGENTS.md` a symlink to `CLAUDE.md` (K1), the canonical `/memorize` in `.claude/commands/memorize.md` (K6: a cloud session pushes its branch, a local one never pushes), the commit trailer "whatever the harness asks for" (K2), and `.github/workflows/registry.yml` copied byte for byte from `tamalou` (C10; the fiche's slug is `systeme-g`, not the repository's name). The repository is public, so a Registry block carries only `Project:`, ticked boxes and one `Log:` line.
- Only the versions rule (C13) had been adopted before this day: the previous `CLAUDE.md` had a Context, that rule and the related files, and no memory at all. What this file says about the site was read off the disk when the memory was opened, not learned in a session.
