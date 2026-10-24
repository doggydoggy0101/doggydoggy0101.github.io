// Pager — on wide screens the four sections sit side by side in a horizontal
// scroller (About … Research). The mouse wheel scrolls it sideways with an
// eased glide, trackpad swipes scroll it natively, and the nav, arrow / Page
// / Home / End keys glide to a page. No snapping: it rests wherever you stop.
// Below 861px (or without JS) the site scrolls vertically as before.
// Fires "pagechange" ({detail: {id}}, the nearest page) and "pagescroll"
// ({detail: {from, to, t}}, the exact position) that main.js uses for the nav.
(function () {
  const root = document.documentElement;
  const stage = document.getElementById("pages");
  if (!stage) return;
  const pages = [...stage.children].filter((el) => el.tagName === "SECTION");
  const N = pages.length;
  const dots = document.getElementById("dots");
  const wide = window.matchMedia("(min-width: 861px)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const DOT_DRIFT = 0.035; // dots slide 3.5% of the distance scrolled
  const EASE = 0.14; // share of the remaining distance covered each frame

  const paged = () => root.classList.contains("paged");
  const indexOf = (id) => pages.findIndex((p) => p.id === id);
  const width = () => stage.clientWidth;
  const maxX = () => stage.scrollWidth - stage.clientWidth;
  const overlayOpen = () =>
    root.dataset.view === "trip" ||
    !!document.querySelector(".lb.open, .blog-stage.max");

  // ---- eased glide toward a target scroll position ----
  let target = 0;
  let raf = 0;
  const setX = (x) => stage.scrollTo({ left: x, behavior: "instant" });
  function glide() {
    const x = stage.scrollLeft;
    const d = target - x;
    if (Math.abs(d) < 0.5 || reduce.matches) {
      setX(target);
      raf = 0;
      return;
    }
    setX(x + d * EASE);
    raf = requestAnimationFrame(glide);
  }
  function glideTo(x) {
    target = Math.max(0, Math.min(maxX(), x));
    if (!raf) raf = requestAnimationFrame(glide);
  }
  const goPage = (i) => glideTo(Math.max(0, Math.min(N - 1, i)) * width());

  // ---- scroll position → nav underline, dots; nearest page → hash, nav ----
  let cur = -1;
  function onScroll() {
    if (!raf) target = stage.scrollLeft; // a native (trackpad) scroll moved it
    dots.style.backgroundPositionX = `${-stage.scrollLeft * DOT_DRIFT}px`;
    // where we are between two pages (t = 0…1), for the underline to follow
    const at = Math.max(0, Math.min(N - 1, stage.scrollLeft / width()));
    const a = Math.floor(at);
    const b = Math.min(N - 1, a + 1);
    document.dispatchEvent(
      new CustomEvent("pagescroll", {
        detail: { from: pages[a].id, to: pages[b].id, t: at - a },
      }),
    );
    const i = Math.round(stage.scrollLeft / width());
    if (i === cur) return;
    cur = i;
    // keep a bare URL on first load of About; otherwise track the page
    if ((location.hash || cur > 0) && !location.hash.startsWith("#t/"))
      history.replaceState(null, "", "#" + pages[cur].id);
    document.dispatchEvent(
      new CustomEvent("pagechange", { detail: { id: pages[cur].id } }),
    );
  }
  stage.addEventListener("scroll", onScroll, { passive: true });

  // ---- input ----
  // a vertical scroll inside an element that can still scroll (a long page,
  // the blog editor) belongs to that element, not to the pager
  const scrollsInside = (el, dy) => {
    for (; el && el !== stage; el = el.parentElement) {
      const oy = getComputedStyle(el).overflowY;
      if (!/(auto|scroll)/.test(oy) || el.scrollHeight <= el.clientHeight + 1)
        continue;
      if (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1)
        return true;
      if (dy < 0 && el.scrollTop > 0) return true;
    }
    return false;
  };

  // vertical wheel → sideways glide; sideways trackpad swipes stay native
  window.addEventListener(
    "wheel",
    (e) => {
      if (!paged() || overlayOpen() || e.ctrlKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (scrollsInside(e.target, e.deltaY)) return;
      e.preventDefault();
      const unit =
        e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      // pages are wider than they are tall: scale so one screen-height of
      // scrolling moves one page width, like a normal vertical page
      const gain = width() / window.innerHeight;
      glideTo(target + e.deltaY * unit * gain);
    },
    { passive: false },
  );

  document.addEventListener("keydown", (e) => {
    if (!paged() || overlayOpen() || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest?.("input, textarea, select, [contenteditable]"))
      return;
    const k = e.key;
    const here = Math.round(target / width());
    let i = null;
    if (["ArrowRight", "ArrowDown", "PageDown"].includes(k)) i = here + 1;
    else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(k)) i = here - 1;
    else if (k === " ") i = here + (e.shiftKey ? -1 : 1);
    else if (k === "Home") i = 0;
    else if (k === "End") i = N - 1;
    if (i === null) return;
    e.preventDefault();
    goPage(i);
  });

  // nav links glide instead of jumping; #t/… (a portfolio trip) = Portfolio
  document.addEventListener("click", (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || !paged()) return;
    const i = indexOf(a.getAttribute("href").slice(1));
    if (i < 0) return;
    e.preventDefault();
    history.replaceState(null, "", "#" + pages[i].id);
    goPage(i);
  });
  const hashIndex = () => {
    const h = location.hash.slice(1);
    return indexOf(h.startsWith("t/") ? "portfolio" : h);
  };
  window.addEventListener("hashchange", () => {
    const i = hashIndex();
    if (paged() && i >= 0) goPage(i);
  });

  // keep the same page in view when the window resizes
  window.addEventListener("resize", () => {
    if (!paged()) return;
    cancelAnimationFrame(raf);
    raf = 0;
    target = Math.max(0, cur) * width();
    setX(target);
  });

  // ---- on / off with the breakpoint ----
  function enable() {
    root.classList.add("paged");
    window.scrollTo(0, 0);
    const i = Math.max(0, hashIndex());
    target = i * width();
    setX(target);
    cur = -1;
    onScroll();
  }
  function disable() {
    const i = Math.max(0, cur);
    root.classList.remove("paged");
    cancelAnimationFrame(raf);
    raf = 0;
    dots.style.backgroundPositionX = "";
    pages[i].scrollIntoView();
  }
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (wide.matches) enable();
  wide.addEventListener("change", () => (wide.matches ? enable() : disable()));
  // main.js registers its listener on DOMContentLoaded, before this runs
  document.addEventListener("DOMContentLoaded", () => {
    if (!paged()) return;
    cur = -1;
    onScroll();
  });
})();
