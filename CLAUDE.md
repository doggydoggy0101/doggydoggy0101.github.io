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

`index.html` holds four one-screen sections — `#about`, `#portfolio`, `#blog`, `#research` — inside `<main class="pages">`, plus a fixed `nav`. On wide screens (≥1100px — the same point where About stacks into one column) `js/pager.js` + `css/pager.css` lay them out side by side in a horizontal scroller: the mouse wheel glides it sideways (scaled so one screen-height of scrolling ≈ one page, no snapping), trackpad swipes scroll it natively, nav links and arrow/Page/Home/End keys glide to a page, the URL hash tracks the nearest page, and a `pagechange` event drives the nav underline in `js/main.js`. While the pages slide, a page's content leads it toward the screen centre (parallax, clipped to its own page) by its section's `data-parallax` in `index.html` — Portfolio 0.2, About, Blog and Research 0.1 of a page — so pages close up on their neighbours; a page at rest is left untransformed. Below that (or without JS) it's an ordinary vertical scroll. Each area has matching `css/<name>.css` and `js/<name>.js`. The design system lives in `css/tokens.css` (palette, fonts, fluid type scale, easing curves); fonts are IBM Plex Sans (display + body) and IBM Plex Mono (accents); the palette is neutral white/graphite with a single cerulean-blue accent (#2c92b8), kept to a few tokens so a dark mode can swap them.

Content is **data-driven** — edit the arrays/strings at the top of the JS, not the HTML:

- **Research** (`js/research.js`): headed "Publications", a ledger list (short venue label · title / authors / journal line · links), newest first; each entry is plain fields (`title`, `authors`, `venue`, `short`, `details`, `year`, `links`) and `ME` is bolded in the author list automatically. The `awards` and `presentations` arrays are kept but not rendered for now. If the list outgrows one screen, the page scrolls inside itself — the pager slides it fully into place first, then the wheel carries on down the list (and back up it before sliding back to Blog).
- **Blog/projects** (`js/blog.js`): a fake VS-Code "editor window"; the file-tree content links to PDFs in `assets/blogs/`.
- **Portfolio** (`js/photos.js` + `js/portfolio.js`): `photos.js` holds the `TRIPS` manifest (one object per trip: `{id, location, month, year, date, label, photos[]}`, newest trip first, photos oldest → newest) and `PICKS`, the grid's top picks as `"<trip folder>/<photo>"` strings. `portfolio.js` builds the page as a full-page grid: 3 equal rows and as many about-square columns as fit (any count, chosen from the window width), each photo whole (never cropped) inside its cell with width + height capped (`SUM`) so squares don't loom over wide shots; hover enlarges a photo slightly and shows its trip. The title is a line-drawn lens aperture (built in `portfolio.js`; its six blades are computed, so hover tweens the iris open while CSS turns the blades) in the centre cell(s) of the middle row, linking to the newest trip. As the page slides in or out, a scroll-linked "unveil" opens each grid photo top → bottom (the columns on the side it enters from first) and closes it again, both ways. Clicking a photo opens its trip's gallery: a bottom sheet that slides up over the page and leaves a dimmed strip on top (clicking that strip or Esc closes it), with the trip list on its left and the photos in up to 3 centred columns (as many as fit), each placed in order into the shortest column; clicking a gallery photo opens the single-photo lightbox. When the site scrolls vertically (below 1100px) the grid drops the title and shows just the first 8 picks in two columns (4 in one column on a phone). Each photo has `assets/photos/<id>/thumb/<f>` (grid + gallery) and the full-size `assets/photos/<id>/<f>` (lightbox only).
- **About** (`css/home.css` + `js/home.js`; markup in `index.html`): three columns — name (Bang-Shien ⇄ Ian typewriter in `js/main.js`), plain-text email, CV button with its "Updated" date, and Scholar/GitHub/YouTube links | portrait `assets/profile/001.webp` | one about paragraph; below 1100px it stacks to one column (name, then paragraph) and drops the portrait. The CV button is the layout's reference line: `js/home.js` shifts the left column so the button sits at the photo's vertical centre, shifts the paragraph so its first line sits level with the button's label, and drifts the background dot grid at 3.5% of scroll speed (masked clear in the centre). The old point-cloud hero (`js/bunny.js`, `js/m3500.js`) is no longer loaded.
- `js/main.js`: nav active-state + sliding underline, and the Bang-Shien ⇄ Ian typewriter.

## Assets

`assets/` holds all binary assets and is kept out of Prettier's scope: `icon.jpg` (favicon), `docs/*.pdf` (CV/SOP), `profile/001.webp` (hero portrait, 1200×1800), `blogs/*.pdf`, and `photos/<trip>/` (web WebP + `thumb/` subfolder).

Photos: originals live in `assets/temp/` (git-ignored, not shipped): `temp/photo/<trip>/NNN.jpg`, numbered in the order taken (EXIF date; `rename-map.csv` keeps the camera filenames), and `temp/profile/`. Convert each with ImageMagick, stripping metadata (GPS included): full `magick in.jpg -auto-orient -strip -resize '2560x2560>' -quality 85 photos/<trip>/NNN.webp`, then thumb `magick photos/<trip>/NNN.webp -resize '1000x1000>' -quality 80 photos/<trip>/thumb/NNN.webp`. The portrait is `magick temp/profile/001.jpg -auto-orient -strip -resize '1200x1800>' -quality 85 profile/001.webp`.

## Conventions

- `README.txt` tracks a running todo/ideas list for the site.
