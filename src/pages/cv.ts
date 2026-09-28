import { html } from "../lib/html.ts";
import { layout } from "../components/layout.ts";
import { glyph } from "../components/glyph.ts";
import { site } from "../data/site.ts";
import { roles, education } from "../data/experience.ts";

/**
 * The CV is generated from the same data as the rest of the site, so the
 * portfolio stays the single source of truth. `npm run cv` prints this page
 * to /cv/Daehurn-Kang-CV.pdf with the print stylesheet.
 */
export function renderCv(): string {
  const body = html`
<header class="page-head wrap no-print">
  <p class="eyebrow"><span class="idx">CV</span>${glyph("profile", { size: 16 })}<span>Curriculum vitae</span></p>
  <h1>CV</h1>
  <p class="lede">The same facts as the rest of this site, on one page.</p>
  <div class="actions mt-6">
    <a class="btn btn-primary" href="${site.cvPdf}" download>${glyph("download", { size: 16 })}Download PDF</a>
    <a class="btn" href="mailto:${site.email}">Email me</a>
  </div>
</header>
<section class="section wrap">
  <div class="cv">
    <header>
      <h2 style="margin-top:0;border:0;font-size:var(--step-3);letter-spacing:.02em;text-transform:none;font-weight:300">${site.fullName}</h2>
      <p><strong>${site.role}</strong>: requirements, user research and process analysis, backed by hands-on software and data work.</p>
      <ul class="cv-contact">
        <li><a href="mailto:${site.email}">${site.email}</a></li>
        <li><a href="${site.links.linkedin}">linkedin.com/in/daehurn-kang-003650209</a></li>
        <li><a href="${site.links.github}">github.com/dhk-developer</a></li>
        <li><a href="${site.url}">dhk-developer.github.io</a></li>
        <li>${site.location}</li>
      </ul>
    </header>

    <h2>Profile</h2>
    <p>Business Analyst at Infotechtion working on Microsoft 365 data-governance programmes: discovery, stakeholder interviews, structured user research, requirements, user stories and acceptance criteria. Independently I design and build software, most substantially Memora, a Unity/C# rhythm game with a custom authoring editor, DSP-clocked timing and a story system. I also work with Python and SQL for data extraction and analysis. MSci Chemistry, Imperial College London.</p>

    <h2>Experience</h2>
    ${roles.map(
      (r) => html`<div class="cv-entry">
      <header><h3>${r.title}, ${r.organisation}</h3><span class="when">${r.period}</span></header>
      <ul>${r.evidence.map((e) => html`<li>${e}</li>`)}</ul>
    </div>`,
    )}

    <h2>Selected independent projects</h2>
    <div class="cv-entry">
      <header><h3>Memora: rhythm game and authoring environment (Unity 6, C#)</h3><span class="when">2025 – present</span></header>
      <ul>
        <li>Designed a judgement contract that separates each note's beat, target and action from its presentation, so moving lines, floating notes and effects can't change scoring.</li>
        <li>Built DSP-clocked timing with per-device latency calibration (four taps, outlier-resistant estimate).</li>
        <li>Built a custom Unity charting editor with shared runtime evaluators, interval-indexed seeking, versioned phrase presets and undo transactions.</li>
        <li>Profiled and fixed editor playback: mean repaint fell from about 120 ms to 15 ms on the largest chart, verified by 18,125 automated parity checks.</li>
      </ul>
    </div>
    <div class="cv-entry">
      <header><h3>DesktopIdle: Windows idle utility (.NET 8, Win32)</h3><span class="when">2026</span></header>
      <ul><li>Tray app that clears and restores the desktop after inactivity, using idle detection, window and taskbar control, and media-session awareness. It includes a fix for self-generated input ending idle mode.</li></ul>
    </div>
    <div class="cv-entry">
      <header><h3>League of Legends data study (Python, SQL, Riot Games API)</h3><span class="when">2024</span></header>
      <ul><li>Extracted rate-limited API data, reshaped it to match a 2020 dataset, loaded both into MySQL and compared which in-game factors correlate with winning, noting where the two datasets aren't like-for-like.</li></ul>
    </div>

    <h2>Education</h2>
    ${education.map(
      (e) => html`<div class="cv-entry">
      <header><h3>${e.title}, ${e.organisation}</h3><span class="when">${e.period}</span></header>
      <p>${e.note}</p>
    </div>`,
    )}
    <div class="cv-entry">
      <header><h3>A-levels, LaSWAP Sixth Form</h3><span class="when">2017 – 2019</span></header>
      <p>Chemistry (A*), Computer Science (A), Mathematics (A), Physics (A).</p>
    </div>

    <h2>Skills</h2>
    <p><strong>Analysis:</strong> requirements engineering, user stories and acceptance criteria, user research and synthesis, process mapping, stakeholder engagement, Azure DevOps, change and adoption.<br>
    <strong>Engineering:</strong> C# (Unity 6, .NET 8, WinForms, WPF), Win32 interop, Git/GitHub, software architecture and profiling.<br>
    <strong>Data:</strong> Python (Pandas, NumPy, Requests), SQL (MySQL, SQLAlchemy), REST APIs, Tableau, Power BI.<br>
    <strong>Languages:</strong> English, Korean (fluent).</p>
  </div>
</section>`;
  return layout(
    {
      path: "/cv/",
      title: "CV",
      description: "CV of Daehurn (Dae) Kang, Business Analyst with hands-on software and data experience.",
    },
    body,
  );
}
