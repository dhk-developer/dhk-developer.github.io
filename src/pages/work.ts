import { readFileSync } from "node:fs";
import { html, raw } from "../lib/html.ts";
import { layout } from "../components/layout.ts";
import { glyph } from "../components/glyph.ts";
import { injectDiagrams } from "../components/diagrams.ts";
import { renderMarkdown } from "../lib/markdown.ts";
import { site } from "../data/site.ts";
import { work, LENS_GLYPH, LENS_LABEL, type Lens, type Work } from "../data/work.ts";
import { workRow } from "./home.ts";

export function renderWorkIndex(): string {
  const ordered = [...work].sort((a, b) => a.order - b.order);
  const lenses: Lens[] = ["analysis", "engineering", "data"];
  const body = html`
<header class="page-head wrap">
  <p class="eyebrow"><span class="idx">W</span>${glyph("project", { size: 16 })}<span>Work</span></p>
  <h1>Things I've specified, built and verified</h1>
  <p class="lede">Each case study follows the same structure: context, problem, constraints, decisions, build, verification and reflection. Filter by the lens you care about. The identity doesn't change, only the emphasis.</p>
</header>
<section class="section wrap" aria-labelledby="projects-title">
  <h2 id="projects-title" class="visually-hidden">Projects</h2>
  <form class="lens-form" data-lens-filter hidden>
    <fieldset class="lens-filter">
      <legend>Show work with a focus on</legend>
      <input type="radio" name="lens" id="lens-all" value="all" checked><label for="lens-all">All</label>
      ${lenses.map(
        (l) => html`<input type="radio" name="lens" id="lens-${l}" value="${l}"><label for="lens-${l}">${glyph(LENS_GLYPH[l], { size: 14 })}${LENS_LABEL[l]}</label>`,
      )}
    </fieldset>
  </form>
  <p class="visually-hidden" aria-live="polite" data-lens-status></p>
  <ul class="rows" data-lens-list>
    ${ordered.map(workRow)}
  </ul>
</section>`;
  return layout(
    {
      path: "/work/",
      title: "Work",
      description: "Case studies: Memora (Unity/C#), DesktopIdle (.NET/Win32), a Riot API data study, a WPF overlay, a Tableau dashboard and Cambridge research code.",
      script: true,
    },
    body,
  );
}

export function renderCaseStudy(w: Work, contentDir: string): string {
  const source = readFileSync(`${contentDir}/${w.slug}.md`, "utf8");
  const { html: bodyHtml, headings } = renderMarkdown(source);
  const h2s = headings.filter((h) => h.depth === 2);
  const withToc = Boolean(w.long) && h2s.length > 3;

  const toc = withToc
    ? html`<nav class="toc" aria-label="On this page">
  <details open>
    <summary>On this page</summary>
    <ol>${h2s.map((h) => html`<li><a href="#${h.id}"><span class="toc-idx">${h.index}</span>${h.text}</a></li>`)}</ol>
  </details>
</nav>`
    : "";

  const others = work.filter((x) => x.slug !== w.slug).sort((a, b) => a.order - b.order).slice(0, 3);

  const bodyOut = html`
<article>
  <header class="page-head case-head wrap">
    <p class="breadcrumb"><a href="/work/">${glyph("arrow", { size: 14 })}All work</a></p>
    <p class="feature-name case-name">${glyph(w.featured ? "featured" : LENS_GLYPH[w.primary], { size: 14 })}${w.name}</p>
    <h1>${w.title}</h1>
    <p class="lede">${w.summary}</p>
    <dl class="facts case-facts">
      ${w.facts.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}
    </dl>
    <div class="case-stack"><span>Stack</span><ul class="stack-list" aria-label="Technologies">${w.stack.map((s) => html`<li>${s}</li>`)}</ul></div>
    <div class="actions mt-6">
      ${w.evidence.map((e) => html`<a class="btn" href="${e.href}" rel="noopener">${e.label} ${glyph("external", { size: 14 })}</a>`)}
    </div>
  </header>
  <div class="wrap case-body${withToc ? " has-toc" : ""}">
    ${toc}
    <div class="prose">${raw(injectDiagrams(bodyHtml))}</div>
  </div>
</article>
<section class="section wrap" aria-labelledby="next-title">
  <header class="section-head"><p class="eyebrow">${glyph("project", { size: 16 })}<span>More work</span></p><h2 id="next-title">Keep reading</h2></header>
  <ul class="rows">${others.map(workRow)}</ul>
</section>`;

  return layout(
    {
      path: `/work/${w.slug}/`,
      title: `${w.name}: case study`,
      description: w.description,
      image: `/og/${w.slug}.png`,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: w.name,
          headline: w.title,
          description: w.description,
          author: { "@type": "Person", name: site.fullName, url: site.url },
          keywords: w.stack.join(", "),
          url: `${site.url}/work/${w.slug}/`,
        },
      ],
    },
    bodyOut,
  );
}
