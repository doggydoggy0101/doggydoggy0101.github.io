const publications = [
  {
    id: "FracGM",
    index: "[1]",
    text: `<b>B. S. Chen</b>, Y. K. Lin, J. Y. Chen, C. W. Huang, J. L. Chern, and C. C. Sun.
            A Fast Fractional Programming Technique for Geman-McClure Robust Estimator.
            <i>IEEE Robotics and Automation Letters</i>, 9(12):11666-11673, 2024.`,
    links: [
      { label: "paper", href: "https://ieeexplore.ieee.org/document/10749993" },
      { label: "preprint", href: "https://arxiv.org/pdf/2409.13978" },
      { label: "code", href: "https://github.com/StephLin/FracGM" },
    ],
  },
];

const awards = [
  {
    index: "1.",
    title: "<b>NCTS Research Abroad Program</b>",
    desc: "A research abroad program financially supported by the Mathematics Division of National Center of Theoretical Sciences, worked with Prof. Shuzhong Zhang at the University of Minnesota.",
    date: "<i>(Jun 2024 - Aug 2024)</i>",
  },
  {
    index: "2.",
    title: "<b>Taiwan-Japan Joint Workshop, Presentation Award</b>",
    desc: "Out of 40 speakers in the 14th Taiwan-Japan Joint Workshop for Young Scholars in Applied Mathematics.",
    date: "<i>(Feb 2024)</i>",
  },
  {
    index: "3.",
    title: "<b>IBM Qiskit Hackathon Taiwan, 1st prize</b>",
    desc: "Out of 12 teams in the final round of the Quantum Computing Hackathon.",
    date: "<i>(Jul 2022)</i>",
  },
  {
    index: "4.",
    title: "<b>Taiwan-Japan Joint Workshop, Presentation Award</b>",
    desc: "Out of 42 speakers in the 12th Taiwan-Japan Joint Workshop for Young Scholars in Applied Mathematics.",
    date: "<i>(Feb 2022)</i>",
  },
];

const presentations = [
  {
    index: "1.",
    title: "<b>Workshop on Advances in Continuous Optimization 2024.</b>",
    location:
      "<i>RIKEN Center for Advanced Intelligence Project</i>, Tokyo, Japan, November 25-26, 2024.",
  },
  {
    index: "2.",
    title: "<b>2024 NCTS Student Workshop on Scientific Computing.</b>",
    location: "<i>National Taiwan University</i>, Taipei, Taiwan, May 6, 2024.",
  },
  {
    index: "3.",
    title:
      "<b>14th Taiwan-Japan Joint Workshop for Young Scholars in Applied Mathematics.</b>",
    location: "<i>Meiji University</i>, Tokyo, Japan, Feb 27-29, 2024.",
  },
  {
    index: "4.",
    title: "<b>Workshop on Advances in Continuous Optimization 2023.</b>",
    location: "<i>The University of Tokyo</i>, Tokyo, Japan, Jul 24-25, 2023.",
  },
  {
    index: "5.",
    title: "<b>2022 Summer school on Quantum Computer.</b>",
    location:
      "<i>Asia University</i>, Taipei, Taiwan, August 21 - Sep 24, 2022.",
  },
  {
    index: "6.",
    title: "<b>Seminar on Quantum Theory and Computation.</b>",
    location:
      "<i>National Taiwan Normal University</i>, Taipei, Taiwan, Apr 26 - May 24, 2022.",
  },
  {
    index: "7.",
    title:
      "<b>12th Taiwan-Japan Joint Workshop for Young Scholars in Applied Mathematics.</b>",
    location: "(virtual) Feb 28 - Mar 1, 2022.",
  },
];

document.addEventListener("DOMContentLoaded", function () {
  function generatePublications() {
    const container = document.getElementById("publications-list");
    publications.forEach((pub) => {
      const li = document.createElement("li");

      const index = document.createElement("span");
      index.classList.add("research-index");
      index.setAttribute("id", pub.id);
      index.innerHTML = pub.index;

      const text = document.createElement("div");
      text.classList.add("research-text");
      text.innerHTML = pub.text;

      pub.links.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.href;
        a.target = "_blank";
        a.className = "research-link";
        a.textContent = link.label;
        text.appendChild(document.createTextNode(" ("));
        text.appendChild(a);
        text.appendChild(document.createTextNode(")"));
      });

      li.appendChild(index);
      li.appendChild(text);
      container.appendChild(li);
    });
  }

  function generateAwards() {
    const container = document.getElementById("awards-list");
    awards.forEach((item) => {
      const li = document.createElement("li");

      const index = document.createElement("span");
      index.classList.add("research-index");
      index.innerHTML = item.index;

      const text = document.createElement("div");
      text.classList.add("research-text");
      text.innerHTML = `${item.title} ${item.desc} ${item.date}`;

      li.appendChild(index);
      li.appendChild(text);
      container.appendChild(li);
    });
  }

  function generatePresentations() {
    const container = document.getElementById("presentations-list");
    presentations.forEach((pres) => {
      const li = document.createElement("li");

      const index = document.createElement("span");
      index.classList.add("research-index");
      index.innerHTML = pres.index;

      const text = document.createElement("div");
      text.classList.add("research-text");
      text.innerHTML = `${pres.title} ${pres.location}`;

      li.appendChild(index);
      li.appendChild(text);
      container.appendChild(li);
    });
  }

  generatePublications();
  generateAwards();
  generatePresentations();

  document.querySelectorAll(".cite").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
