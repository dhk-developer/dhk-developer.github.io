import type { GlyphName } from "../components/glyph.ts";

export type Lens = "analysis" | "engineering" | "data";

export interface Work {
  slug: string;
  /** Short name. */
  name: string;
  /** Mechanism-first title: what problem, what idea. Never just the product name. */
  title: string;
  /** One or two sentences for listings. */
  summary: string;
  /** Plain facts, shown as a definition list. */
  facts: Array<[label: string, value: string]>;
  stack: string[];
  lenses: Lens[];
  /** Primary lens: decides the glyph shown next to the item. */
  primary: Lens;
  evidence: Array<{ label: string; href: string }>;
  featured?: boolean;
  /** Shorter pages skip the table of contents. */
  long?: boolean;
  order: number;
  /** Social card / head description. */
  description: string;
}

export const LENS_LABEL: Record<Lens, string> = {
  analysis: "Analysis",
  engineering: "Engineering",
  data: "Data",
};

export const LENS_GLYPH: Record<Lens, GlyphName> = {
  analysis: "analysis",
  engineering: "engineering",
  data: "data",
};

export const work: Work[] = [
  {
    slug: "memora",
    name: "Memora",
    title: "A rhythm game where the judgement contract never moves, however much the scene does",
    summary:
      "An independent Unity game with its own authoring environment. Notes can travel along moving lines, follow other notes or converge on moving points, and each one is still judged at a single deterministic time and place. The custom editor previews all of it at any point in the song.",
    facts: [
      ["Role", "Sole designer and developer"],
      ["Period", "Late 2025 – ongoing"],
      ["Platform", "Unity 6 (URP) · Android / iOS / Windows"],
      ["Scale", "319 C# scripts · 9 scenes · 2 custom editors"],
    ],
    stack: ["C#", "Unity 6", "URP", "Input System", "Custom Editor tooling", "JSON", "Yarn Spinner"],
    lenses: ["engineering", "analysis", "data"],
    primary: "engineering",
    evidence: [{ label: "Technical showcase repository", href: "https://github.com/dhk-developer/memora-showcase" }],
    featured: true,
    long: true,
    order: 1,
    description:
      "Memora case study: DSP-clocked rhythm judgement, target-based notes, a custom Unity charting editor with shared runtime evaluators, and a measured 8× editor repaint improvement.",
  },
  {
    slug: "desktop-idle",
    name: "DesktopIdle",
    title: "Clearing the desktop after inactivity without fighting the input it creates",
    summary:
      "A Windows tray utility that shows the desktop after a period of inactivity and restores everything when you return. It stays out of the way of games, full-screen apps and videos that are actually playing.",
    facts: [
      ["Role", "Sole developer"],
      ["Released", "May 2026 · v1.0.1"],
      ["Platform", "Windows 10/11 · .NET 8"],
    ],
    stack: ["C#", ".NET 8", "WinForms", "Win32 P/Invoke", "WinRT media sessions", "System.Text.Json"],
    lenses: ["engineering", "analysis"],
    primary: "engineering",
    evidence: [{ label: "Source on GitHub", href: "https://github.com/dhk-developer/DesktopIdle" }],
    order: 2,
    description:
      "DesktopIdle: a .NET 8 Windows utility using Win32 idle detection, window and taskbar control, and media-session awareness, including a fix for self-generated input.",
  },
  {
    slug: "riot-analysis",
    name: "League of Legends data study",
    title: "What wins League of Legends games, 2020 against 2024, and where the comparison breaks",
    summary:
      "A data study that combines a 2020 dataset with 2024 top-ladder matches pulled from the Riot Games API under a strict rate limit. The 2024 data is reshaped into the same feature set, both years are loaded into MySQL, and the winning factors are compared.",
    facts: [
      ["Role", "Sole analyst"],
      ["Period", "Apr 2024"],
      ["Scale", "≈9,900 games (2020) · 1,847 unique games (2024)"],
    ],
    stack: ["Python", "Requests", "Pandas", "Seaborn", "SQLAlchemy", "MySQL", "Riot Games API"],
    lenses: ["data", "analysis"],
    primary: "data",
    evidence: [{ label: "Repository and notebook", href: "https://github.com/dhk-developer/Riot_ETL_Pipeline" }],
    order: 3,
    description:
      "An API-to-SQL data study comparing which early-game features correlate with winning in 2020 and 2024 League of Legends matches.",
  },
  {
    slug: "touch-fx",
    name: "Touch FX overlay",
    title: "A full-screen click effect that costs nothing when you're not clicking",
    summary:
      "A small Windows overlay that draws a short geometric burst wherever you click. Input passes straight through to the apps underneath, and the overlay renders only while an effect is alive.",
    facts: [
      ["Role", "Sole developer"],
      ["Released", "May 2026 · v0.1.2"],
      ["Platform", "Windows 10/11 · WPF"],
    ],
    stack: ["C#", "WPF", "Win32 hooks", "Custom rendering"],
    lenses: ["engineering"],
    primary: "engineering",
    evidence: [{ label: "Source on GitHub", href: "https://github.com/dhk-developer/Blue-Archive-Touch-fx" }],
    order: 4,
    description:
      "A WPF click-through overlay with a global mouse hook, on-demand rendering and theme-aware particle effects.",
  },
  {
    slug: "equity-dashboard",
    name: "Global equity indices dashboard",
    title: "One screen for performance, risk and market rotation",
    summary:
      "A Tableau dashboard that compares global equity indices over three lenses at once: long-run indexed performance, 2024 year-to-date return against volatility, and annual returns by market. It shows its caveats.",
    facts: [
      ["Role", "Sole analyst and designer"],
      ["Period", "2026"],
      ["Data", "Major indices, 2019 – Jun 2024"],
    ],
    stack: ["Tableau", "Data preparation", "Dashboard design"],
    lenses: ["data", "analysis"],
    primary: "data",
    evidence: [
      { label: "Interactive dashboard (Tableau Public)", href: "https://public.tableau.com/app/profile/daehurn/viz/GlobalEquityIndices/DivergingAsia-GlobalEquityTrends" },
      { label: "Repository", href: "https://github.com/dhk-developer/Tableau-Global-Equity-Indicies" },
    ],
    order: 5,
    description: "A Tableau dashboard comparing global equity index performance, risk/return and annual rotation.",
  },
  {
    slug: "structure-search",
    name: "Polymer structure search",
    title: "Generating plausible polymer crystals at random, then letting physics decide",
    summary:
      "Research code from a Cambridge placement. It builds random polyethylene chains, places them in randomised periodic boxes without overlaps, and relaxes them with a force field, following the AIRSS structure-search method.",
    facts: [
      ["Role", "Computational Research Assistant"],
      ["Period", "Summer 2022"],
      ["Context", "University of Cambridge · In2Research"],
    ],
    stack: ["Python", "NumPy", "ASE", "LAMMPS", "Linux / HPC"],
    lenses: ["data", "engineering"],
    primary: "data",
    evidence: [{ label: "Source on GitHub", href: "https://github.com/dhk-developer/opt-polyethylene" }],
    order: 6,
    description: "Python research code generating and relaxing random polyethylene structures in an AIRSS-style search.",
  },
];

export const workBySlug = new Map(work.map((w) => [w.slug, w]));
