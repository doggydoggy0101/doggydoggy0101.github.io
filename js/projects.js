document.addEventListener("DOMContentLoaded", function () {
  const projectLinks = document.querySelectorAll(".project-list li");
  const previews = document.querySelectorAll(".project-preview");

  function setActiveProject(selectedProject) {
    // Remove active class from all
    projectLinks.forEach(link => link.classList.remove("active"));

    // Add active class to the clicked project
    selectedProject.classList.add("active");
  }

  // Set default active project (first one on load)
  if (projectLinks.length > 0) {
    projectLinks[0].classList.add("active");
    document.getElementById(projectLinks[0].dataset.project).classList.remove("hidden");
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
});