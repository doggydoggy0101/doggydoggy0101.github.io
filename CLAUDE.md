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

`index.html` holds four one-screen sections — `#about`, `#portfolio`, `#blog`, `#research` — inside `<main class="pages">`, plus a fixed `nav`. On wide screens (≥861px) `js/pager.js` + `css/pager.css` lay them out side by side in a horizontal scroller: the mouse wheel glides it sideways (scaled so one screen-height of scrolling ≈ one page, no snapping), trackpad swipes scroll it natively, nav links and arrow/Page/Home/End keys glide to a page, the URL hash tracks the nearest page, and a `pagechange` event drives the nav underline in `js/main.js`. Below that (or without JS) it's an ordinary vertical scroll. Each area has matching `css/<name>.css` and `js/<name>.js`. The design system lives in `css/tokens.css` (palette, fonts, fluid type scale, easing curves); fonts are IBM Plex Sans (display + body) and IBM Plex Mono (accents); the palette is neutral white/graphite with a single IBM-blue accent, kept to a few tokens so a dark mode can swap them.

Content is **data-driven** — edit the arrays/strings at the top of the JS, not the HTML:

- **Research** (`js/research.js`): headed "Publications", a ledger list (short venue label · title / authors / journal line · links), newest first; each entry is plain fields (`title`, `authors`, `venue`, `short`, `details`, `year`, `links`) and `ME` is bolded in the author list automatically. The `awards` and `presentations` arrays are kept but not rendered for now. If the list outgrows one screen, the page scrolls inside itself.
- **Blog/projects** (`js/blog.js`): a fake VS-Code "editor window"; the file-tree content links to PDFs in `assets/blogs/`.
- **Portfolio** (`js/photos.js` + `js/portfolio.js`): `photos.js` holds the `TRIPS` manifest (one object per trip: `{id, location, date, cover, photos[]}`, newest-first, cover pinned first). `portfolio.js` builds the hover-expand timeline, the slide-in per-trip gallery subpage, and the single-photo lightbox. Each photo has a `assets/photos/<id>/thumb/<f>` (grid/preview) and full-res `assets/photos/<id>/<f>` (lightbox only).
- **About** (`css/home.css` + `js/home.js`; markup in `index.html`): three columns — name (Bang-Shien ⇄ Ian typewriter in `js/main.js`), plain-text email, CV button with its "Updated" date, and Scholar/GitHub/YouTube links | portrait `assets/profile/001.jpg` | one about paragraph. The CV button is the layout's reference line: `js/home.js` shifts the left column so the button sits at the photo's vertical centre, shifts the paragraph so its first line sits level with the button's label, and drifts the background dot grid at 3.5% of scroll speed (masked clear in the centre). The old point-cloud hero (`js/bunny.js`, `js/m3500.js`) is no longer loaded.
- `js/main.js`: nav active-state + sliding underline, and the Bang-Shien ⇄ Ian typewriter.

## Assets

`assets/` holds all binary assets and is kept out of Prettier's scope: `icon.jpg` (favicon), `docs/*.pdf` (CV/SOP), `profile/001.jpg` (hero portrait, 1200×1800 JPEG), `blogs/*.pdf`, and `photos/<trip>/` (web WebP + `thumb/` subfolder).

Photos: convert originals to WebP with ImageMagick (`magick -auto-orient -quality 90`), then generate ~1000px thumbnails into each trip's `thumb/` (`magick in.webp -resize '1000x1000>' -quality 80 thumb/in.webp`). Full-res originals are kept locally in `assets/temp/`, which is git-ignored (not shipped).

## Conventions

- `README.txt` tracks a running todo/ideas list for the site.
