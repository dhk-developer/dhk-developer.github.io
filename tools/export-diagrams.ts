/** Writes every diagram as a standalone .svg (fixed colours, light/dark aware). node tools/export-diagrams.ts <outDir> */
import { mkdirSync, writeFileSync } from "node:fs";
import { DIAGRAMS } from "../src/components/diagrams.ts";
const outDir = process.argv[2] ?? "dist/diagrams";
mkdirSync(outDir, { recursive: true });
for (const [name, fn] of Object.entries(DIAGRAMS)) writeFileSync(`${outDir}/${name}.svg`, fn(true));
console.log(`Wrote ${Object.keys(DIAGRAMS).length} diagrams to ${outDir}`);
