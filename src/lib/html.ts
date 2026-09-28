/**
 * Minimal, dependency-free HTML templating.
 *
 * `html` is a tagged template: interpolated strings are escaped, arrays are
 * joined, and values wrapped in `raw()` (or produced by another `html` call)
 * are inserted as-is. This keeps every page a plain function that returns a
 * string, with no framework or runtime JavaScript.
 */

export class SafeHtml {
  readonly value: string;
  constructor(value: string) {
    this.value = value;
  }
  toString(): string {
    return this.value;
  }
}

export type Renderable = SafeHtml | string | number | boolean | null | undefined | Renderable[];

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escape(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

export function raw(value: string): SafeHtml {
  return new SafeHtml(value);
}

function render(value: Renderable): string {
  if (value === null || value === undefined || value === false || value === true) return "";
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(render).join("");
  return escape(String(value));
}

export function html(strings: TemplateStringsArray, ...values: Renderable[]): SafeHtml {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return new SafeHtml(out);
}

/** Join class names, skipping falsy entries. */
export function cx(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(" ");
}
