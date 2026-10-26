// active-nav tracking (+ the sliding underline) and the name typewriter

document.addEventListener("DOMContentLoaded", () => {
  // active-section highlight in the nav, plus a single underline.
  // wide screens: js/pager.js reports the nearest page ("pagechange") and the
  // exact scroll position ("pagescroll"), so the underline tracks the scroll;
  // narrow (vertical) screens: the last section whose top has passed 40% of
  // the view is active and the underline slides to it
  const navList = document.querySelector(".nav-links");
  const links = [...navList.querySelectorAll("a")];
  const linkFor = (id) =>
    links.find((l) => l.getAttribute("href") === "#" + id);
  const sections = links
    .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);
  let current = null;
  let live = null; // {from, to, t} from the pager while it's active
  let clickLock = false; // while a nav click scrolls, don't hop through sections
  const centre = (a) => a.offsetLeft + a.offsetWidth / 2;
  const placeUnderline = () => {
    let x;
    if (live) {
      const a = centre(linkFor(live.from));
      x = a + (centre(linkFor(live.to)) - a) * live.t;
    } else if (current) x = centre(current);
    else return;
    navList.style.setProperty("--ind-x", `${x}px`);
  };
  const setActive = (a) => {
    if (a === current) return;
    links.forEach((l) => l.removeAttribute("data-active"));
    a.setAttribute("data-active", "true");
    current = a;
    placeUnderline();
  };
  const fromScroll = () => {
    const paged = document.documentElement.classList.contains("paged");
    if (!paged && live) {
      live = null; // back to the vertical layout
      navList.classList.remove("ind-live");
    }
    if (clickLock || paged) return;
    let i = 0;
    sections.forEach((s, k) => {
      if (s.getBoundingClientRect().top <= window.innerHeight * 0.4) i = k;
    });
    // the last section may be too short to reach the line at the page bottom
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;
    setActive(links[atBottom ? sections.length - 1 : i]);
  };
  let navTick = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!navTick) {
        navTick = true;
        requestAnimationFrame(() => {
          navTick = false;
          fromScroll();
        });
      }
    },
    { passive: true },
  );
  links.forEach((a) =>
    a.addEventListener("click", () => {
      setActive(a);
      clickLock = true;
      const release = () => {
        clickLock = false;
        fromScroll();
      };
      window.addEventListener("scrollend", release, { once: true });
      setTimeout(release, 1200); // fallback where scrollend isn't supported
    }),
  );
  document.addEventListener("pagechange", (e) => {
    const a = linkFor(e.detail.id);
    if (a) setActive(a);
  });
  document.addEventListener("pagescroll", (e) => {
    live = e.detail;
    navList.classList.add("ind-live");
    placeUnderline();
  });
  window.addEventListener("resize", placeUnderline);
  fromScroll();
  document.fonts.ready.then(() => {
    placeUnderline(); // re-measure with the real font, then allow sliding
    requestAnimationFrame(() => navList.classList.add("ind-ready"));
  });

  // typewriter on the first name — cycles Bang-Shien / Ian
  const typeEl = document.getElementById("typeName");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (typeEl && !reduce) {
    const words = ["Bang-Shien", "Ian"];
    let wi = 0;
    let ci = words[0].length;
    let deleting = true; // start by deleting the initial word
    const tick = () => {
      const w = words[wi];
      if (!deleting) {
        ci++;
        if (ci >= w.length) {
          ci = w.length;
          deleting = true;
          typeEl.textContent = w;
          return setTimeout(tick, 3000); // hold full word
        }
      } else {
        ci--;
        if (ci <= 0) {
          ci = 0;
          deleting = false;
          wi = (wi + 1) % words.length;
        }
      }
      typeEl.textContent = words[wi].slice(0, ci);
      setTimeout(tick, deleting ? 55 : 110);
    };
    setTimeout(tick, 3000); // hold the initial word first
  }
});
