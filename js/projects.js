const projects = [
  {
    id: "blog-robotics",
    name: "robotics.md",
    content: `
      <h2>Robotics</h2>
      <ul>
        <a href="docs/blogs/rotation-representation.pdf" target="_blank" class="links">
          <i class="fas fa-file-pdf"></i> Rotation representation
        </a>
      </ul>
      <ul>
        <a href="docs/blogs/lie-theory.pdf" target="_blank" class="links">
          <i class="fas fa-file-pdf"></i> Lie theory
        </a>
      </ul>
    `,
  },
  {
    id: "blog-optimization",
    name: "optimization.md",
    content: `
      <h2>Optimization</h2>
      <ul>
        <a href="docs/blogs/optimality-conditions.pdf" target="_blank" class="links">
          <i class="fas fa-file-pdf"></i> Optimality conditions
        </a>
      </ul>
    `,
  },
  {
    id: "project-fracgm",
    name: "FracGM.md",
    content: `
      <h2>FracGM</h2>
      <p>A Fast Fractional Programming Technique for Geman-McClure Robust Estimator.
        Accepted for publication in IEEE Robotics and Automation Letters (RA-L 2024).</p>
      <a href="https://dgbshien.com/FracGM/" target="_blank" class="links"> 
        <i class="fas fa-external-link"></i> Project page
      </a>
      <a href="https://arxiv.org/pdf/2409.13978" target="_blank" class="links">
        <i class="fas fa-file-pdf"></i> Paper
      </a>
      <a href="https://github.com/StephLin/FracGM" target="_blank" class="links">
        <i class="fab fa-github-alt"></i> GitHub
      </a>
    `,
  },
  {
    id: "project-master-thesis",
    name: "master-thesis.md",
    content: `
      <h2>master-thesis</h2>
      <p>
        My master thesis: Algorithms for Geman-McClure Robust Estimation and Applications for Spatial Perceptions. 
      </p>
      <a href="https://github.com/doggydoggy0101/master-thesis" target="_blank" class="links">
        <i class="fab fa-github-alt"></i> GitHub
      </a>
    `,
  },
  {
    id: "project-quiz-game",
    name: "quiz-game.md",
    content: `
      <h2>quiz-game</h2>
      <p>A quiz-let like website for TOEFL vocabularies.</p>
      <a href="https://dgbshien.com/quiz-game/" target="_blank" class="links"> 
        <i class="fas fa-external-link"></i> Website
      </a>
      <a href="https://github.com/doggydoggy0101/quiz-game" target="_blank" class="links">
        <i class="fab fa-github-alt"></i> GitHub
      </a>
    `,
  },
];

