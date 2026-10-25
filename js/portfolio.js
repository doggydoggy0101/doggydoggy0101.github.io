// Portfolio — photo grid → slide-up trip gallery → single-photo lightbox
(function () {
  if (typeof TRIPS === "undefined") return;
  const root = document.documentElement;
  const thumb = (id, f) => `assets/photos/${id}/thumb/${f}`; // small: grid + gallery
  const full = (id, f) => `assets/photos/${id}/${f}`; // full-res: lightbox only

  // ---- photo grid (the Portfolio page): a grid that fills the page — 3
  // rows splitting the height evenly, and as many columns as fit across at
  // about-square cells. Each photo is whole (never cropped), as big as fits
  // in its cell, but with width + height capped (SUM) so squares don't loom
  // over wide shots. Narrow screens: 2 square cells across, scrolling. Uses
  // the first (columns × 3) PICKS. The title — a camera-aperture icon —
  // takes the dead centre: the middle cell of the middle row (two cells with
  // an even column count), and opens the trip gallery; on narrow screens it
  // heads the grid. ----
  const pfGrid = document.getElementById("pfGrid");
  if (pfGrid && typeof PICKS !== "undefined") {
    const byId = Object.fromEntries(TRIPS.map((t) => [t.id, t]));
    // "202601-Tokyo/011.webp" (or ".../011") → trip + file; unknown trips
    // are skipped
    const picks = PICKS.map((p) => p.split("/"))
      .filter(([id, f]) => byId[id] && f)
      .map(([id, f]) => ({
        t: byId[id],
        src: thumb(id, /\.\w+$/.test(f) ? f : f + ".webp"),
        ratio: 1.5, // width / height, replaced once the image loads
      }));
    const ROWS = 3;
    // width + height cap, in units of the cell's shorter side: a 3:2 photo
    // (1 + 2/3) just fills its cell; a square is held to 0.85 of it
    const SUM = 1.7;
    const narrow = matchMedia("(max-width: 860px)");

    // the title: a line-drawn lens aperture that opens the gallery at the
    // newest trip (its list has the rest). Six blades, each a line tangent to
    // the opening (radius r) from its hexagon corner out to the rim (R = 10):
    // small r nearly shut, large r wide open. Hover (or keyboard focus) opens
    // it — the opening is tweened here, the blades' turn is CSS.
    const IRIS = { shut: 3, open: 7.4, ms: 450 };
    const irisPath = (r) => {
      const R = 10;
      const t0 = -r * Math.tan(Math.PI / 6); // back to the hexagon corner
      const t1 = Math.sqrt(R * R - r * r); // out to the rim
      let d = "";
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3 - Math.PI / 2;
        const [px, py] = [12 + r * Math.cos(a), 12 + r * Math.sin(a)];
        const [dx, dy] = [-Math.sin(a), Math.cos(a)];
        const pt = (t) =>
          `${(px + t * dx).toFixed(2)} ${(py + t * dy).toFixed(2)}`;
        d += `M${pt(t0)}L${pt(t1)}`;
      }
      return d;
    };
    const title = document.createElement("a");
    title.className = "pf-title";
    title.href = "#t/" + TRIPS[0].id;
    title.setAttribute("aria-label", "Photography");
    title.innerHTML = `<svg class="pf-iris" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><g><path d="${irisPath(IRIS.shut)}"/></g></svg>`;
    const blades = title.querySelector("path");
    let irisR = IRIS.shut;
    let irisRaf = 0;
    const irisTo = (target) => {
      cancelAnimationFrame(irisRaf);
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const from = irisR;
      const t0 = performance.now();
      const step = (now) => {
        const k = reduce ? 1 : Math.min(1, (now - t0) / IRIS.ms);
        irisR = from + (target - from) * (1 - (1 - k) ** 3); // ease-out
        blades.setAttribute("d", irisPath(irisR));
        if (k < 1) irisRaf = requestAnimationFrame(step);
      };
      irisRaf = requestAnimationFrame(step);
    };
    const open = () => irisTo(IRIS.open);
    const shut = () => irisTo(IRIS.shut);
    title.addEventListener("mouseenter", open);
    title.addEventListener("focus", open);
    title.addEventListener("mouseleave", shut);
    title.addEventListener("blur", shut);
    let relayout = 0;
    let placed = []; // the cells on the page now (layout())
    // one cell > tile (hover) > img per pick, built once and placed in the
    // grid by layout(); a pick that doesn't fit stays out of the page
    const cells = picks.map((p, i) => {
      const cell = document.createElement("div");
      cell.className = "pf-cell";
      cell.innerHTML = `<button class="pf-tile" data-i="${i}">
        <img src="${p.src}" alt="${p.t.location}, ${p.t.date}" />
        <span class="pf-cap">${p.t.location} · ${p.t.date}</span>
      </button>`;
      const im = cell.querySelector("img");
      const set = () => {
        const r = im.naturalWidth / im.naturalHeight;
        if (!r || r === p.ratio) return;
        p.ratio = r; // real shape known → redo the layout (once/frame)
        if (!relayout)
          relayout = requestAnimationFrame(() => {
            relayout = 0;
            layout();
          });
      };
      if (im.complete) set();
      else im.addEventListener("load", set);
      return cell;
    });

    function layout() {
      const W = pfGrid.clientWidth;
      const g = parseFloat(getComputedStyle(pfGrid).columnGap) || 0;
      let ch, n, cols;
      if (narrow.matches) {
        cols = 2;
        ch = (W - g) / 2;
        n = picks.length;
      } else {
        ch = (pfGrid.clientHeight - g * (ROWS - 1)) / ROWS;
        // the column count whose cells come closest to square
        const lo = Math.max(1, Math.floor((W + g) / (ch + g)));
        const off = (c) => Math.abs(Math.log((W - g * (c - 1)) / c / ch));
        cols = off(lo) <= off(lo + 1) ? lo : lo + 1;
        n = cols * ROWS - (cols % 2 ? 1 : 2); // less the title's cells
      }
      const cw = (W - g * (cols - 1)) / cols;
      if (!(cw > 0 && ch > 0)) return;
      pfGrid.style.gridTemplateColumns = `repeat(${cols}, ${cw}px)`;
      pfGrid.style.gridAutoRows = `${ch}px`;
      // title: centred cell(s) of row 2; photos auto-flow around it
      const span = narrow.matches ? cols : cols % 2 ? 1 : 2;
      pfGrid.style.gridTemplateRows = narrow.matches ? "auto" : "";
      title.style.gridRow = narrow.matches ? "1" : "2";
      title.style.gridColumn = `${(cols - span) / 2 + 1} / span ${span}`;
      placed = cells.slice(0, n);
      placed.forEach((cell, i) => {
        // the photo whole, as big as fits in a cw × ch cell and the SUM cap
        const r = picks[i].ratio;
        const cap = (SUM * Math.min(cw, ch) * r) / (1 + r); // w where w + h = cap
        const w = Math.min(cw, ch * r, cap);
        cell.firstElementChild.style.width = `${w}px`;
        cell.firstElementChild.style.height = `${w / r}px`;
      });
      pfGrid.replaceChildren(title, ...placed);
      unveil();
    }

    // photo unveil: as the Portfolio page slides in, each photo opens top →
    // bottom and settles from a slight zoom; as it slides out, they close
    // again — tied to the scroll position, so it plays both ways. The
    // columns on the side the page comes in from open first (left ones when
    // arriving from About, right ones when coming back from Blog). Only with
    // the side-by-side pages, and off for reduced motion.
    const stage = document.getElementById("pages");
    const section = document.getElementById("portfolio");
    const STAGGER = 0.45; // share of the approach between first and last column
    const smooth = (t) => t * t * (3 - 2 * t);
    function unveil() {
      const on =
        root.classList.contains("paged") &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches;
      const d = on
        ? (section.offsetLeft - stage.scrollLeft) / stage.clientWidth
        : 0; // 0 centred, ±1 a page away
      const near = 1 - Math.min(1, Math.abs(d));
      const xs = placed.map((c) => c.offsetLeft);
      const lo = Math.min(...xs);
      const hi = Math.max(...xs);
      placed.forEach((c, k) => {
        const tile = c.firstElementChild;
        let o = 1; // 0 shut … 1 open
        if (on) {
          const u = hi > lo ? (xs[k] - lo) / (hi - lo) : 0.5; // 0 left … 1 right
          const lead = (d >= 0 ? u : 1 - u) * STAGGER; // leading side first
          o = smooth(Math.max(0, Math.min(1, (near - lead) / (1 - STAGGER))));
        }
        tile.style.clipPath =
          o >= 1 ? "" : `inset(0 0 ${((1 - o) * 100).toFixed(2)}% 0)`;
        tile.firstElementChild.style.transform =
          o >= 1 ? "" : `scale(${(1 + 0.08 * (1 - o)).toFixed(4)})`;
      });
    }
    document.addEventListener("pagescroll", unveil);
    pfGrid.addEventListener("click", (e) => {
      const b = e.target.closest(".pf-tile");
      if (b) location.hash = "t/" + picks[+b.dataset.i].t.id;
    });
    window.addEventListener("resize", layout);
    narrow.addEventListener("change", layout);
    layout();
  }

  // ---- subpage (full trip gallery, a sheet that slides up) ----
  const subMain = document.querySelector(".sub-main");
  const subLoc = document.getElementById("subLoc");
  const subMeta = document.getElementById("subMeta");
  const subGrid = document.getElementById("subGrid");

  // build the left trip menu once
  const subTripList = document.getElementById("subTripList");
  TRIPS.forEach((t) => {
    const li = document.createElement("li");
    li.dataset.id = t.id;
    li.innerHTML = `<span class="l">${t.location}</span><span class="d">${t.date}</span>`;
    li.addEventListener("click", () => (location.hash = "t/" + t.id));
    subTripList.appendChild(li);
  });

  // gallery: photos go in order, each into whichever column is shortest
  // (left, right, left, right … as heights allow), so the columns grow
  // together instead of the left filling before the right. All thumbs load
  // at once; each is placed as soon as it and the ones before it are ready.
  let galleryRun = 0; // bumped per trip, so a stale fill stops
  let galleryCols = []; // column elements
  let placedFigs = []; // figures placed so far, in order
  // columns: as many as fit at --col-min wide, up to --cols-max
  const colCount = () => {
    const cs = getComputedStyle(subGrid);
    const max = parseInt(cs.getPropertyValue("--cols-max")) || 3;
    const px = parseFloat(getComputedStyle(root).fontSize);
    const min = parseFloat(cs.getPropertyValue("--col-min")) * px || 256;
    const g = parseFloat(cs.columnGap) || 0;
    const fit = Math.floor((subGrid.clientWidth + g) / (min + g));
    return Math.max(1, Math.min(max, fit));
  };
  const makeCols = () => {
    galleryCols = Array.from({ length: colCount() }, () => {
      const c = document.createElement("div");
      c.className = "sub-col";
      return c;
    });
    subGrid.replaceChildren(...galleryCols);
  };
  const shortest = () =>
    galleryCols.reduce((a, b) => (b.offsetHeight < a.offsetHeight ? b : a));
  async function fillGallery(t, ti) {
    const run = ++galleryRun;
    placedFigs = [];
    makeCols();
    const figs = t.photos.map((f, pi) => {
      const fig = document.createElement("figure");
      fig.className = "ph";
      const img = new Image();
      img.alt = "";
      const ready = new Promise((ok) => {
        img.onload = img.onerror = ok;
      });
      img.src = thumb(t.id, f);
      fig.appendChild(img);
      fig.addEventListener("click", () => openLB(ti, pi));
      return { fig, ready };
    });
    for (const { fig, ready } of figs) {
      await ready;
      if (run !== galleryRun) return; // another trip was opened meanwhile
      shortest().appendChild(fig);
      placedFigs.push(fig);
    }
  }
  // re-deal the placed photos if the column count changes (phone ↔ desktop)
  window.addEventListener("resize", () => {
    if (!galleryCols.length || colCount() === galleryCols.length) return;
    makeCols();
    placedFigs.forEach((fig) => shortest().appendChild(fig));
  });

  function showTrip(id) {
    const ti = TRIPS.findIndex((x) => x.id === id);
    if (ti < 0) return showGrid();
    const t = TRIPS[ti];
    subLoc.textContent = t.location;
    subMeta.textContent = `${t.date} · ${t.photos.length} photos`;
    subTripList
      .querySelectorAll("li")
      .forEach((li) => li.classList.toggle("active", li.dataset.id === id));
    fillGallery(t, ti);
    root.dataset.view = "trip";
    document.body.style.overflow = "hidden";
    if (subMain) {
      subMain.scrollTop = 0;
      subMain.classList.remove("swap");
      void subMain.offsetWidth; // restart the fade-up
      subMain.classList.add("swap");
    }
  }
  function showGrid() {
    root.dataset.view = "grid";
    document.body.style.overflow = "";
  }
  // close the sheet: a click on the dimmed page above it (or Esc, below)
  const close = () => (location.hash = "portfolio");
  document.getElementById("subBackdrop").addEventListener("click", close);
  function route() {
    const m = location.hash.match(/^#t\/(.+)$/);
    if (m) showTrip(decodeURIComponent(m[1]));
    else showGrid();
  }
  window.addEventListener("hashchange", route);
  route();

  // ---- lightbox (single photo, no caption) ----
  const lb = document.getElementById("lb");
  const lbImg = document.getElementById("lbImg");
  function openLB(ti, pi) {
    const t = TRIPS[ti];
    lbImg.classList.remove("ready"); // hide until the new full-res decodes
    lbImg.onload = () => lbImg.classList.add("ready");
    lbImg.src = full(t.id, t.photos[pi]); // full-res only on click
    lb.classList.add("open");
  }
  const closeLB = () => {
    lb.classList.remove("open"); // fade the overlay out
    lbImg.classList.remove("ready");
    // clear src only after the fade-out, so the image doesn't vanish mid-animation
    // (and not at all if it was reopened in the meantime)
    setTimeout(() => {
      if (!lb.classList.contains("open")) lbImg.removeAttribute("src");
    }, 300);
  };
  document.getElementById("lbClose").onclick = closeLB;
  lb.addEventListener("click", closeLB);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (lb.classList.contains("open")) closeLB();
    else if (root.dataset.view === "trip") location.hash = "portfolio";
  });
})();
