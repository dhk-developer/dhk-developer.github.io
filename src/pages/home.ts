import { html, raw } from "../lib/html.ts";
import { layout, sectionHead } from "../components/layout.ts";
import { glyph } from "../components/glyph.ts";
import { judgementContract } from "../components/diagrams.ts";
import { site } from "../data/site.ts";
import { work, LENS_GLYPH, LENS_LABEL, type Work } from "../data/work.ts";
import { roles } from "../data/experience.ts";

const aperture = raw(`<svg class="aperture" viewBox="0 0 200 200" aria-hidden="true" focusable="false" fill="none" stroke="currentColor">
  <g class="ap-rot">
    <circle class="ap-ring" cx="100" cy="100" r="86" stroke-width="1" stroke-dasharray="540 1000"/>
    <circle cx="100" cy="100" r="64" stroke-width="0.75" stroke-dasharray="2 5"/>
    ${Array.from({ length: 6 }, (_, i) => {
      const a = (i * Math.PI) / 3;
      const x1 = 100 + Math.cos(a) * 30, y1 = 100 + Math.sin(a) * 30;
      const x2 = 100 + Math.cos(a + 1.15) * 64, y2 = 100 + Math.sin(a + 1.15) * 64;
      return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke-width="0.9"/>`;
    }).join("")}
  </g>
  <path class="ap-accent" d="M178 38l5 5-5 5-5-5Z" stroke-width="1.2"/>
  <path class="ap-accent ap-spark" d="M100 88c.3 6 5.7 11.7 12 12-6.3.3-11.7 6-12 12-.3-6-5.7-11.7-12-12 6.3-.3 11.7-6 12-12Z" fill="currentColor" stroke="none"/>
  <path d="M12 12h16M12 12v16M188 188h-16M188 188v-16" stroke-width="1.2" class="ap-accent"/>
</svg>`);

function lensTags(w: Work) {
  return html`<ul class="lenses" aria-label="Focus">
    ${w.lenses.map((l) => html`<li class="tag">${glyph(LENS_GLYPH[l], { size: 14 })}${LENS_LABEL[l]}</li>`)}
  </ul>`;
}

export function workRow(w: Work) {
  return html`<li class="row" data-lenses="${w.lenses.join(" ")}">
  <span class="row-glyph">${glyph(LENS_GLYPH[w.primary], { size: 22 })}</span>
  <div>
    <p class="row-name">${w.name}</p>
    <h3><a href="/work/${w.slug}/">${w.title}</a></h3>
    <p class="row-summary">${w.summary}</p>
  </div>
  <div class="row-meta">
    ${lensTags(w)}
    <ul class="stack-list" aria-label="Technologies">${w.stack.slice(0, 5).map((s) => html`<li>${s}</li>`)}</ul>
  </div>
  <span class="row-arrow">${glyph("arrow", { size: 20 })}</span>
</li>`;
}

export function renderHome(): string {
  const memora = work.find((w) => w.featured)!;
  const others = work.filter((w) => !w.featured).sort((a, b) => a.order - b.order);
  const current = roles[0];

  const body = html`
<section class="hero wrap" aria-labelledby="hero-title">
  <div class="hero-grid">
    <div>
      <p class="eyebrow"><span class="idx">01</span>${glyph("profile", { size: 16 })}<span>Dae Kang · ${site.role}</span></p>
      <h1 id="hero-title">Business Analyst <span class="accent">who builds.</span></h1>
      <p class="lede">I work on discovery, user research and requirements for Microsoft 365 data-governance programmes at ${site.employer}. Outside work I design and build software. The biggest project is Memora, a Unity rhythm game with its own authoring editor, timing engine and story system.</p>
      <div class="actions">
        <a class="btn btn-primary" href="/work/memora/">Read the Memora case study ${glyph("arrow", { size: 16 })}</a>
        <a class="btn" href="/cv/">View CV</a>
        <a class="text-link email" href="mailto:${site.email}">${glyph("contact", { size: 16 })}${site.email}</a>
      </div>
    </div>
    <div class="hero-side">
    ${aperture}
    <div class="frame">
      <span class="frame-label">At a glance</span>
      <dl class="glance">
        <div><dt>Now</dt><dd>${current.title.split(" · ")[0]}, ${current.organisation}</dd></div>
        <div><dt>Focus</dt><dd>Requirements, user research, process and data workflows</dd></div>
        <div><dt>Builds in</dt><dd>C# (Unity, .NET), Python, SQL</dd></div>
        <div><dt>Education</dt><dd>MSci Chemistry, Imperial College London</dd></div>
        <div><dt>Based</dt><dd>${site.location} · English, Korean</dd></div>
      </dl>
    </div>
    </div>
  </div>
</section>

