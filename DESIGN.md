# Design system

A professional portfolio designed by the person who built Memora, not Memora's menu pasted onto a CV. Every token below comes from Memora's own interface system ("thin geometry, soft colour, musical motion") and is adapted for reading, scanning and accessibility.

**North star:** *one identity, proven twice.* Every page should leave the reader sure Dae is a Business Analyst, and surprised by how far he can take a system himself.

## Colour

| Token | Light | Dark | Use | Contrast on paper |
|---|---|---|---|---|
| `--paper` | `#FCFBFF` | `#12141F` | page background (Memora "paper") | |
| `--surface` | `#FFFFFF` | `#181B29` | buttons, decision boxes, footer | |
| `--lavender` | `#F1EEFC` | `#1F2236` | highlight surfaces, "analyst's view" blocks | |
| `--line` | `#C4C6E9` | `#363B5A` | decorative hairlines | decorative only |
| `--line-strong` | `#8F93BF` | `#6A7098` | control borders (non-text 3:1) | 3:1 |
| `--ink` | `#303953` | `#E9E8F7` | body text (Memora "ink") | 11.1:1 |
| `--muted` | `#555E79` | `#AAB0CC` | secondary text | 6.3:1 |
| `--accent` | `#8377DC` | `#A99FF0` | glyphs, rules, large display text only | 3.6:1 (large text only) |
| `--accent-ink` | `#5B4DB5` | `#BDB4F7` | links, small accent text | 6.4:1 |

**Rule:** one accent. Memora's aqua, pink and yellow character accents are *not* used, because a portfolio needs one voice.

## Typography

| Role | Face | Notes |
|---|---|---|
| Display (h1–h3), labels, buttons | **Poppins** 300/400/500, self-hosted Latin subset (~10 KB each) | Geometric substitute for Memora's Century Gothic display voice |
| Body, data | System UI stack, led by **Segoe UI** | Memora uses Segoe UI for dialogue and numbers. The system stack costs zero bytes |
| Labels / eyebrows | Poppins 400, uppercase, 0.14–0.18 em tracking | Memora's spaced section headings ("01 BUTTONS & STATES") |

Fluid scale from `--step--1` (≈13 px) to `--step-4` (≈64 px) with `clamp()`. Line length is capped at 68ch.

## Space and layout

- 4 px base unit (Memora's), exposed as `--s-1` … `--s-9`.
- Gutters `clamp(16px, 5vw, 64px)`. 64 px is Memora's margin token.
- Content max width 76 rem. Case-study prose at 68ch, with diagrams and tables allowed wider.
- Asymmetric hero (1.55 : 1). Rows and hairlines instead of cards. No bento grids.

## Glyph system

`src/components/glyph.ts`. Each glyph has **one meaning**, is drawn on a 24-unit grid at a 1.35 stroke, and uses `currentColor`. Glyphs are decorative (`aria-hidden`) unless given a label.

| Glyph | Shape | Meaning |
|---|---|---|
| `profile` | open ring with a gap and a detached diamond | who I am |
| `analysis` | diamond with a centre point (flowchart decision) | requirements, research, process |
| `engineering` | camera brackets around a block | software, architecture, tooling |
| `data` | bars | data, APIs, analysis |
| `project` | camera corners and a crosshair | a framed piece of work |
| `featured` | four-point spark | the one thing to look at first |
| `contact` | a line reaching a diamond endpoint | get in touch |
| `arrow`, `external`, `download` | functional | navigation |

## Signature details

- **Numbered sections** (`01`, `02`…) in the eyebrow and in case-study h2s. They double as a table of contents.
- **Camera-corner frames** (`.frame`) mark *evidence*: diagrams, measurements, the at-a-glance facts. They are never used as decoration.
- **Button accent rule:** a short accent line on the upper-left edge of buttons and decision boxes, taken from Memora's button family.
- **Diamond list separators** in technology lists.

## Motion

- Hover 140 ms and panel 280 ms (Memora tokens), eased with `cubic-bezier(.22,.61,.36,1)`.
- One ambient motif: the aperture ring draws once and rotates slowly. It's hidden on small screens.
- Nothing gates content. No scroll-triggered reveals.
- `prefers-reduced-motion: reduce` disables all animation and transitions.

## Responsive behaviour

| Width | Behaviour |
|---|---|
| < 40 rem (≈640 px) | Navigation wraps under the name. Hero stacks. The home-page diagram is hidden (the case study has it). |
| < 60 rem | Aperture hidden. Hero and featured project stack. |
| ≥ 52 rem | Work rows gain a third column (tags and stack) and an arrow. |
| ≥ 64 rem | Case studies gain a sticky table of contents. |
| Any | Diagrams keep a 600 px minimum and scroll sideways inside a focusable region rather than shrinking text below legibility. |

## Accessibility

Semantic landmarks, skip link, one h1 per page, labelled regions, visible 2 px focus rings, `aria-current` in navigation, SVG diagrams with `<title>` and `<desc>` plus prose captions, forced-colours fallbacks, and a print stylesheet (the CV prints to two A4 pages).
