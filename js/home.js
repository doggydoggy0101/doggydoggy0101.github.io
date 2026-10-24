// About hero — background dot drift + anchoring the columns on the CV button
// (the Bang-Shien / Ian typewriter lives in main.js)

document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // dot grid drifts at a small fraction of the scroll speed → floats behind
  const dots = document.getElementById("dots");
  const TILE = 24; // matches background-size in home.css
  const DRIFT = 0.035;
  let ticking = false;
  const drift = () => {
    ticking = false;
    const y = reduce.matches ? 0 : (window.scrollY * DRIFT) % TILE;
    dots.style.transform = `translate3d(0, ${-y}px, 0)`;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(drift);
      }
    },
    { passive: true },
  );

  // the CV button is the reference: centre it on the photo, then put the
  // paragraph's first line level with the button's label
  const hero = document.querySelector(".hero");
  const photo = document.querySelector(".portrait img");
  const cv = document.querySelector(".cv");
  const cvLabel = cv.querySelector("span");
  const about = document.querySelector(".hero-about");
  const midY = (el) => {
    const r = el.getBoundingClientRect();
    return (r.top + r.bottom) / 2;
  };
  const firstLineBottom = (el) => {
    const t = el.firstChild;
    const i = t.textContent.search(/\S/); // skip leading markup whitespace
    const r = document.createRange();
    r.setStart(t, i);
    r.setEnd(t, i + 1);
    return r.getClientRects()[0].bottom;
  };
  const align = () => {
    hero.style.setProperty("--left-y", "0px");
    hero.style.setProperty("--about-y", "0px");
    if (window.matchMedia("(max-width: 960px)").matches) return;
    const l = midY(photo) - midY(cv);
    hero.style.setProperty("--left-y", `${l.toFixed(1)}px`);
    const d = firstLineBottom(cvLabel) - firstLineBottom(about);
    hero.style.setProperty("--about-y", `${d.toFixed(1)}px`);
  };
  align();
  document.fonts.ready.then(align);
  window.addEventListener("resize", align);
  if (!photo.complete) photo.addEventListener("load", align);
});
