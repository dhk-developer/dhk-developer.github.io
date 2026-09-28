/**
 * Generates 1200×630 social cards into public/og/ using sharp (optional tool:
 * run locally with `npm i -g sharp` or any sharp install; not needed for builds).
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { work } from "../src/data/work.ts";
import { site } from "../src/data/site.ts";

const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_PATH ?? "sharp");
mkdirSync("public/og", { recursive: true });

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
function wrapText(text: string, max: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) { lines.push(line.trim()); line = w; } else line += " " + w;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function card(kicker: string, title: string, foot: string): string {
  const lines = wrapText(title, 28).slice(0, 4);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<style>text{font-family:Poppins,'Century Gothic',sans-serif;font-weight:300}</style>
<rect width="1200" height="630" fill="#fcfbff"/>
<path d="M60 60h40M60 60v40M1140 60h-40M1140 60v40M60 570h40M60 570v-40M1140 570h-40M1140 570v-40" stroke="#8377dc" stroke-width="3" fill="none"/>
<circle cx="1040" cy="170" r="80" fill="none" stroke="#c4c6e9" stroke-width="2" stroke-dasharray="560 400"/>
<path d="M1040 146c1.1 13 11 23 24 24-13 1.1-22.9 11-24 24-1.1-13-11-22.9-24-24 13-1.1 22.9-11 24-24Z" fill="#8377dc"/>
<text x="110" y="150" font-size="26" letter-spacing="8" fill="#555e79">${esc(kicker.toUpperCase())}</text>
${lines.map((l, i) => `<text x="110" y="${250 + i * 70}" font-size="56" fill="#303953">${esc(l)}</text>`).join("")}
<text x="110" y="530" font-size="26" letter-spacing="4" fill="#5b4db5">${esc(foot)}</text>
</svg>`;
}

const jobs = [
  sharp(Buffer.from(card(`${site.name} · ${site.role}`, "Business Analyst who builds.", "dhk-developer.github.io"))).png().toFile("public/og/default.png"),
  ...work.map((w) => sharp(Buffer.from(card("Case study", w.title, `${site.name} · dhk-developer.github.io`))).png().toFile(`public/og/${w.slug}.png`)),
];
await Promise.all(jobs);
console.log(`Wrote ${jobs.length} social cards to public/og/`);
