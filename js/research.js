// Research content — edit the arrays below to maintain this section.

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
    title: "<b>Draper Scholar</b>",
    desc: "A scholarship designed to transform exceptional students into innovative professionals by integrating thesis research with hands-on experience.",
    date: "<i>(Sep 2025 - Present)</i>",
  },
  {
    index: "2.",
    title: "<b>NCTS Research Abroad Program</b>",
    desc: "A research abroad program financially supported by the Mathematics Division of National Center of Theoretical Sciences, worked with Prof. Shuzhong Zhang at the University of Minnesota.",
    date: "<i>(Jun 2024 - Aug 2024)</i>",
  },
  {
    index: "3.",
    title: "<b>Taiwan-Japan Joint Workshop, Presentation Award</b>",
    desc: "Out of 40 speakers in the 14th Taiwan-Japan Joint Workshop for Young Scholars in Applied Mathematics.",
    date: "<i>(Feb 2024)</i>",
  },
  {
    index: "4.",
    title: "<b>IBM Qiskit Hackathon Taiwan, 1st prize</b>",
    desc: "Out of 12 teams in the final round of the Quantum Computing Hackathon.",
    date: "<i>(Jul 2022)</i>",
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
];

document.addEventListener("DOMContentLoaded", () => {
  const item = (index, html, id) => {
    const li = document.createElement("li");
    li.className = "res-item";
    const ix = document.createElement("span");
    ix.className = "res-index";
    if (id) ix.id = id;
    ix.innerHTML = index;
    const txt = document.createElement("div");
    txt.className = "res-text";
    txt.innerHTML = html;
    li.append(ix, txt);
    return li;
  };

  const pubEl = document.getElementById("publications-list");
  publications.forEach((p) => {
    const links = p.links
      .map(
        (l) =>
          ` (<a class="res-link" href="${l.href}" target="_blank">${l.label}</a>)`,
      )
      .join("");
    pubEl.appendChild(item(p.index, p.text + links, p.id));
  });

  const awardEl = document.getElementById("awards-list");
  awards.forEach((a) =>
    awardEl.appendChild(item(a.index, `${a.title} ${a.desc} ${a.date}`)),
  );

  const presEl = document.getElementById("presentations-list");
  presentations.forEach((p) =>
    presEl.appendChild(item(p.index, `${p.title} ${p.location}`)),
  );
});
