document.addEventListener("DOMContentLoaded", function () {
  const projectLinks = document.querySelectorAll(".project-list li");
  const previews = document.querySelectorAll(".project-preview");
  const fileNameDisplay = document.querySelector(".file-name");
  const cursorPosDisplay = document.querySelector(".cursor-pos");
  const timeDisplay = document.getElementById("current-time");
  const editorContent = document.querySelector(".editor-content");

  const doggyFolder = document.querySelector("#doggy-folder");
  const projectList = document.querySelector(".project-list");
  const arrowIcon = doggyFolder.querySelector(".fa-caret-down");

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

  // Update cursor position in status bar (Simulated)
  editorContent.addEventListener("mousemove", function (e) {
    const boundingRect = editorContent.getBoundingClientRect();
  
    // Get cursor Y position relative to the whole editor
    let line = Math.floor((e.clientY - boundingRect.top) / 24) + 1; // Approx. 24px per line
  
    // Get cursor X position relative to the whole editor
    let col = Math.floor((e.clientX - boundingRect.left) / 8) + 1;  // Approx. 8px per character
  
    cursorPosDisplay.textContent = `Ln ${line}, Col ${col}`;
  });

  // === Toggle Doggy Folder Expand/Collapse ===
  doggyFolder.addEventListener("click", function () {
    projectList.classList.toggle("collapsed"); // Toggle visibility
  
    // Correct arrow rotation: Right (collapsed) <-> Down (expanded)
    if (projectList.classList.contains("collapsed")) {
      arrowIcon.style.transform = "rotate(-90deg)"; // Point right when collapsed
    } else {
      arrowIcon.style.transform = "rotate(0deg)"; // Point down when expanded
    }
  });
});