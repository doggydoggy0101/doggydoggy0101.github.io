document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const hiText = document.querySelector("#hi-text");
  const content = document.querySelector(".content");
  const scrollDownIndicator = document.querySelector(".scroll-down");

  // welcome text
  gsap.to(hiText, {
    opacity: 0,
    y: -50,
    scrollTrigger: {
      trigger: "#intro",
      start: "top top",
      end: "bottom 30%",
      scrub: true,
      // markers: true,
    },
  });

  // scroll down arrow
  gsap.to(scrollDownIndicator, {
    opacity: 0,
    scrollTrigger: {
      trigger: "#portfolio",
      start: "top 58%",
      end: "top 58%",
      toggleActions: "play none none reverse",
      // markers: true,
    },
  });

  // portfolio
  gsap.from(content, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#portfolio",
      start: "top 40%",
      end: "top 10%",
      scrub: true,
      // markers: true,
    },
  });
});

// typewritter effect
var typed = new Typed("#typed-text", {
  strings: ["Ian", "Bang-Shien"],
  typeSpeed: 100,
  backSpeed: 64,
  backDelay: 4800,
  loop: true,
  loopDelay: 4800,
  showCursor: false,
});
