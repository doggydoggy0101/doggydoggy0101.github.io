var typed = new Typed("#loading-text", {
  strings: ["Loading..."],
  typeSpeed: 100,
  showCursor: true, // Keep cursor visible initially
  cursorChar: "|", // Standard blinking cursor
});

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const navbar = document.querySelector("#navbar");
  const footer = document.querySelector("#footer");

  // Create a new image to preload the background
  const bgImage = new Image();
  bgImage.src = "../docs/images/background.jpg";

  bgImage.onload = function () {
    setTimeout(() => {
      // Hide text & cursor
      document.getElementById("loading-text").style.display = "none"; 
      document.querySelector(".typed-cursor").style.display = "none"; 
      // Animate the top half moving UP and the bottom half moving DOWN
      gsap.to(".loader-top", {
        y: "-100%",
        duration: 1.5,
        ease: "power4.out",
      });
  
      gsap.to(".loader-bottom", {
        y: "100%",
        duration: 1.5,
        ease: "power4.out",
        onComplete: () => {
          document.getElementById("loading-screen").style.display = "none"; 
        }
      });
  
    }, 2400); // Adjust delay before animation starts
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