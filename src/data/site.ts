/**
 * Single source of truth for identity and links.
 * Edit here; every page, the CV, metadata and structured data read from it.
 */
export const site = {
  url: "https://dhk-developer.github.io",
  name: "Dae Kang",
  fullName: "Daehurn Kang",
  role: "Business Analyst",
  employer: "Infotechtion",
  location: "United Kingdom",
  headline: "Business Analyst who builds.",
  description:
    "Dae Kang is a Business Analyst at Infotechtion working on Microsoft 365 data-governance programmes, and an independent software builder: Memora (Unity/C#), Windows utilities and data projects.",
  email: "daehurn.kang@gmail.com",
  links: {
    github: "https://github.com/dhk-developer",
    linkedin: "https://www.linkedin.com/in/daehurn-kang-003650209",
    showcase: "https://github.com/dhk-developer/memora-showcase",
    tableau:
      "https://public.tableau.com/app/profile/daehurn/viz/GlobalEquityIndices/DivergingAsia-GlobalEquityTrends",
  },
  cvPdf: "/cv/Daehurn-Kang-CV.pdf",
  languages: ["English", "Korean (fluent)"],
} as const;

export const nav = [
  { href: "/work/", label: "Work" },
  { href: "/experience/", label: "Experience" },
  { href: "/about/", label: "About" },
  { href: "/cv/", label: "CV" },
] as const;
