import { html } from "../lib/html.ts";
import { layout, sectionHead } from "../components/layout.ts";
import { glyph, type GlyphName } from "../components/glyph.ts";
import { site } from "../data/site.ts";
import { roles, education } from "../data/experience.ts";

/**
 * Skills grouped by demonstrated capability. Every item names its evidence,
 * so nothing appears here that the site doesn't back up somewhere.
 */
const skills: Array<{ group: string; glyph: GlyphName; items: Array<[string, string]> }> = [
  {
    group: "Product & analysis",
    glyph: "analysis",
    items: [
      ["Requirements, user stories, acceptance criteria", "Infotechtion, Azure DevOps"],
      ["User research and synthesis", "Records Management / Information Governance users"],
      ["Process mapping, current and future state", "Infotechtion; Xander Talent (CRM)"],
      ["Stakeholder and technical discovery", "Business and engineering stakeholders"],
      ["Change, training and adoption", "M365 data-protection programmes"],
    ],
  },
  {
    group: "Engineering",
    glyph: "engineering",
    items: [
      ["C# · Unity 6", "Memora: runtime, custom editor tooling, story system"],
      ["C# · .NET 8, WinForms, WPF", "DesktopIdle, Touch FX overlay"],
      ["Win32 interop", "Idle detection, window and taskbar control, input hooks"],
      ["Architecture and performance", "Shared evaluators, interval indexes, measured profiling"],
      ["Git and GitHub", "Tagged releases, public showcase repository"],
    ],
  },
  {
    group: "Data",
    glyph: "data",
    items: [
      ["Python · Pandas · NumPy", "Riot data study, Cambridge research code"],
      ["SQL · MySQL · SQLAlchemy", "API data loaded and compared in MySQL"],
      ["REST APIs under rate limits", "Riot Games API extraction"],
      ["Tableau · Power BI", "Global equity dashboard, index analytics"],
      ["Data modelling and serialisation", "Memora chart schema, versioned presets"],
    ],
  },
];

export function renderExperience(): string {
  const body = html`
<header class="page-head wrap">
  <p class="eyebrow"><span class="idx">E</span>${glyph("profile", { size: 16 })}<span>Experience</span></p>
  <h1>Analysis inside real organisations</h1>
  <p class="lede">My professional work sits between the people who need a system and the people who build it. Client and programme details are withheld. What's described here is the work itself.</p>
</header>
<section class="section wrap" aria-label="Roles">
  ${roles.map(
    (r) => html`<article class="role">
    <div>
      <h2>${r.organisation}</h2>
      <p class="role-title">${r.title}</p>
      <p class="role-period">${r.current ? glyph("featured", { size: 10 }) : ""}${r.period}</p>
    </div>
    <div>
      <p class="role-context">${r.context}</p>
      <ul>${r.evidence.map((e) => html`<li>${e}</li>`)}</ul>
      <ul class="stack-list" aria-label="Demonstrates">${r.demonstrates.map((d) => html`<li>${d}</li>`)}</ul>
    </div>
  </article>`,
  )}
  ${education.map(
    (e) => html`<article class="role">
    <div>
      <h2>${e.organisation}</h2>
      <p class="role-title">${e.title}</p>
      <p class="role-period">${e.period}</p>
    </div>
    <div><p>${e.note}</p></div>
  </article>`,
  )}
</section>
<section class="section wrap" aria-labelledby="skills-title">
  ${sectionHead("S", "Skills, with evidence", "What I can show, not just list", "skills-title", "project")}
  <div class="skills">
    ${skills.map(
      (s) => html`<section>
      <h3>${glyph(s.glyph, { size: 20 })}${s.group}</h3>
      <ul>${s.items.map(([name, ev]) => html`<li>${name}<span>${ev}</span></li>`)}</ul>
    </section>`,
    )}
  </div>
</section>`;
  return layout(
    {
      path: "/experience/",
      title: "Experience",
      description: "Business analysis at Infotechtion (M365 data governance), technical consulting at Xander Talent, computational research at Cambridge, and skills grouped by evidence.",
    },
    body,
  );
}

export function renderAbout(): string {
  const body = html`
<header class="page-head wrap">
  <p class="eyebrow"><span class="idx">A</span>${glyph("profile", { size: 16 })}<span>About</span></p>
  <h1>From modelling molecules to modelling requirements</h1>
</header>
<section class="section wrap">
  <div class="prose">
    <p>I studied Chemistry at Imperial College London. What I enjoyed most was the computational side: writing Python to build and check simulation inputs, and later a summer at Cambridge generating polymer structures and letting a force field decide which ones were plausible. The work was mostly taking a messy, underspecified problem, modelling it precisely enough for a machine, and checking the answer against reality.</p>
    <p>That is still the job, just with people in the loop. As a Business Analyst at Infotechtion I work on Microsoft 365 data-governance programmes. I interview stakeholders, run research with the people who manage records and information every day, map how work actually flows, and write requirements and acceptance criteria that engineering teams can build and test against. Before that I was a technical consultant, and briefly trained in US and UK tax, which taught me how much regulated process depends on detail.</p>
    <p>Outside work I build software, because I like being able to make the thing I've just specified. Memora, my rhythm game, is the largest example. It has a custom authoring editor, a timing engine and a story system, and it has taught me more about architecture, performance and compatibility than any course could. I also build small Windows tools when something annoys me enough.</p>
    <p>That combination is the reason this site exists. I understand the people and the business problem, I understand the system, and I can build it. I'm looking for roles where all three are useful: business and technical analysis first, and junior technical roles where analysis and building overlap.</p>
    <h2>Working style</h2>
    <ul>
      <li><strong>Write the rule down first.</strong> Most of the hard problems in Memora became easy once the requirement was a sentence I could test.</li>
      <li><strong>State the limits.</strong> I keep "available", "partial" and "missing" separate, at work and in my own projects.</li>
      <li><strong>Measure before optimising.</strong> Profiling showed the editor slowdown was repeated serialisation, not rendering.</li>
      <li><strong>Protect what already works.</strong> Existing users, data and saves are stakeholders too.</li>
    </ul>
    <h2>Outside the work</h2>
    <p>I speak Korean fluently. I draw, and have sold artwork online. Rhythm games are the reason Memora exists.</p>
    <p class="mt-6"><a class="btn btn-primary" href="mailto:${site.email}">${glyph("contact", { size: 16 })}Get in touch</a></p>
  </div>
</section>`;
  return layout(
    {
      path: "/about/",
      title: "About",
      description: "Dae Kang: from computational chemistry to business analysis, and why he builds software alongside it.",
    },
    body,
  );
}

export function renderNotFound(): string {
  const body = html`
<section class="section wrap center-404">
  <p class="eyebrow"><span class="idx">404</span>${glyph("project", { size: 16 })}<span>Not found</span></p>
  <h1>This page isn't in the chart.</h1>
  <p class="lede muted mt-6">The link may be out of date.</p>
  <div class="actions"><a class="btn btn-primary" href="/">Home</a><a class="btn" href="/work/">Work</a></div>
</section>`;
  return layout({ path: "/404.html", title: "Page not found", description: "Page not found.", noindex: true }, body);
}
