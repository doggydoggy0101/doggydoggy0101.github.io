var typed = new Typed("#loading-text", {
  strings: ["Loading..."],
  typeSpeed: 100,
  showCursor: TextTrackCueList,
});

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const navbar = document.querySelector("#navbar");
  const footer = document.querySelector("#footer");
  const loader = document.getElementById("loading-screen");

  // Create a new image to preload the background
  const bgImage = new Image();
  bgImage.src = "../docs/images/background.jpg";

  bgImage.onload = function () {
    setTimeout(() => {
      // Explicitly set opacity to 0 and transition in JS
      loader.style.transition = "opacity 0.8s ease-out";
      loader.style.opacity = "0"; 

      // Ensure the loader is removed after fade-out completes
      setTimeout(() => {
        loader.style.display = "none";
      }, 800); // Matches the CSS transition time (0.8s)
    }, 2000); // Small delay before fade-out starts
  };

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


  const lenis = new Lenis({
    duration: 1,  // Adjust smoothness (higher = smoother)
    easing: (t) => 1 - Math.pow(1 - t, 3), // Inertia easing
    smoothWheel: true,  // Enables smooth scrolling for mouse wheel
    smoothTouch: false,  // You can enable this for touch devices if needed
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
});