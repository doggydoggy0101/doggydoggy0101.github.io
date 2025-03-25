document.addEventListener("DOMContentLoaded", () => {
  const parent = document.querySelector(".gallery-wrapper");
  let track = document.querySelector(".gallery-track");

  function generateGalleryRow(imageIds, containerId) {
    const container = document.getElementById(containerId);

    imageIds.forEach((id) => {
      const item = document.createElement("div");
      item.classList.add("gallery-item");

      item.innerHTML = `
        <a href="docs/gallery/${id}.webp" data-lightbox="gallery">
          <img class="img" src="docs/gallery-compress/${id}.jpg" alt="Gallery Image ${id}">
        </a>
      `;

      container.appendChild(item);
    });
  }

  //! maintain gallery here
  generateGalleryRow([1, 4, 7, 10, 13, 16, 19, 22, 25, 28], "gallery-row-1");
  generateGalleryRow([2, 5, 8, 11, 14, 17, 20, 23, 26, 29], "gallery-row-2");
  generateGalleryRow([3, 6, 9, 12, 15, 18, 21, 24, 27, 30], "gallery-row-3");

  // small resize problem
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
    // initialize only if change > 150px
    if (
      Math.abs(newWidth - lastWidth) > 150 ||
      Math.abs(newHeight - lastHeight) > 150
    ) {
      lastWidth = newWidth;
      lastHeight = newHeight;
      initializeGallery();
    }
  });
});

lightbox.option({
  positionFromTop: 70,
  wrapAround: true,
  showImageNumberLabel: false,
});
