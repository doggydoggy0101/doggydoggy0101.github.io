document.addEventListener("DOMContentLoaded", () => {
  const parent = document.querySelector(".gallery-wrapper"); 
  let track = document.querySelector(".gallery-track"); 
  //! [TEST] small resize problem
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;

  function initializeGallery() {
    // initialize wrapper
    parent.innerHTML = "";

    // clone track (before removing)
    const newTrack = track.cloneNode(true);
    const duplicate = newTrack.cloneNode(true);

    // remove old track
    newTrack.classList.remove("duplicate");
    duplicate.classList.add("duplicate");

    // add new track
    parent.appendChild(newTrack);
    parent.appendChild(duplicate);

    // position track
    newTrack.style.position = "absolute";
    newTrack.style.left = "0"; 
    duplicate.style.position = "absolute";
    duplicate.style.left = `${newTrack.scrollWidth}px`; 

    // update track
    track = newTrack;
  }

  // initialize on page load
  initializeGallery();
  // initialize resize 
  window.addEventListener("resize", () => {
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    //! [TEST] initialize only if change > 150px
    if (Math.abs(newWidth - lastWidth) > 150 || Math.abs(newHeight - lastHeight) > 150) {
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