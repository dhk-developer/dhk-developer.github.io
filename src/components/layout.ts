import { html, raw, type Renderable, type SafeHtml } from "../lib/html.ts";
import { site, nav } from "../data/site.ts";
import { glyph } from "./glyph.ts";

export interface PageMeta {
  /** Path of this page, e.g. "/work/memora/". */
  path: string;
  /** Document title; " · Dae Kang" is appended unless `bareTitle` is set. */
  title: string;
  bareTitle?: boolean;
  description: string;
  /** Path to a 1200×630 social image. */
  image?: string;
  /** Extra JSON-LD objects. */
  jsonLd?: object[];
  bodyClass?: string;
  /** Adds the small progressive-enhancement script. */
  script?: boolean;
  noindex?: boolean;
}

function isCurrent(path: string, href: string): boolean {
  return href === "/" ? path === "/" : path.startsWith(href);
}

export function header(path: string): SafeHtml {
  return html`<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/"${path === "/" ? raw(' aria-current="page"') : ""}>
      ${glyph("featured", { size: 14, className: "brand-mark" })}<span>Dae Kang</span>
    </a>
    <nav class="site-nav" aria-label="Primary">
      <ul>
        ${nav.map(
          (item) =>
            html`<li><a href="${item.href}"${isCurrent(path, item.href) ? raw(' aria-current="page"') : ""}>${item.label}</a></li>`,
        )}
        <li><a class="nav-contact" href="mailto:${site.email}">Email me</a></li>
      </ul>
    </nav>
  </div>
</header>`;
}

export function footer(): SafeHtml {
  return html`<footer class="site-footer" id="contact">
  <div class="wrap footer-inner">
    <div class="footer-lead">
      <p class="eyebrow">${glyph("contact", { size: 16 })}<span>Contact</span></p>
      <p class="footer-title">Open to Business Analyst, Technical BA and Product Analyst roles, and to junior technical roles where analysis and building overlap.</p>
      <p><a class="footer-email" href="mailto:${site.email}">${site.email}</a></p>
    </div>
    <ul class="footer-links">
      <li><a href="${site.links.linkedin}" rel="me noopener">LinkedIn ${glyph("external", { size: 14 })}</a></li>
      <li><a href="${site.links.github}" rel="me noopener">GitHub ${glyph("external", { size: 14 })}</a></li>
      <li><a href="/cv/">CV ${glyph("arrow", { size: 14 })}</a></li>
    </ul>
  </div>
  <div class="wrap footer-base">
    <p>© ${new Date().getFullYear()} ${site.fullName}. Built as a static site, with no tracking and no cookies.</p>
    <p><a href="${site.links.github}/dhk-developer.github.io">Site source</a></p>
  </div>
</footer>`;
}

function personJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.fullName,
    alternateName: site.name,
    jobTitle: site.role,
    worksFor: { "@type": "Organization", name: site.employer },
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "Imperial College London" }],
    knowsLanguage: ["en", "ko"],
    email: `mailto:${site.email}`,
    url: site.url,
    sameAs: [site.links.github, site.links.linkedin],
    knowsAbout: [
      "Business analysis",
      "Requirements engineering",
      "User research",
      "Process analysis",
      "C#",
      "Unity",
      "Python",
      "SQL",
      "REST APIs",
    ],
  };
}

export function layout(meta: PageMeta, body: Renderable): string {
  const title = meta.bareTitle ? meta.title : `${meta.title} · ${site.name}`;
  const canonical = site.url + meta.path;
  const image = site.url + (meta.image ?? "/og/default.png");
  const ld = [personJsonLd(), ...(meta.jsonLd ?? [])];
  const page = html`<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${meta.description}">
<link rel="canonical" href="${canonical}">
${meta.noindex ? raw('<meta name="robots" content="noindex">') : ""}
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#fcfbff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#12141f" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/poppins-light.woff" as="font" type="font/woff" crossorigin>
<link rel="preload" href="/fonts/poppins-regular.woff" as="font" type="font/woff" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<script type="application/ld+json">${raw(JSON.stringify(ld).replace(/</g, "\\u003c"))}</script>
</head>
<body${meta.bodyClass ? raw(` class="${meta.bodyClass}"`) : ""}>
<a class="skip-link" href="#main">Skip to content</a>
${header(meta.path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
${meta.script ? raw('<script src="/assets/site.js" defer></script>') : ""}
</body>
</html>
`;
  return page.value;
}

/** Numbered section heading in Memora's "01 — LABEL" style. */
export function sectionHead(index: string, label: string, heading: Renderable, id?: string, glyphName?: Parameters<typeof glyph>[0]): SafeHtml {
  return html`<header class="section-head">
  <p class="eyebrow"><span class="idx">${index}</span>${glyphName ? glyph(glyphName, { size: 16 }) : ""}<span>${label}</span></p>
  <h2${id ? raw(` id="${id}"`) : ""}>${heading}</h2>
</header>`;
}
