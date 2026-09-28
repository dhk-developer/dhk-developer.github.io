/** Tiny static server for local preview: node tools/serve.ts [port] */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)), "dist");
const port = Number(process.argv[2] ?? 4321);
const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png", ".woff": "font/woff", ".pdf": "application/pdf",
  ".xml": "application/xml", ".txt": "text/plain", ".json": "application/json", ".webp": "image/webp",
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let file = normalize(join(root, decodeURIComponent(url.pathname)));
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { "content-type": types[".html"] });
    res.end(await readFile(join(root, "404.html")).catch(() => "Not found"));
  }
}).listen(port, () => console.log(`Serving dist/ at http://localhost:${port}`));
