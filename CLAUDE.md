# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Bang-Shien Chen's personal academic website, served as a static site via GitHub Pages at https://dgbshien.com/ (domain set by `CNAME`). Hand-written HTML/CSS/vanilla JS — **no framework, no build step, no bundler, no package manager**. The only external dependency is Google Fonts (loaded via `<link>`); there are no vendored libraries or submodules.

## Commands

- **Run locally**: serve the repo root (e.g. `python3 -m http.server`) so relative `docs/`, `css/`, `js/` paths resolve, then open the printed URL. Opening `index.html` directly also works but `fetch`-free, so it's fine.
- **Format** (the only CI check, runs Prettier on PRs/pushes to `main`): `prettier . --check` to verify, `prettier . --write` to fix. `docs/` is excluded via `.prettierignore`.

## Branching

Work happens on `develop`; `main` is the deployed branch (GitHub Pages + the format CI both key off `main`). PR `develop` → `main` to publish.

## Architecture

`index.html` is a **single-page scroll site** with four sections — `#home`, `#portfolio`, `#blog`, `#research` — plus a fixed `nav`. Each area has matching `css/<name>.css` and `js/<name>.js`. The design system lives in `css/tokens.css` (palette, fonts, fluid type scale, motion primitives); fonts are Fraunces (display serif), Inter (body), JetBrains Mono (accents).

Content is **data-driven** — edit the arrays/strings at the top of the JS, not the HTML:

- **Research** (`js/research.js`): editorial list, grouped by sub-heading; entries are HTML strings.
- **Blog/projects** (`js/blog.js`): a fake VS-Code "editor window"; the file-tree content links to PDFs in `assets/blogs/`.
- **Portfolio** (`js/photos.js` + `js/portfolio.js`): `photos.js` holds the `TRIPS` manifest (one object per trip: `{id, location, date, cover, photos[]}`, newest-first, cover pinned first). `portfolio.js` builds the hover-expand timeline, the slide-in per-trip gallery subpage, and the single-photo lightbox. Each photo has a `assets/photos/<id>/thumb/<f>` (grid/preview) and full-res `assets/photos/<id>/<f>` (lightbox only).
- **Home** (`js/bunny.js` + inline script in `index.html`): `bunny.js` holds the `BUNNY` point cloud; the hero canvas animates a diffusion-style scatter/reform of it.
- `js/main.js`: nav active-state, scroll-reveal (IntersectionObserver), hash routing.

## Assets

`assets/` holds all binary assets and is kept out of Prettier's scope: `icon.jpg` (favicon), `docs/*.pdf` (CV/SOP), `blogs/*.pdf`, and `photos/<trip>/` (web WebP + `thumb/` subfolder).

Photos: convert originals to WebP with ImageMagick (`magick -auto-orient -quality 90`), then generate ~1000px thumbnails into each trip's `thumb/` (`magick in.webp -resize '1000x1000>' -quality 80 thumb/in.webp`). Full-res originals are kept locally in `assets/temp/`, which is git-ignored (not shipped).

## Conventions

- `README.txt` tracks a running todo/ideas list for the site.
