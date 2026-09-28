/**
 * Static site build.
 *
 *   node src/build.ts            → writes ./dist
 *
 * No framework and no install step: Node 22.18+ runs this TypeScript directly
 * (type stripping), and the only third-party code is the vendored Markdown
 * parser in /vendor. Output is plain HTML and CSS with one small optional script.
 */
import { mkdirSync, rmSync, writeFileSync, cpSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderHome } from "./pages/home.ts";
import { renderWorkIndex, renderCaseStudy } from "./pages/work.ts";
import { renderExperience, renderAbout, renderNotFound } from "./pages/profile.ts";
import { renderCv } from "./pages/cv.ts";
import { work } from "./data/work.ts";
import { site } from "./data/site.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const pages: string[] = [];

function emit(path: string, contents: string): void {
  const file = path.endsWith(".html") ? join(out, path) : join(out, path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents);
  if (!path.endsWith("404.html")) pages.push(path);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

// Static files
cpSync(join(root, "public"), out, { recursive: true });
mkdirSync(join(out, "assets"), { recursive: true });
cpSync(join(root, "src/styles/site.css"), join(out, "assets/site.css"));
cpSync(join(root, "src/scripts/site.js"), join(out, "assets/site.js"));

// Pages
emit("/", renderHome());
emit("/work/", renderWorkIndex());
for (const w of work) emit(`/work/${w.slug}/`, renderCaseStudy(w, join(root, "content/work")));
emit("/experience/", renderExperience());
emit("/about/", renderAbout());
emit("/cv/", renderCv());
emit("/404.html", renderNotFound());

// Sitemap and robots
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(out, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${site.url}${p}</loc><lastmod>${today}</lastmod></url>`)
    .join("\n")}\n</urlset>\n`,
);
writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
writeFileSync(join(out, ".nojekyll"), "");

// Sanity checks that should fail the build rather than ship a broken page
const missing: string[] = [];
for (const p of pages) {
  const htmlText = readFileSync(p.endsWith(".html") ? join(out, p) : join(out, p, "index.html"), "utf8");
  for (const m of htmlText.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const target = m[1];
    const file = target.endsWith("/") ? join(out, target, "index.html") : join(out, target);
    if (!existsSync(file)) missing.push(`${p} → ${target}`);
  }
}
// The CV PDF is produced from the built CV page by `npm run cv`; allow its absence only for that step.
const unresolved = missing.filter((m) => !(process.env.ALLOW_MISSING_CV && m.endsWith(site.cvPdf)));
if (unresolved.length) {
  console.error("Broken internal links:\n" + [...new Set(unresolved)].join("\n"));
  process.exit(1);
}

console.log(`Built ${pages.length} pages into dist/`);
