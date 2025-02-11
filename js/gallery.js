document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".gallery-track");
  const parent = track.parentNode;
  const trackWidth = track.offsetWidth;

  function duplicateGallery() {
    const duplicate = track.cloneNode(true);
    duplicate.classList.add("duplicate");
    parent.appendChild(duplicate);

    // Ensure duplicate starts right next to the original
    duplicate.style.position = "absolute";
    duplicate.style.left = `${trackWidth}px`; // Ensures perfect alignment
    duplicate.style.top = "0";
  }

  duplicateGallery();
});


lightbox.option({
  'positionFromTop': 64,
  'wrapAround': true,
  'showImageNumberLabel': false,
})