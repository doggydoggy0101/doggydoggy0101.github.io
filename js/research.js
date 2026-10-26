// Research content (shown as "Publications") — edit the list below.

// newest first. Fields: title, authors (your name is bolded automatically),
//   venue (full name), short (the label in the left column, e.g. "RA-L"),
//   details (volume/pages, optional), year, links [{label, href}]
const ME = "B.S. Chen";
const publications = [
  {
    title: "PnP*: A certifiable solver for Perspective-n-Point",
    authors: "B.S. Chen, C.E. Eaton, and D.M. Rosen",
    venue: "arXiv",
    short: "arXiv",
    year: 2026,
    links: [
      { label: "preprint", href: "https://arxiv.org/abs/2610.31797" },
      { label: "code", href: "https://github.com/doggydoggy0101/pnp-star" },
    ],
  },
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
      { label: "code", href: "https://github.com/NTNU-Math-Chern/FracGM" },
    ],
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
