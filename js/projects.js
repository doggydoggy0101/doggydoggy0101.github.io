const projects = [
  {
    id: "project1",
    name: "blog.md",
    content: `
      <h2>blog</h2>
      <p><i class="fas fa-book"></i> Optimization</p>
      <ul>
        <a href="docs/blogs/optimality-conditions.pdf" target="_blank" class="links">
          <i class="fas fa-file-pdf"></i> Optimality conditions
        </a>
      </ul>
      <p><i class="fas fa-book"></i> Robotics</p>
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
    id: "project2",
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
  {
    id: "project3",
    name: "master-thesis.md",
    content: `
      <h2>master-thesis</h2>
      <p>
        Implementation of my master thesis "Algorithms for Geman-McClure Robust Estimation and Applications for Spatial Perceptions". 
        We provide robust point cloud registration solvers:
      </p>
      <ul>
        <li>IRLS (Iterative Re-weighted Least Squares)</li>
        <li>GNC (Graduated Non-Convexity)</li>
        <li>FracGM <a href="#FracGM" class="cite">[1]</a></li>
      </ul>
      <p>For more information:</p>
      <a href="https://github.com/doggydoggy0101/master-thesis" target="_blank" class="links">
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
  const projectLinks = document.querySelectorAll(".project-list li");
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

  // set the active project and update status bar
  function setActiveProject(selectedProject) {
    projectLinks.forEach((link) => link.classList.remove("active"));
    selectedProject.classList.add("active");
    fileNameDisplay.textContent = `doggy/${selectedProject.innerText.trim()}`;
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
      fileNameDisplay.textContent = `doggy/${projectLinks[0].innerText.trim()}`;
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
      windowName.innerHTML = `<i class="fas fa-folder"></i> doggy@umich`;
    } else {
      windowName.innerHTML = `<i class="fas fa-folder"></i> doggy@umich: ~/doggy`;
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
