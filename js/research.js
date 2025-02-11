document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".fade-in").forEach((element) => {
    gsap.fromTo(
      element,
      { opacity: 0, x: 20 }, // Start: invisible and slightly lower
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 90%",  // Start fading in when 90% of the element is visible
          toggleActions: "play none none reverse", // Reverse on scroll-up
          // markers: true, 
        },
      }
    );
  });
});