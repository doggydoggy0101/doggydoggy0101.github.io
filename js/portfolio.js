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
  // the first (columns × 3) PICKS. The "Photography" title takes the dead
  // centre: the middle cell of the middle row (two cells with an even column
  // count), and opens the trip gallery; on narrow screens it heads the
  // grid. ----
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

    // the title opens the gallery at the newest trip (its list has the rest)
    const title = document.createElement("a");
    title.className = "pf-title";
    title.href = "#t/" + TRIPS[0].id;
    title.textContent = "Photography";
    let relayout = 0;
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
      const placed = cells.slice(0, n);
      placed.forEach((cell, i) => {
        // the photo whole, as big as fits in a cw × ch cell and the SUM cap
        const r = picks[i].ratio;
        const cap = (SUM * Math.min(cw, ch) * r) / (1 + r); // w where w + h = cap
        const w = Math.min(cw, ch * r, cap);
        cell.firstElementChild.style.width = `${w}px`;
        cell.firstElementChild.style.height = `${w / r}px`;
      });
      pfGrid.replaceChildren(title, ...placed);
    }
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

  function showTrip(id) {
    const ti = TRIPS.findIndex((x) => x.id === id);
    if (ti < 0) return showGrid();
    const t = TRIPS[ti];
    subLoc.textContent = t.location;
    subMeta.textContent = `${t.date} · ${t.photos.length} photos`;
    subTripList
      .querySelectorAll("li")
      .forEach((li) => li.classList.toggle("active", li.dataset.id === id));
    subGrid.innerHTML = "";
    t.photos.forEach((f, pi) => {
      const fig = document.createElement("figure");
      fig.className = "ph";
      const img = new Image();
      img.src = thumb(t.id, f);
      img.loading = "lazy";
      img.alt = "";
      fig.appendChild(img);
      fig.addEventListener("click", () => openLB(ti, pi));
      subGrid.appendChild(fig);
    });
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
  // close the sheet: ← back, or a click on the dimmed page above it
  const close = () => (location.hash = "portfolio");
  document.getElementById("subBack").addEventListener("click", close);
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
