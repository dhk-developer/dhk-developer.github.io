import { Marked, type Tokens } from "../../vendor/marked/marked.esm.js";

export interface Heading {
  depth: number;
  text: string;
  id: string;
  index?: string;
}

export interface RenderedMarkdown {
  html: string;
  headings: Heading[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Render case-study Markdown.
 * - h2 headings are numbered (01, 02…) in Memora's section-index style and collected for the table of contents.
 * - Tables are wrapped so they scroll inside their own box on narrow screens.
 * - External links open normally (no target=_blank) but are marked for styling.
 * Raw HTML in the source is trusted: content is authored in this repository.
 */
export function renderMarkdown(source: string): RenderedMarkdown {
  const headings: Heading[] = [];
  const used = new Set<string>();
  let h2 = 0;

  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading(this: { parser: { parseInline(tokens: Tokens.Generic[]): string } }, token: Tokens.Heading) {
        const inner = this.parser.parseInline(token.tokens);
        let id = slugify(token.text) || "section";
        while (used.has(id)) id += "-";
        used.add(id);
        if (token.depth === 2) {
          h2 += 1;
          const index = String(h2).padStart(2, "0");
          headings.push({ depth: 2, text: token.text, id, index });
          return `<h2 id="${id}"><span class="h-index" aria-hidden="true">${index}</span>${inner}</h2>\n`;
        }
        if (token.depth === 3) headings.push({ depth: 3, text: token.text, id });
        return `<h${token.depth} id="${id}">${inner}</h${token.depth}>\n`;
      },
      table(this: { parser: { parseInline(tokens: Tokens.Generic[]): string } }, token: Tokens.Table) {
        const cell = (c: Tokens.TableCell, tag: "th" | "td") => {
          const align = c.align ? ` style="text-align:${c.align}"` : "";
          const scope = tag === "th" ? ' scope="col"' : "";
          return `<${tag}${align}${scope}>${this.parser.parseInline(c.tokens)}</${tag}>`;
        };
        const head = `<tr>${token.header.map((c) => cell(c, "th")).join("")}</tr>`;
        const body = token.rows.map((r) => `<tr>${r.map((c) => cell(c, "td")).join("")}</tr>`).join("\n");
        return `<div class="table-wrap" tabindex="0" role="region" aria-label="Table"><table><thead>${head}</thead><tbody>${body}</tbody></table></div>\n`;
      },
      link(this: { parser: { parseInline(tokens: Tokens.Generic[]): string } }, token: Tokens.Link) {
        const text = this.parser.parseInline(token.tokens);
        const external = /^https?:\/\//.test(token.href);
        const title = token.title ? ` title="${token.title}"` : "";
        return `<a href="${token.href}"${title}${external ? ' class="ext" rel="noopener"' : ""}>${text}</a>`;
      },
    },
  });

  const out = marked.parse(source, { async: false }) as string;
  return { html: out, headings };
}
