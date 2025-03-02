var typed = new Typed("#loading-text", {
  strings: ["Loading..."],
  typeSpeed: 100,
  showCursor: true, 
  cursorChar: "|", 
});

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const navbar = document.querySelector("#navbar");
  const footer = document.querySelector("#footer");

  // pre-load background
  const bgImage = new Image();
  bgImage.src = "../docs/images/background.webp";

  bgImage.onload = function () {
    setTimeout(() => {
      // hide text & cursor
      document.getElementById("loading-text").style.display = "none"; 
      document.querySelector(".typed-cursor").style.display = "none"; 
      // loading screen animation
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
  
    }, 2400); // slight delay before animation starts
  };

  // float in navbar and footer 
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

  // navbar animation
  document.querySelectorAll('#navbar a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop, // section starts from top
          behavior: "smooth"
        });
      }
    });
  });

  // smooth scroll
  const lenis = new Lenis({
    duration: 1,  
    easing: (t) => 1 - Math.pow(1 - t, 3), 
    smoothWheel: true,  
    smoothTouch: false,  
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