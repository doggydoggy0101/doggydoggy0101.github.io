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

  // active-section highlight in the nav
  const links = [...document.querySelectorAll(".nav-links a")];
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const navIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) => a.removeAttribute("data-active"));
          map.get(e.target.id)?.setAttribute("data-active", "true");
        }
      });
    },
    { threshold: 0.5 },
  );
  document.querySelectorAll("section[id]").forEach((s) => navIO.observe(s));

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
