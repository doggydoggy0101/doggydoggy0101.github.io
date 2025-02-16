document.addEventListener("DOMContentLoaded", () => {
  const parent = document.querySelector(".gallery-wrapper"); // The container
  let track = document.querySelector(".gallery-track"); // The original track

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
    newTrack.style.left = "0"; // Start at the beginning

    duplicate.style.position = "absolute";
    duplicate.style.left = `${newTrack.scrollWidth}px`; // Align seamlessly

    // Update reference to the new original track (since we replaced it)
    track = newTrack;

    console.log("Gallery reinitialized correctly");
  }

  // Initialize gallery on page load
  initializeGallery();

  // Reinitialize gallery on resize (clears gaps)
  window.addEventListener("resize", () => {
    console.log("Window resized - Restarting gallery to prevent gaps");
    initializeGallery();
  });
});


lightbox.option({
  'positionFromTop': 100,
  'wrapAround': true,
  'showImageNumberLabel': false,
})