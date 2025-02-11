document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const navbar = document.querySelector("#navbar");
  const footer = document.querySelector("#footer");

  // Float in navbar & footer when reaching the bio part
  gsap.to([navbar, footer], {
    opacity: 1,
    pointerEvents: "all",
    transform: "translate(-50%, 0)",
    scrollTrigger: {
      trigger: ".bio",
      start: "top 95%",
      end: "top 95%",
      toggleActions: "play none none reverse",
      // markers: true,
    }
  });

  // Fix navbar click alignment issue (Ensure sections align correctly)
  document.querySelectorAll('#navbar a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const sectionTop = targetElement.offsetTop; // Get section's top position
        const viewportHeight = window.innerHeight; // Get 100vh height

        // Ensure the section starts from the first 100vh
        window.scrollTo({
          top: sectionTop,
          behavior: "smooth"
        });
      }
    });
  });
});