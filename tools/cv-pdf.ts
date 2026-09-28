/**
 * Prints the built CV page to public/cv/Daehurn-Kang-CV.pdf using Playwright's Chromium.
 * Optional local tool (needs Playwright); CI never runs it. Re-run after editing CV data:
 *   ALLOW_MISSING_CV=1 node src/build.ts && node tools/cv-pdf.ts && node src/build.ts
 */
import { createServer } from "node:http";
import { readFile, stat, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright");
const root = join(process.cwd(), "dist");
const types: Record<string, string> = { ".html": "text/html", ".css": "text/css", ".woff": "font/woff", ".svg": "image/svg+xml", ".js": "text/javascript" };

const server = createServer(async (req, res) => {
  let file = join(root, new URL(req.url ?? "/", "http://x").pathname);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
}).listen(0);
const port = (server.address() as { port: number }).port;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.emulateMedia({ media: "print", colorScheme: "light" });
await page.goto(`http://localhost:${port}/cv/`, { waitUntil: "networkidle" });
await mkdir("public/cv", { recursive: true });
await page.pdf({ path: "public/cv/Daehurn-Kang-CV.pdf", format: "A4", printBackground: false, preferCSSPageSize: true });
await browser.close();
server.close();
console.log("Wrote public/cv/Daehurn-Kang-CV.pdf");
