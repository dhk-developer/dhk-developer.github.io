# dhk-developer.github.io

Source for the portfolio of **Dae Kang**, a Business Analyst who builds software.
Live site: **https://dhk-developer.github.io**

It's a static site with no framework and no runtime dependencies. Every page is plain HTML and CSS, and one small optional script adds the project filter.

## Quick start

Requires Node **22.18 or newer**, which runs TypeScript directly with no compile step.

```bash
npm run build     # writes ./dist
npm run dev       # build, then serve ./dist at http://localhost:4321
npm run check     # type-check with tsc (optional: needs TypeScript installed)
```

Pushing to `main` builds and deploys to GitHub Pages through `.github/workflows/deploy.yml`.

## Editing content

| To change | Edit |
|---|---|
| Name, role, links, email | `src/data/site.ts` |
| Jobs and education (also feeds the CV) | `src/data/experience.ts` |
| Project list, titles, facts, stack | `src/data/work.ts` |
| A case study's text | `content/work/<slug>.md` |
| Diagrams | `src/components/diagrams.ts` (inline SVG; place with `<!-- diagram:name -->` in Markdown) |
| Colours, type, spacing, motion | `src/styles/site.css` (tokens at the top; see `DESIGN.md`) |

To **add a project**, add an entry to `work.ts` and a matching `content/work/<slug>.md`. Pages, the sitemap and listings update automatically. The build **fails on broken internal links**.

### Case-study structure

Every case study follows the same shape, so the site keeps one identity across analysis, engineering and data work:

Context → Problem → Constraints → Decisions → Build → Verification → Outcome → Reflection.

Two HTML blocks can be used inside Markdown:

```html
<div class="decision"><p>Decision</p><dl><dt>Chose</dt><dd>…</dd><dt>Instead of</dt><dd>…</dd><dt>Trade-off</dt><dd>…</dd></dl></div>
<div class="bridge"><p>The analyst's view</p><p>…</p></div>
```

## Optional tools

These need extra packages locally. CI never runs them.

```bash
npm run cv    # print /cv/ to public/cv/Daehurn-Kang-CV.pdf (needs Playwright)
npm run og    # regenerate social cards in public/og/ (needs sharp)
node tools/export-diagrams.ts out/   # standalone SVG diagrams
```

After editing `experience.ts`, regenerate the CV PDF with
`ALLOW_MISSING_CV=1 node src/build.ts && npm run cv && npm run build`.

## Structure

```text
src/
  build.ts            page generation, sitemap, robots, link check
  lib/                html templating, Markdown rendering
  components/         layout, glyph system, diagrams
  pages/              one module per page type
  data/               site, experience, work (typed)
  styles/site.css     design tokens and all styles
  scripts/site.js     project filter (progressive enhancement)
content/work/         case-study Markdown
public/               fonts, favicon, social cards, CV PDF
vendor/marked/        vendored Markdown parser (MIT)
tools/                local server and optional generators
types/                minimal Node type declarations for tsc
```

## Why no framework

The site is content, not an application. Plain generated HTML gives near-zero JavaScript, no dependency updates to chase, free hosting, and a build that runs anywhere Node 22 runs. Astro or Next.js would add tooling without adding anything a visitor would notice.

## Licences

Code © Daehurn Kang. Poppins font: SIL Open Font License 1.1 (`public/fonts/LICENSE-Poppins.txt`). marked: MIT (`vendor/marked/LICENSE`).
