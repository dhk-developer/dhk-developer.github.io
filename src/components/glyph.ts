import { html, raw, type SafeHtml } from "../lib/html.ts";

/**
 * Glyph system.
 *
 * Derived from Memora's interface grammar: thin strokes, open rings with a
 * deliberate gap, detached diamond endpoints and a four-point spark. Every
 * glyph carries one meaning and is used only for that meaning:
 *
 *   profile      open "memory" ring                  → who I am / about
 *   analysis     diamond, the flowchart decision mark → requirements, research, process
 *   engineering  bracketed block, a component         → software, architecture, tooling
 *   data         bars                                  → data, APIs, analysis
 *   project      camera corners around a point         → a framed piece of work
 *   featured     four-point spark                      → the one thing to look at first
 *   contact      line reaching a diamond endpoint      → get in touch
 *   arrow        line with an open chevron             → navigation
 *   external     arrow leaving a corner                → leaves this site
 *
 * All glyphs are 24×24, stroke-only (except the spark), and use currentColor
 * so they inherit text colour, dark mode and forced-colour modes.
 */

export type GlyphName =
  | "profile"
  | "analysis"
  | "engineering"
  | "data"
  | "project"
  | "featured"
  | "contact"
  | "arrow"
  | "external"
  | "download";

const PATHS: Record<GlyphName, string> = {
  profile:
    '<path d="M17.3 6.2A8 8 0 1 0 19.9 11"/><path d="M19.6 5.1 21 6.5 19.6 7.9 18.2 6.5Z" class="g-fill"/>',
  analysis: '<path d="M12 3.5 20.5 12 12 20.5 3.5 12Z"/><circle cx="12" cy="12" r="1.2" class="g-fill"/>',
  engineering:
    '<path d="M4 8.5V4h4.5M15.5 4H20v4.5M20 15.5V20h-4.5M8.5 20H4v-4.5"/><rect x="9" y="9" width="6" height="6" class="g-fill"/>',
  data: '<path d="M5 10v4M8.5 7.5v9M12 9.5v5M15.5 5v14M19 10.5v3"/>',
  project:
    '<path d="M3.5 8V3.5H8M16 3.5h4.5V8M20.5 16v4.5H16M8 20.5H3.5V16"/><path d="M12 9.5v5M9.5 12h5"/>',
  featured:
    '<path d="M12 2.5c.5 5.6 3.9 9 9.5 9.5-5.6.5-9 3.9-9.5 9.5-.5-5.6-3.9-9-9.5-9.5 5.6-.5 9-3.9 9.5-9.5Z" class="g-fill"/>',
  contact: '<path d="M3 12h12.5"/><path d="M18 9.5 20.5 12 18 14.5 15.5 12Z"/>',
  arrow: '<path d="M4 12h15"/><path d="m14.5 7.5 4.5 4.5-4.5 4.5"/>',
  external: '<path d="M7 17 17 7"/><path d="M9 7h8v8"/>',
  download: '<path d="M12 4v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M5 19.5h14"/>',
};

export interface GlyphOptions {
  /** Accessible name. Omit for decorative use (the default): the glyph is then hidden from assistive tech. */
  label?: string;
  size?: number;
  className?: string;
}

export function glyph(name: GlyphName, options: GlyphOptions = {}): SafeHtml {
  const size = options.size ?? 20;
  const a11y = options.label
    ? raw(`role="img" aria-label="${options.label.replace(/"/g, "&quot;")}"`)
    : raw('aria-hidden="true" focusable="false"');
  return html`<svg class="glyph glyph-${name}${options.className ? " " + options.className : ""}" ${a11y} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${raw(PATHS[name])}</svg>`;
}

/** Glyph for a lens used in project filtering. */
export const LENS_GLYPH = {
  analysis: "analysis",
  engineering: "engineering",
  data: "data",
} as const satisfies Record<string, GlyphName>;
