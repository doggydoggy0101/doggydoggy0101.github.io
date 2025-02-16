document.addEventListener("DOMContentLoaded", function () {
  const previews = document.querySelectorAll(".project-preview");
  const fileNameDisplay = document.querySelector(".file-name");
  const cursorPosDisplay = document.querySelector(".cursor-pos");
  const timeDisplay = document.getElementById("current-time");
  const editorContent = document.querySelector(".editor-content");
  const projectLinks = document.querySelectorAll(".project-list li");

  function setActiveProject(selectedProject) {
    // Remove active class from all
    projectLinks.forEach(link => link.classList.remove("active"));
    // Add active class to the clicked project
    selectedProject.classList.add("active");
    // Update the file name in the status bar
    fileNameDisplay.textContent = `doggy/${selectedProject.innerText}`;
  }

  // Set default active project (first one on load)
  if (projectLinks.length > 0) {
    projectLinks[0].classList.add("active");
    document.getElementById(projectLinks[0].dataset.project).classList.remove("hidden");
    fileNameDisplay.textContent = `doggy/${projectLinks[0].innerText}`;
  }

  projectLinks.forEach(link => {
    link.addEventListener("click", function () {
      // Hide all project previews
      previews.forEach(preview => preview.classList.add("hidden"));
      // Show the selected project preview
      const selectedProject = document.getElementById(this.dataset.project);
      if (selectedProject) {
        selectedProject.classList.remove("hidden");
      }
      // Update active file indicator in the explorer
      setActiveProject(this);
    });
  });

  // Update time in status bar every second
  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // Convert to 12-hour format
    minutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero if needed

    timeDisplay.textContent = `${hours}:${minutes} ${ampm}`;
  }

  setInterval(updateTime, 1000); // Update every second
  updateTime(); // Initialize time on page load

  // Update cursor position in status bar 
  editorContent.addEventListener("mousemove", function (e) {
    const boundingRect = editorContent.getBoundingClientRect();
  
    // Get cursor Y position relative to the whole editor
    let line = Math.floor((e.clientY - boundingRect.top) / 24) + 1; // Approx. 24px per line
  
    // Get cursor X position relative to the whole editor
    let col = Math.floor((e.clientX - boundingRect.left) / 8) + 1;  // Approx. 8px per character
  
    cursorPosDisplay.textContent = `Ln ${line}, Col ${col}`;
  });

  // === Toggle Doggy Folder Expand/Collapse ===
  const doggyFolder = document.querySelector("#doggy-folder");
  const projectList = document.querySelector(".project-list");
  const arrowIcon = doggyFolder.querySelector(".fa-caret-down");
  const folderIcon = doggyFolder.querySelector(".fa-folder-open"); 
  doggyFolder.addEventListener("click", function () {
    projectList.classList.toggle("collapsed"); // Toggle visibility
  
    if (projectList.classList.contains("collapsed")) {
      folderIcon.classList.replace("fa-folder-open", "fa-folder"); // Change to closed folder
      arrowIcon.style.transform = "rotate(-90deg)"; // Point right when collapsed
    } else {
      folderIcon.classList.replace("fa-folder", "fa-folder-open"); // Change to open folder
      arrowIcon.style.transform = "rotate(0deg)"; // Point down when expanded
    }
  });


  // === Dragging the projects container ===
  const projectsSection = document.querySelector("#projects");
  const projectContainer = document.querySelector(".projects-container");
  const dragHandle = document.querySelector(".window-controls");

  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  // Ensure container is centered initially without transform
  const projectSectionRect = projectsSection.getBoundingClientRect();
  projectContainer.style.left = `${(projectSectionRect.width - projectContainer.offsetWidth) / 2}px`;
  projectContainer.style.top = `${(projectSectionRect.height - projectContainer.offsetHeight) / 2}px`;

  // Start Dragging
  dragHandle.addEventListener("mousedown", (e) => {
    isDragging = true;
    const projectContainerRect = projectContainer.getBoundingClientRect();
    offsetX = e.clientX - projectContainerRect.left;
    offsetY = e.clientY - projectContainerRect.top;
    e.preventDefault();
  });

  // Dragging Motion
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const projectSectionRect = projectsSection.getBoundingClientRect();
    let newX = e.clientX - offsetX - projectSectionRect.left;
    let newY = e.clientY - offsetY - projectSectionRect.top;
    // Restrict movement to `#projects`
    newX = Math.max(0, Math.min(newX, projectSectionRect.width - projectContainer.offsetWidth));
    newY = Math.max(0, Math.min(newY, projectSectionRect.height - projectContainer.offsetHeight));
    // Apply new position
    projectContainer.style.left = `${newX}px`;
    projectContainer.style.top = `${newY}px`;
  });

  // Stop Dragging
  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
});