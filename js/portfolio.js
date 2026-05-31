// Portfolio — hover-expand timeline → slide-up trip gallery → single-photo lightbox
(function () {
  if (typeof TRIPS === "undefined") return;
  const root = document.documentElement;
  const thumb = (id, f) => `assets/photos/${id}/thumb/${f}`; // small: grid + preview
  const full = (id, f) => `assets/photos/${id}/${f}`; // full-res: lightbox only

  // ---- timeline (left: hover to expand · right: synced preview) ----
  const tlList = document.getElementById("tlList");
  const tlPreview = document.getElementById("tlPreview");
  const items = [];
  let activeT = -1;
  // size the preview so (width + height) stays ~constant → consistent visual size
  // across portrait/landscape, instead of capping width or height independently.
  let curNat = null; // natural {w,h} of the current preview (for re-fit on resize)
  function fitPreview() {
    if (!curNat) return;
    const r = curNat.w / curNat.h;
    const px = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const box = tlPreview.parentElement;
    const tl2 = box.closest(".tl2");
    // region the preview lives in: section's left edge → just before the timeline
    const regionLeft = tl2.getBoundingClientRect().left;
    const regionRight = tlList.getBoundingClientRect().left - 2 * px;
    const regionW = Math.max(8 * px, regionRight - regionLeft);
    const K = 40 * px; // target width + height
    let h = K / (1 + r),
      w = r * h;
    const capSc = Math.min(1, (40 * px) / w, (30 * px) / h); // full size (caps only)
    const sc = Math.min(capSc, regionW / w); // also fit within the region
    const fw = w * sc,
      fh = h * sc;
    box.style.width = fw + "px";
    box.style.height = fh + "px";
    box.style.marginLeft = Math.max(0, (regionW - fw) * 0.3) + "px"; // biased left of center
    // hide (rather than show shrunk) once the region can't fit the full size;
    // visibility (not display) keeps the grid slot so the timeline stays put
    box.classList.toggle("tl-preview--off", regionW < w * capSc - 1);
  }
  window.addEventListener("resize", fitPreview);
  function setActive(i) {
    if (i === activeT) return;
    activeT = i;
    items.forEach((el, k) => el.classList.toggle("active", k === i));
    const t = TRIPS[i];
    const s = thumb(t.id, t.cover || t.photos[0]);
    const pre = new Image();
    pre.onload = () => {
      tlPreview.src = s; // old stays until new is ready → no blank gap
      curNat = { w: pre.naturalWidth, h: pre.naturalHeight };
      fitPreview();
      tlPreview.classList.remove("in");
      void tlPreview.offsetWidth; // restart the animation
      tlPreview.classList.add("in");
    };
    pre.src = s;
  }
  TRIPS.forEach((t, i) => {
    const detail =
      (t.month ? `<span class="d">${t.month}</span> · ` : "") +
      `${t.photos.length} photos`;
    const el = document.createElement("div");
    el.className = "tl-item";
    el.innerHTML = `
      <div class="tl-body">
        <div class="tl-loc">${t.location}</div>
        <div class="tl-detail">${detail}</div>
      </div>`;
    el.addEventListener("mouseenter", () => setActive(i));
    el.addEventListener("click", () => (location.hash = "t/" + t.id));
    items.push(el);
    tlList.appendChild(el);
    // year divider on the left when the next trip is an earlier year
    const next = TRIPS[i + 1];
    if (next && next.year !== t.year) {
      const div = document.createElement("div");
      div.className = "tl-div";
      div.innerHTML = `<span class="y">${t.year}</span><span class="ln"></span>`;
      tlList.appendChild(div);
    }
  });
  setActive(0);
  tlPreview.parentElement.addEventListener("click", () => {
    if (activeT >= 0) location.hash = "t/" + TRIPS[activeT].id;
  });

  // ---- subpage (full trip gallery, slides in from the right) ----
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

  // cursor-trailing spotlight engine — shared by gallery cells + the timeline preview
  // (echoes the hero point-cloud emphasis: target follows the cursor, position eases in)
  const Spotlight = (() => {
    let cell = null,
      tx = 50,
      ty = 50,
      cx = 50,
      cy = 50,
      raf = 0;
    const run = () => {
      cx += (tx - cx) * 0.16; // ease toward the cursor for a fluid lag
      cy += (ty - cy) * 0.16;
      if (cell) {
        cell.style.setProperty("--mx", cx.toFixed(1) + "%");
        cell.style.setProperty("--my", cy.toFixed(1) + "%");
      }
      raf =
        Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1
          ? requestAnimationFrame(run)
          : 0;
    };
    return {
      move(c, e) {
        if (!c) return this.leave();
        const r = c.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width) * 100;
        ty = ((e.clientY - r.top) / r.height) * 100;
        if (c !== cell) {
          if (cell) cell.classList.remove("lit");
          cell = c;
          cell.classList.add("lit");
          cx = tx; // jump to the entry point (no trail across the gap)
          cy = ty;
        }
        if (!raf) raf = requestAnimationFrame(run);
      },
      leave() {
        if (cell) cell.classList.remove("lit");
        cell = null;
      },
    };
  })();
  // gallery grid (delegated — cells are rebuilt per trip)
  subGrid.addEventListener("pointermove", (e) =>
    Spotlight.move(e.target.closest(".ph"), e),
  );
  subGrid.addEventListener("pointerleave", () => Spotlight.leave());
  // timeline preview (single persistent element)
  const tlPrevWrap = tlPreview.parentElement;
  tlPrevWrap.addEventListener("pointermove", (e) =>
    Spotlight.move(tlPrevWrap, e),
  );
  tlPrevWrap.addEventListener("pointerleave", () => Spotlight.leave());

  function showTrip(id) {
    const ti = TRIPS.findIndex((x) => x.id === id);
    if (ti < 0) return showTimeline();
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
  function showTimeline() {
    root.dataset.view = "timeline";
    document.body.style.overflow = "";
  }
  document
    .getElementById("subBack")
    .addEventListener("click", () => (location.hash = "portfolio"));
  function route() {
    const m = location.hash.match(/^#t\/(.+)$/);
    if (m) showTrip(decodeURIComponent(m[1]));
    else showTimeline();
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
