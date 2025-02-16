document.addEventListener("DOMContentLoaded", function () {
  const previews = document.querySelectorAll(".project-preview");
  const fileNameDisplay = document.querySelector(".file-name");
  const cursorPosDisplay = document.querySelector(".cursor-pos");
  const timeDisplay = document.getElementById("current-time");
  const editorContent = document.querySelector(".editor-content");
  const projectLinks = document.querySelectorAll(".project-list li");
  const projectContainer = document.querySelector(".projects-container");
  const projectsSection = document.querySelector("#projects");
  const dragHandle = document.querySelector(".window-controls");

  // Set the active project in the explorer & update status bar
  function setActiveProject(selectedProject) {
    projectLinks.forEach(link => link.classList.remove("active"));
    selectedProject.classList.add("active");
    fileNameDisplay.textContent = `doggy/${selectedProject.innerText.trim()}`;
  }

  // Reset to the default - used on load & mobile mode
  function resetToDefaultProject() {
    if (projectLinks.length > 0) {
      projectLinks.forEach(link => link.classList.remove("active"));
      projectLinks[0].classList.add("active");
      previews.forEach(preview => preview.classList.add("hidden"));
      document.getElementById(projectLinks[0].dataset.project).classList.remove("hidden");
      fileNameDisplay.textContent = `doggy/${projectLinks[0].innerText.trim()}`;
    }
  }

  // Resizing behavior 
  function checkScreenSize() {
    const windowName = document.querySelector(".window-name");
    if (window.innerWidth < 768) {
      resetToDefaultProject();
      windowName.innerHTML = `<i class="fas fa-folder"></i> doggy@umich`;
    } else {
      windowName.innerHTML = `<i class="fas fa-folder"></i> doggy@umich: ~/doggy`;
    }
    resetProjectPosition(); // Reset position when resizing screen
  }

  // Reset project container position to center
  function resetProjectPosition() {
    const projectSectionRect = projectsSection.getBoundingClientRect();
    projectContainer.style.left = `${(projectSectionRect.width - projectContainer.offsetWidth) / 2}px`;
    projectContainer.style.top = `${(projectSectionRect.height - projectContainer.offsetHeight) / 2}px`;
  }

  // Initialization
  resetToDefaultProject();
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);

  // Handle clicking on project links (updates preview & status bar)
  projectLinks.forEach(link => {
    link.addEventListener("click", function () {
      previews.forEach(preview => preview.classList.add("hidden"));
      const selectedProject = document.getElementById(this.dataset.project);
      if (selectedProject) {
        selectedProject.classList.remove("hidden");
      }
      setActiveProject(this);
    });
  });

  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    timeDisplay.textContent = `${hours}:${minutes} ${ampm}`;
  }

  setInterval(updateTime, 1000);
  updateTime();

  // Handles cursor position tracking (updates line & column in status bar)
  editorContent.addEventListener("mousemove", function (e) {
    const boundingRect = editorContent.getBoundingClientRect();
    let line = Math.floor((e.clientY - boundingRect.top) / 24) + 1;
    let col = Math.floor((e.clientX - boundingRect.left) / 8) + 1;
    cursorPosDisplay.textContent = `Ln ${line}, Col ${col}`;
  });

  // File Explorer
  const doggyFolder = document.querySelector("#doggy-folder");
  const projectList = document.querySelector(".project-list");
  const arrowIcon = doggyFolder.querySelector(".fa-caret-down");
  const folderIcon = doggyFolder.querySelector(".fa-folder-open");

  doggyFolder.addEventListener("click", function () {
    projectList.classList.toggle("collapsed");
    if (projectList.classList.contains("collapsed")) {
      folderIcon.classList.replace("fa-folder-open", "fa-folder");
      arrowIcon.style.transform = "rotate(-90deg)";
    } else {
      folderIcon.classList.replace("fa-folder", "fa-folder-open");
      arrowIcon.style.transform = "rotate(0deg)";
    }
  });

  // Dragging 
  let isDragging = false, offsetX = 0, offsetY = 0;

  function enableDragging() {
    if (window.innerWidth > 768) {
      dragHandle.addEventListener("mousedown", startDragging);
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDragging);
    } else {
      dragHandle.removeEventListener("mousedown", startDragging);
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDragging);
      resetProjectPosition(); // Ensure correct placement
    }
  }

  function startDragging(e) {
    isDragging = true;
    const rect = projectContainer.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    e.preventDefault();
  }

  function onDrag(e) {
    if (!isDragging) return;
    const sectionRect = projectsSection.getBoundingClientRect();
    let newX = e.clientX - offsetX - sectionRect.left;
    let newY = e.clientY - offsetY - sectionRect.top;
    newX = Math.max(0, Math.min(newX, sectionRect.width - projectContainer.offsetWidth));
    newY = Math.max(0, Math.min(newY, sectionRect.height - projectContainer.offsetHeight));
    projectContainer.style.left = `${newX}px`;
    projectContainer.style.top = `${newY}px`;
  }

  function stopDragging() {
    isDragging = false;
  }

  enableDragging();
  window.addEventListener("resize", enableDragging);
});