document.addEventListener("DOMContentLoaded", function () {
  const fileNameDisplay = document.querySelector(".file-name");
  const cursorPosDisplay = document.querySelector(".cursor-pos");
  const timeDisplay = document.getElementById("current-time");
  const editorContent = document.querySelector(".editor-content");
  const projectLinks = document.querySelectorAll(".file-list li");
  const projectContainer = document.querySelector(".projects-container");
  const projectsSection = document.querySelector("#projects");
  const dragHandle = document.querySelector(".window-controls");

  projects.forEach((proj) => {
    const div = document.createElement("div");
    div.className = "project-preview hidden";
    div.id = proj.id;
    div.innerHTML = proj.content;
    editorContent.appendChild(div);
  });

  // utility function to update file path display
  function updateFilePathDisplay(link) {
    const folder = link.dataset.folder || "doggy";
    const filename = link.innerText.trim();
    fileNameDisplay.textContent = `doggy/${folder}/${filename}`;
  }

  // set the active project and update status bar
  function setActiveProject(selectedProject) {
    projectLinks.forEach((link) => link.classList.remove("active"));
    selectedProject.classList.add("active");
    updateFilePathDisplay(selectedProject);
  }

  // initialize project
  function resetToDefaultProject() {
    if (projectLinks.length > 0) {
      projectLinks.forEach((link) => link.classList.remove("active"));
      projectLinks[0].classList.add("active");
      const previews = document.querySelectorAll(".project-preview"); // update preview
      previews.forEach((preview) => preview.classList.add("hidden"));
      document
        .getElementById(projectLinks[0].dataset.project)
        .classList.remove("hidden");
      updateFilePathDisplay(projectLinks[0]);
    }
  }

  // initialize position
  function resetProjectPosition() {
    const projectSectionRect = projectsSection.getBoundingClientRect();
    projectContainer.style.left = `${(projectSectionRect.width - projectContainer.offsetWidth) / 2}px`;
    projectContainer.style.top = `${(projectSectionRect.height - projectContainer.offsetHeight) / 2}px`;
  }

  // resize
  function checkScreenSize() {
    const windowName = document.querySelector(".window-name");
    if (window.innerWidth < 768) {
      resetToDefaultProject(); // initialize project (mobile)
      windowName.innerHTML = `<i class="fas fa-folder"></i> doggy@stevens`;
    } else {
      windowName.innerHTML = `<i class="fas fa-folder"></i> doggy@stevens: ~/doggy`;
    }
    resetProjectPosition(); // initialize position
  }

  // initialize on page load
  resetToDefaultProject();
  // initialize on resize
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);

  // update preview and statub bar
  projectLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const previews = document.querySelectorAll(".project-preview"); // update preview
      previews.forEach((preview) => preview.classList.add("hidden"));
      const selectedProject = document.getElementById(this.dataset.project);
      if (selectedProject) {
        selectedProject.classList.remove("hidden");
      }
      setActiveProject(this);
    });
  });

  // clock
  function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    timeDisplay.textContent = `${hours}:${minutes} ${ampm}`;
  }
  setInterval(updateTime, 1000);
  updateTime();

  // line and column
  editorContent.addEventListener("mousemove", function (e) {
    const boundingRect = editorContent.getBoundingClientRect();
    let line = Math.floor((e.clientY - boundingRect.top) / 24) + 1;
    let col = Math.floor((e.clientX - boundingRect.left) / 8) + 1;
    cursorPosDisplay.textContent = `Ln ${line}, Col ${col}`;
  });

  // file collapse
  function setupFolderToggle(folderId, listClass) {
    const folder = document.getElementById(folderId);
    const list = document.querySelector(`.${listClass}`);
    const arrow = folder.querySelector(".fa-caret-down");
    const icon = folder.querySelector(".fa-folder-open");

    folder.addEventListener("click", () => {
      list.classList.toggle("collapsed");
      if (list.classList.contains("collapsed")) {
        icon.classList.replace("fa-folder-open", "fa-folder");
        arrow.style.transform = "rotate(-90deg)";
      } else {
        icon.classList.replace("fa-folder", "fa-folder-open");
        arrow.style.transform = "rotate(0deg)";
      }
    });
  }
  setupFolderToggle("project-folder", "project-list");
  setupFolderToggle("test-folder", "test-list");

  // dragging
  let isDragging = false,
    offsetX = 0,
    offsetY = 0;

  function enableDragging() {
    if (window.innerWidth > 768) {
      dragHandle.addEventListener("mousedown", startDragging);
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDragging);
    } else {
      dragHandle.removeEventListener("mousedown", startDragging);
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDragging);
      resetProjectPosition();
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
    newX = Math.max(
      0,
      Math.min(newX, sectionRect.width - projectContainer.offsetWidth),
    );
    newY = Math.max(
      0,
      Math.min(newY, sectionRect.height - projectContainer.offsetHeight),
    );
    projectContainer.style.left = `${newX}px`;
    projectContainer.style.top = `${newY}px`;
  }

  function stopDragging() {
    isDragging = false;
  }

  enableDragging();
  window.addEventListener("resize", enableDragging);
});
