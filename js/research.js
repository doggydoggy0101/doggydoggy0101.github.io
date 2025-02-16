document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".cite").forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default jump
      
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
});