# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Bang-Shien Chen's personal academic website, served as a static site via GitHub Pages at https://dgbshien.com/ (domain set by `CNAME`). There is no build step, bundler, or package manager — `index.html` is the single page and loads CSS/JS directly. All third-party libraries (GSAP + ScrollTrigger, Lenis, Typed.js, jQuery) are pulled from CDNs; only `lightbox2` is vendored as a git submodule.

## Commands

- **Run locally**: open `index.html` in a browser, or serve the folder (e.g. `python3 -m http.server`) so relative `docs/`, `css/`, `js/` paths resolve.
- **Format** (the only CI check, runs Prettier on PRs/pushes to `main`): `prettier . --check` to verify, `prettier . --write` to fix. `lightbox2/` and `docs/` are excluded via `.prettierignore`.
- **Submodule**: after a fresh clone run `git submodule update --init` to populate `lightbox2/`.

## Branching

Work happens on `develop`; `main` is the deployed branch (GitHub Pages + the format CI both key off `main`). PR `develop` → `main` to publish.

## Architecture

`index.html` defines the page as a sequence of `<section>` elements (`#intro`, `#portfolio`, `#gallery`, `#projects`, `#research`) plus a `#loading-screen` and `#navbar`. Each section has a matching `css/<name>.css` and `js/<name>.js`. Most sections are **data-driven**: the HTML ships near-empty container elements (e.g. `<ol id="publications-list">`) and the JS injects content on `DOMContentLoaded`.

To edit site content you edit the data arrays/calls in JS, not the HTML:

- **Research** (`js/research.js`): edit the `publications`, `awards`, and `presentations` arrays. Entries are objects with HTML strings (`<b>`, `<i>` inline) and link lists.
- **Projects/blogs** (`js/projects.js`): edit the `projects` array; each entry is a "file" card whose `content` is an HTML string linking to PDFs in `docs/blogs/`.
- **Gallery** (`js/gallery.js`): edit the `generateGalleryRow([...ids], rowId)` calls (look for the `//! maintain gallery here` marker). Each id `N` maps to a full-res `docs/gallery/N.webp` (lightbox target) and a compressed `docs/gallery-compress/N.jpg` (thumbnail) — add both files when adding an id.
- `js/script.js` drives the loading screen and global scroll setup; `js/portfolio.js` handles intro/portfolio GSAP scroll animations.

Animation throughout uses GSAP `ScrollTrigger`; smooth scrolling uses Lenis. The loading screen waits on `docs/images/background.webp` to load before revealing the page.

## Assets

`docs/` holds all binary assets (`blogs/` PDFs, `gallery/` + `gallery-compress/` images, `images/`, `files/`, `fonts/`). Gallery thumbnails are JPGs converted from WebP (see `README.txt` for the conversion tool). Keep `docs/` out of Prettier's scope.

## Conventions

- Code in this repo uses `//!` for maintenance-point markers (e.g. the gallery list) — search these when looking for the spot to edit content.
- `README.txt` tracks a running todo/ideas list for the site.
