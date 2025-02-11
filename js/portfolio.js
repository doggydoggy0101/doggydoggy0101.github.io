document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const hiText = document.querySelector("#hi-text");
  const content = document.querySelector(".content");
  const scrollDownIndicator = document.querySelector(".scroll-down");

  // Ensure "Hi!" fades out correctly
  gsap.to(hiText, {
    opacity: 0,
    y: -50,
    scrollTrigger: {
      trigger: "#intro",
      start: "top top",
      end: "bottom 30%",
      scrub: true,
      // markers: true,
    }
  });

  // Fix scroll indicator disappearing too early
  gsap.to(scrollDownIndicator, {
    opacity: 0,
    scrollTrigger: {
      trigger: "#portfolio",  // Now only disappears when reaching the bio section
      start: "top 58%",  // This ensures it stays visible while in the intro section
      end: "top 58%",
      toggleActions: "play none none reverse",
      // markers: true,
    }
  });

  // Ensure main content ("I am Ian Chen..." & Bio) fades in correctly
  gsap.from(content, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#portfolio",
      start: "top 40%",  // Adjusted for better centering
      end: "top 10%",
      scrub: true,
      // markers: true,
    }
  });
});

var typed = new Typed("#typed-text", {
  strings: ["Ian", "Bang-Shien"],
  typeSpeed: 100,
  backSpeed: 64,
  backDelay: 4800,
  loop: true,
  loopDelay: 4800,
  showCursor: false,
});