<section class="wrap" aria-labelledby="proof-title">
  <h2 id="proof-title" class="visually-hidden">Evidence summary</h2>
  <ul class="proof">
    <li>
      <h3>${glyph("analysis", { size: 18 })}Analysis at work</h3>
      <p>Discovery, stakeholder interviews and structured user research with records and information-governance users, turned into user stories and acceptance criteria.</p>
    </li>
    <li>
      <h3>${glyph("engineering", { size: 18 })}Engineering on my own</h3>
      <p>A Unity/C# game runtime with a custom charting editor, and two shipped Windows utilities that call Win32 directly.</p>
    </li>
    <li>
      <h3>${glyph("data", { size: 18 })}Data in practice</h3>
      <p>Python and SQL: API extraction under rate limits, reshaping into a comparable schema, loading into MySQL, and dashboards in Tableau and Power BI.</p>
    </li>
  </ul>
</section>

<section class="section wrap" aria-labelledby="work-title">
  ${sectionHead("02", "Selected work", "Start with Memora", "work-title", "featured")}
  <article class="feature">
    <div>
      <p class="feature-name">${glyph("featured", { size: 14 })}${memora.name}</p>
      <h3><a href="/work/memora/">${memora.title}</a></h3>
      <p>${memora.summary}</p>
      <dl class="facts">${memora.facts.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
      <div class="actions">
        <a class="btn btn-primary" href="/work/memora/">Read the case study ${glyph("arrow", { size: 16 })}</a>
        <a class="text-link" href="${site.links.showcase}">Showcase repository ${glyph("external", { size: 14 })}</a>
      </div>
    </div>
    <figure class="feature-figure frame">
      <span class="frame-label">From the case study</span>
      ${raw(judgementContract())}
      <figcaption>Every note has a fixed judgement contract (beat, target, action), however elaborate its entrance.</figcaption>
    </figure>
  </article>

  <h3 class="visually-hidden">More work</h3>
  <ul class="rows mt-6">
    ${others.map(workRow)}
  </ul>
  <p class="mt-6"><a class="text-link" href="/work/">All work, filterable by focus ${glyph("arrow", { size: 16 })}</a></p>
</section>

<section class="section wrap" aria-labelledby="method-title">
  ${sectionHead("03", "How I work", "The same method at work and in my own projects", "method-title", "analysis")}
  <ol class="method">
    <li>
      <h3>Understand</h3>
      <dl>
        <dt>At work</dt><dd>Stakeholder interviews and research sessions with records-management users. Needs, pain points and process gaps synthesised and prioritised.</dd>
        <dt>In projects</dt><dd>Memora starts from two users, player and chart author, whose needs conflict: expressive motion against fair, readable judgement.</dd>
      </dl>
    </li>
    <li>
      <h3>Specify</h3>
      <dl>
        <dt>At work</dt><dd>Business and technical requirements, user stories and acceptance criteria in Azure DevOps.</dd>
        <dt>In projects</dt><dd>A written judgement contract for every note, and explicit compatibility contracts for existing charts and saves.</dd>
      </dl>
    </li>
    <li>
      <h3>Build</h3>
      <dl>
        <dt>At work</dt><dd>Technical discovery with engineering teams, and data ingestion and validation workflows mapped end to end.</dd>
        <dt>In projects</dt><dd>C# systems in Unity and .NET, and Python and SQL pipelines, built myself.</dd>
      </dl>
    </li>
    <li>
      <h3>Verify</h3>
      <dl>
        <dt>At work</dt><dd>Acceptance criteria that can actually be tested, plus training and communications so change is adopted.</dd>
        <dt>In projects</dt><dd>Measured before-and-after profiling, parity checks between editor and runtime, and a capability matrix that states limits.</dd>
      </dl>
    </li>
  </ol>
</section>

<section class="section wrap" aria-labelledby="exp-title">
  ${sectionHead("04", "Experience", "Where the analysis comes from", "exp-title", "profile")}
  <ol class="timeline">
    ${roles.map(
      (r) => html`<li>
      <span class="when">${r.current ? html`<span class="now">${glyph("featured", { size: 10 })}Current</span>` : r.period}</span>
      <span class="what">${r.organisation}<span>${r.title}</span></span>
      <p class="why">${r.context}</p>
    </li>`,
    )}
    <li>
      <span class="when">2019 – 2023</span>
      <span class="what">Imperial College London<span>MSci Chemistry (2:1)</span></span>
      <p class="why">Computational dissertation on reproducible inputs for large biological simulations.</p>
    </li>
  </ol>
  <p class="mt-6"><a class="text-link" href="/experience/">Experience in detail ${glyph("arrow", { size: 16 })}</a></p>
</section>
`;

  return layout(
    {
      path: "/",
      title: `${site.name}: ${site.role} who builds`,
      bareTitle: true,
      description: site.description,
    },
    body,
  );
}
