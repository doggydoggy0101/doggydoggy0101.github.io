document.addEventListener("DOMContentLoaded", () => {
  const parent = document.querySelector(".gallery-wrapper"); 
  let track = document.querySelector(".gallery-track"); 
  // small resize problem
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;

  function initializeGallery() {
    // Clear all existing content inside the wrapper (prevents leftover gaps)
    parent.innerHTML = "";

    // Clone the original gallery track before removing
    const newTrack = track.cloneNode(true);
    const duplicate = newTrack.cloneNode(true);

    // Reset classes
    newTrack.classList.remove("duplicate");
    duplicate.classList.add("duplicate");

    // Append both the original and duplicate tracks to the parent container
    parent.appendChild(newTrack);
    parent.appendChild(duplicate);

    // Ensure correct positioning for seamless looping
    newTrack.style.position = "absolute";
    newTrack.style.left = "0"; // position

    duplicate.style.position = "absolute";
    duplicate.style.left = `${newTrack.scrollWidth}px`; 

    // Update reference to the new original track
    track = newTrack;

    console.log("Gallery reinitialized correctly");
  }

  // Initialize gallery on page load
  initializeGallery();

  // Reinitialize gallery on resize (clears gaps)
  window.addEventListener("resize", () => {
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    //! [TEST] initialize only if change > 50px
    if (Math.abs(newWidth - lastWidth) > 50 || Math.abs(newHeight - lastHeight) > 50) {
      lastWidth = newWidth;
      lastHeight = newHeight;
      initializeGallery();
    }
  });
});


lightbox.option({
  'positionFromTop': 100,
  'wrapAround': true,
  'showImageNumberLabel': false,
})