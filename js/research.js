// Research content (shown as "Publications") — edit the arrays below.

// newest first. Fields: title, authors (your name is bolded automatically),
//   venue (full name), short (the label in the left column, e.g. "RA-L"),
//   details (volume/pages, optional), year, links [{label, href}]
const ME = "B.S. Chen";
const publications = [
  {
    title:
      "A QCQP-Representable IMU Pre-Integration Factor for Certifiable State Estimation",
    authors: "U. Rai, Z. Xu, B.S. Chen, and D.M. Rosen",
    venue: "arXiv",
    short: "arXiv",
    year: 2026,
    links: [{ label: "preprint", href: "https://arxiv.org/abs/2609.38048" }],
  },
  {
    title:
      "Open-Vocabulary Semantic Segmentation for Dynamic 3D Scenes Using Scene Flow Estimation",
    authors:
      "Y.J. Li, Y.K. Lin, B.S. Chen, C.W. Huang, J.L. Chern, and C.C. Sun",
    venue: "IEEE Robotics and Automation Letters",
    short: "RA-L",
    details: "11(7):8140-8147",
    year: 2026,
    links: [
      {
        label: "paper",
        href: "https://ieeexplore.ieee.org/abstract/document/11520681",
      },
    ],
  },
  {
    title:
      "A Fast Fractional Programming Technique for Geman-McClure Robust Estimator",
    authors:
      "B.S. Chen, Y.K. Lin, J.Y. Chen, C.W. Huang, J.L. Chern, and C.C. Sun",
    venue: "IEEE Robotics and Automation Letters",
    short: "RA-L",
    details: "9(12):11666-11673",
    year: 2024,
    links: [
      { label: "paper", href: "https://ieeexplore.ieee.org/document/10749993" },
      { label: "preprint", href: "https://arxiv.org/pdf/2409.13978" },
      { label: "code", href: "https://github.com/StephLin/FracGM" },
    ],
  },
];

// awards and presentations are not shown on the site for now
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

// ledger: short venue label · title, authors, journal line · links
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("pubs");
  if (!list) return;
  const authors = (p) => p.authors.replace(ME, `<b>${ME}</b>`);
  const journal = (p) =>
    `<i>${p.venue}</i>${p.details ? `, ${p.details}` : ""}, ${p.year}`;
  list.innerHTML = publications
    .map(
      (p) => `<li>
        <span class="pv-tag">${p.short}</span>
        <div>
          <p class="pv-title">${p.title}</p>
          <p class="pv-authors">${authors(p)}</p>
          <p class="pv-venue">${journal(p)}</p>
        </div>
        <span class="pv-links">${p.links
          .map((l) => `<a href="${l.href}" target="_blank">${l.label}</a>`)
          .join("")}</span>
      </li>`,
    )
    .join("");
});
