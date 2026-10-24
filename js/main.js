// reveal-on-load for the hero, scroll-reveal for the rest, active-nav tracking

document.addEventListener("DOMContentLoaded", () => {
  // hero reveals shortly after load (no artificial long delay)
  requestAnimationFrame(() => {
    document
      .querySelectorAll(".hero .reveal, .hero .stagger")
      .forEach((el) => el.classList.add("in"));
  });

  // scroll-reveal for everything below the fold
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  document
    .querySelectorAll(".reveal:not(.in), .stagger:not(.in)")
    .forEach((el) => io.observe(el));

  // active-section highlight in the nav: the current section is the last one
  // whose top has passed 40% of the viewport; a single underline slides to it
  const navList = document.querySelector(".nav-links");
  const links = [...navList.querySelectorAll("a")];
  const sections = links
    .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);
  let current = null;
  let clickLock = false; // while a nav click scrolls, don't hop through sections
  const placeUnderline = () => {
    if (!current) return;
    navList.style.setProperty("--ind-x", `${current.offsetLeft}px`);
    navList.style.setProperty("--ind-w", `${current.offsetWidth}px`);
  };
  const setActive = (a) => {
    if (a === current) return;
    links.forEach((l) => l.removeAttribute("data-active"));
    a.setAttribute("data-active", "true");
    current = a;
    placeUnderline();
  };
  const fromScroll = () => {
    if (clickLock) return;
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
