/**
 * Accurate, hand-authored diagrams as inline SVG.
 *
 * Inline (rather than <img>) so they inherit the page's colour tokens, dark mode
 * and fonts, and stay crisp at any size. Every diagram has a <title> and <desc>
 * for assistive tech; the surrounding <figcaption> explains it in prose.
 *
 * `standalone: true` swaps CSS classes for fixed colours so the same drawing
 * can be exported as an .svg file (used by the Memora showcase repository).
 *
 * Diagrams describe concepts. Names are conceptual, not production class names.
 */

type Pt = [number, number];

interface Ctx {
  id: string;
  parts: string[];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function box(c: Ctx, x: number, y: number, w: number, h: number, title: string, sub: string[] = [], accent = false): void {
  c.parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="${accent ? "d-box-accent" : "d-box"}" stroke-width="1"/>`);
  // Memora button grammar: short accent rule on the top-left edge
  c.parts.push(`<path d="M${x + 10} ${y} h16" class="d-accent" stroke-width="2"/>`);
  const lines = [title, ...sub];
  const lh = 15;
  const top = y + h / 2 - ((lines.length - 1) * lh) / 2 + 4;
  lines.forEach((t, i) => {
    const cls = i === 0 ? ' font-weight="600"' : ' class="d-muted"';
    c.parts.push(`<text x="${x + w / 2}" y="${top + i * lh}" text-anchor="middle" font-size="${i === 0 ? 12.5 : 11.5}"${cls}>${esc(t)}</text>`);
  });
}

function arrow(c: Ctx, points: Pt[], opts: { dashed?: boolean; accent?: boolean } = {}): void {
  const d = points.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join(" ");
  const cls = opts.accent ? "d-accent" : "d-line";
  c.parts.push(`<path d="${d}" class="${cls}" fill="none" stroke-width="1.3"${opts.dashed ? ' stroke-dasharray="4 4"' : ""} marker-end="url(#${c.id}-head${opts.accent ? "-a" : ""})"/>`);
}

function label(c: Ctx, x: number, y: number, text: string, anchor: "start" | "middle" | "end" = "start"): void {
  c.parts.push(`<text x="${x}" y="${y}" text-anchor="${anchor}" class="d-label">${esc(text.toUpperCase())}</text>`);
}

function note(c: Ctx, x: number, y: number, text: string, anchor: "start" | "middle" | "end" = "start", size = 11.5): void {
  c.parts.push(`<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" class="d-muted">${esc(text)}</text>`);
}

function diamond(c: Ctx, x: number, y: number, r: number, filled = true): void {
  c.parts.push(`<path d="M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z" class="${filled ? "d-accent-fill" : ""} d-accent" fill="${filled ? "" : "none"}" stroke-width="1.3"/>`);
}

const STANDALONE_STYLE = `<style>
text{font-family:'Segoe UI',system-ui,-apple-system,sans-serif;fill:#303953}
.d-muted{fill:#555e79}.d-line{stroke:#8f93bf}.d-accent{stroke:#8377dc}.d-accent-fill{fill:#8377dc}
.d-box{fill:#ffffff;stroke:#8f93bf}.d-box-accent{fill:#f1eefc;stroke:#8377dc}
.d-label{font-family:'Poppins','Century Gothic',system-ui,sans-serif;letter-spacing:.12em;font-size:11px;fill:#555e79}
@media (prefers-color-scheme:dark){text{fill:#e9e8f7}.d-muted,.d-label{fill:#aab0cc}.d-box{fill:#181b29;stroke:#6a7098}.d-box-accent{fill:#1f2236;stroke:#a99ff0}.d-line{stroke:#6a7098}.d-accent{stroke:#a99ff0}.d-accent-fill{fill:#a99ff0}}
</style><rect width="100%" height="100%" fill="#fcfbff"/>`;

function wrap(c: Ctx, w: number, h: number, title: string, desc: string, standalone: boolean): string {
  const defs = `<defs>
<marker id="${c.id}-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5 9 5 1 8.5" fill="none" class="d-line" stroke-width="1.4"/></marker>
<marker id="${c.id}-head-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5 9 5 1 8.5" fill="none" class="d-accent" stroke-width="1.4"/></marker>
</defs>`;
  const ns = standalone ? ' xmlns="http://www.w3.org/2000/svg"' : "";
  return `<svg${ns} class="diagram" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${c.id}-t ${c.id}-d"><title id="${c.id}-t">${esc(title)}</title><desc id="${c.id}-d">${esc(desc)}</desc>${standalone ? STANDALONE_STYLE : ""}${defs}${c.parts.join("")}</svg>`;
}

/* ------------------------------------------------------------------------ */

function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
}

function lineAt(center: Pt, deg: number, half: number): [Pt, Pt] {
  const r = (deg * Math.PI) / 180;
  const dx = Math.cos(r) * half;
  const dy = Math.sin(r) * half;
  return [
    [center[0] - dx, center[1] - dy],
    [center[0] + dx, center[1] + dy],
  ];
}

/** Memora: judgement contract vs presentation. */
export function judgementContract(standalone = false): string {
  const c: Ctx = { id: "dj", parts: [] };
  label(c, 20, 26, "What the player sees");
  label(c, 470, 26, "What is judged");

  // Judgement line at three moments (ghosts earlier, solid at the hit beat)
  const hit: Pt = [250, 222];
  const states: Array<{ center: Pt; deg: number; op: number; text: string }> = [
    { center: [190, 88], deg: 8, op: 0.35, text: "t − 1 beat" },
    { center: [214, 150], deg: -2, op: 0.6, text: "t − ½ beat" },
    { center: hit, deg: -12, op: 1, text: "hit beat t" },
  ];
  for (const s of states) {
    const [a, b] = lineAt(s.center, s.deg, 112);
    c.parts.push(`<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}" stroke="currentColor" stroke-opacity="${s.op}" stroke-width="${s.op === 1 ? 2.2 : 1.4}"/>`);
    note(c, b[0] + 8, b[1] + 4, s.text);
  }

  // Note approach path (presentation), authored with keyframes and easing
  const p0: Pt = [34, 312];
  const p1: Pt = [40, 170];
  const p2: Pt = [150, 330];
  const p3: Pt = hit;
  c.parts.push(`<path d="M${p0[0]} ${p0[1]}C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}" fill="none" class="d-accent" stroke-width="1.5" stroke-dasharray="5 5"/>`);
  for (const t of [0.2, 0.45, 0.7]) {
    const [x, y] = bezier(p0, p1, p2, p3, t);
    const [x2, y2] = bezier(p0, p1, p2, p3, t + 0.01);
    const ang = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    c.parts.push(`<rect x="${(x - 11).toFixed(1)}" y="${(y - 4).toFixed(1)}" width="22" height="8" rx="2" class="d-box-accent" stroke-width="1.2" transform="rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" opacity="${(0.45 + t * 0.6).toFixed(2)}"/>`);
  }
  note(c, 56, 330, "approach path: keyframes, easing, scale, opacity");

  // Hit point: fixed by the contract
  c.parts.push(`<circle cx="${hit[0]}" cy="${hit[1]}" r="11" fill="none" class="d-accent" stroke-width="1.3"/>`);
  diamond(c, hit[0], hit[1], 4.5);
  note(c, hit[0] + 4, hit[1] + 32, "hit point", "middle");

  // Connector to the contract
  arrow(c, [[hit[0] + 16, hit[1] + 8], [400, 250], [462, 150]], { accent: true, dashed: true });

  // Contract box
  c.parts.push(`<rect x="470" y="44" width="275" height="164" rx="4" class="d-box-accent" stroke-width="1"/>`);
  c.parts.push(`<path d="M480 44h16" class="d-accent" stroke-width="2"/>`);
  const rows: Array<[string, string]> = [
    ["Beat", "32.0, from the chart"],
    ["Target", "line L2 at position 0.62"],
    ["Action", "tap"],
    ["Perfect", "within ±100 ms"],
    ["Great", "within ±250 ms"],
  ];
  rows.forEach(([k, v], i) => {
    const y = 74 + i * 28;
    c.parts.push(`<text x="486" y="${y}" font-size="12.5" font-weight="600">${esc(k)}</text>`);
    c.parts.push(`<text x="556" y="${y}" font-size="12.5">${esc(v)}</text>`);
  });

  c.parts.push(`<rect x="470" y="226" width="275" height="104" rx="4" class="d-box" stroke-width="1" stroke-dasharray="4 3"/>`);
  label(c, 486, 250, "Free to change");
  ["approach keys and easing", "line motion between hits", "layers, effects, camera", "visual-only notes (never judged)"].forEach((t, i) =>
    note(c, 486, 272 + i * 17, "· " + t, "start", 12),
  );

  return wrap(
    c,
    760,
    345,
    "Judgement contract versus presentation",
    "A judgement line moves and rotates over one beat while a note follows a curved, animated approach path. At the hit beat the note arrives exactly at a hit point that the chart defines: a beat, a target and an action with fixed timing windows. Approach animation, line motion, effects and visual-only notes can change freely without changing that contract.",
    standalone,
  );
}

/** Memora: authoring → runtime pipeline. */
export function pipeline(standalone = false): string {
  const c: Ctx = { id: "dp", parts: [] };
  label(c, 20, 20, "Shared data path");
  // save loop above the row
  c.parts.push(`<path d="M386 58V36H80V56" fill="none" class="d-line" stroke-width="1.3" stroke-dasharray="4 4" marker-end="url(#dp-head)"/>`);
  note(c, 233, 31, "save, with preflight checks", "middle", 11);
  box(c, 20, 58, 120, 58, "Chart file", ["readable JSON"]);
  box(c, 168, 58, 130, 58, "Load", ["compatibility,", "normalisation"]);
  box(c, 326, 58, 120, 58, "Chart model", ["stable IDs"]);
  box(c, 474, 58, 120, 58, "Indexes", ["revisioned caches"]);
  box(c, 622, 58, 120, 58, "Evaluators", ["beat → state"], true);
  arrow(c, [[140, 87], [166, 87]]);
  arrow(c, [[298, 87], [324, 87]]);
  arrow(c, [[446, 87], [472, 87]]);
  arrow(c, [[594, 87], [620, 87]]);

  label(c, 20, 160, "Authoring (editor only)");
  box(c, 20, 176, 160, 88, "Charting editor", ["timeline · layers", "phrase library", "audio + waveform"]);
  box(c, 212, 176, 150, 56, "Edit transactions", ["typed edits · undo"]);
  arrow(c, [[180, 204], [210, 204]]);
  arrow(c, [[320, 176], [370, 118]]);
  arrow(c, [[362, 196], [520, 196], [520, 118]], { dashed: true });
  note(c, 440, 190, "invalidate what changed", "middle", 11);

  box(c, 474, 222, 120, 56, "Editor preview", ["any beat, any seek"]);
  box(c, 622, 222, 120, 56, "Gameplay", ["DSP-clocked"]);
  arrow(c, [[682, 116], [682, 220]], { accent: true });
  arrow(c, [[650, 116], [560, 220]], { accent: true });
  note(c, 700, 170, "same", "start", 11);
  note(c, 700, 184, "answer", "start", 11);
  arrow(c, [[474, 256], [182, 256]], { dashed: true });
  note(c, 330, 250, "drawn in the editor", "middle", 11);

  box(c, 474, 312, 120, 56, "Renderers", ["notes · effects"]);
  box(c, 622, 312, 120, 56, "Judgement", ["input → score"]);
  arrow(c, [[682, 278], [682, 310]]);
  arrow(c, [[650, 278], [566, 310]]);

  return wrap(
    c,
    760,
    380,
    "Authoring to runtime pipeline",
    "A chart file is loaded through compatibility checks into a chart model with stable IDs. Revisioned indexes feed shared evaluators that turn a beat into state. The same evaluators drive both the editor preview and gameplay, which feeds judgement and the renderers. Editor changes go through typed edit transactions that invalidate only affected caches, and saving runs preflight checks.",
    standalone,
  );
}

/** Memora: timing chain and judgement windows. */
export function timing(standalone = false): string {
  const c: Ctx = { id: "dt", parts: [] };
  label(c, 20, 22, "Where song time comes from");
  box(c, 20, 40, 140, 58, "Audio DSP clock", ["not frame time"], true);
  box(c, 190, 40, 250, 58, "songTime = dspNow − start", ["− chart offset − device calibration"]);
  box(c, 466, 40, 150, 58, "Beat", ["songTime × BPM ÷ 60"]);
  box(c, 640, 40, 100, 58, "Sample", ["lines, targets"]);
  arrow(c, [[160, 69], [188, 69]], { accent: true });
  arrow(c, [[440, 69], [464, 69]]);
  arrow(c, [[616, 69], [638, 69]]);

  label(c, 20, 150, "Judging one tap (default windows)");
  const x0 = 60;
  const x1 = 700;
  const mid = (x0 + x1) / 2;
  const scale = (x1 - x0) / 700; // 700 ms across → ±350 ms
  const y = 230;
  const great = 250 * scale;
  const perfect = 100 * scale;
  c.parts.push(`<rect x="${mid - great}" y="${y - 26}" width="${great * 2}" height="52" rx="3" class="d-box" stroke-width="1"/>`);
  c.parts.push(`<rect x="${mid - perfect}" y="${y - 26}" width="${perfect * 2}" height="52" rx="3" class="d-box-accent" stroke-width="1"/>`);
  c.parts.push(`<path d="M${x0} ${y}H${x1}" class="d-line" stroke-width="1"/>`);
  for (const ms of [-300, -200, -100, 0, 100, 200, 300]) {
    const x = mid + ms * scale;
    c.parts.push(`<path d="M${x} ${y + 30}v6" class="d-line" stroke-width="1"/>`);
    note(c, x, y + 50, ms === 0 ? "note time" : `${ms > 0 ? "+" : "−"}${Math.abs(ms)} ms`, "middle", 11);
  }
  note(c, mid, y - 34, "Perfect ±100 ms", "middle", 11.5);
  note(c, mid - great + 8, y - 34, "Great ±250 ms", "start", 11.5);
  note(c, x0, y - 34, "Miss", "start", 11.5);
  note(c, x1, y - 34, "Miss", "end", 11.5);
  for (const [ms, label2] of [[-38, "Perfect"], [172, "Great"]] as Array<[number, string]>) {
    const x = mid + ms * scale;
    diamond(c, x, y, 5);
    note(c, x, y + 16, label2, "middle", 10.5);
  }

  return wrap(
    c,
    760,
    300,
    "Timing chain and judgement windows",
    "Song time is read from the audio DSP clock relative to a scheduled start, minus the chart's offset and the player's calibrated device offset. It is converted to beats to sample line and target state. A tap is compared with the note's time: within 100 milliseconds is Perfect, within 250 milliseconds is Great, and anything outside is a Miss.",
    standalone,
  );
}

/** Memora: measured editor performance, before vs after (repaint ms, lower is better). */
export function perfChart(standalone = false): string {
  const c: Ctx = { id: "dq", parts: [] };
  const data: Array<[string, number, number]> = [
    ["Chart A · beat 56", 47.28, 11.47],
    ["Chart B · beat 60", 74.59, 15.6],
    ["Chart C · beat 142", 119.83, 14.9],
    ["Chart C · beat 296", 121.38, 12.87],
  ];
  const x0 = 200;
  const max = 130;
  const w = 520;
  const sx = (v: number) => (v / max) * w;
  label(c, 20, 22, "Mean editor repaint, ms (lower is better)");
  // legend
  c.parts.push(`<rect x="440" y="12" width="14" height="8" rx="1" class="d-box" stroke-width="1"/>`);
  note(c, 460, 20, "before", "start", 11);
  c.parts.push(`<rect x="520" y="12" width="14" height="8" rx="1" class="d-accent-fill"/>`);
  note(c, 540, 20, "after", "start", 11);
  // 16.7 ms reference (60 fps frame budget)
  const ref = x0 + sx(16.7);
  c.parts.push(`<path d="M${ref} 38V${38 + data.length * 58}" class="d-accent" stroke-width="1" stroke-dasharray="2 3"/>`);
  note(c, ref + 4, 38 + data.length * 58 + 14, "16.7 ms ≈ one 60 fps frame", "start", 10.5);
  data.forEach(([name, before, after], i) => {
    const y = 44 + i * 58;
    c.parts.push(`<text x="${x0 - 12}" y="${y + 16}" text-anchor="end" font-size="12">${esc(name)}</text>`);
    c.parts.push(`<rect x="${x0}" y="${y}" width="${sx(before).toFixed(1)}" height="14" rx="1.5" class="d-box" stroke-width="1"/>`);
    note(c, x0 + sx(before) + 6, y + 11, before.toFixed(1), "start", 11);
    c.parts.push(`<rect x="${x0}" y="${y + 18}" width="${sx(after).toFixed(1)}" height="14" rx="1.5" class="d-accent-fill"/>`);
    note(c, Math.max(x0 + sx(after) + 6, ref + 6), y + 29, after.toFixed(1), "start", 11);
  });
  return wrap(
    c,
    760,
    300,
    "Editor repaint time before and after the optimisation",
    "Mean repaint time fell from 47.3 to 11.5 ms on chart A at beat 56, from 74.6 to 15.6 ms on chart B at beat 60, from 119.8 to 14.9 ms on chart C at beat 142, and from 121.4 to 12.9 ms on chart C at beat 296. After the change, three of the four sections sit under the 16.7 millisecond frame budget.",
    standalone,
  );
}

/** Memora: phrase / preset compilation. */
export function presets(standalone = false): string {
  const c: Ctx = { id: "dr", parts: [] };
  label(c, 20, 22, "Library");
  box(c, 20, 40, 214, 104, "Phrase preset · v3", ["records with local IDs a, b, c", "typed parameters: count, spacing", "port: target line"]);
  label(c, 262, 22, "Apply (one undo step)");
  box(c, 262, 40, 250, 104, "Compile", ["remap IDs → unique in this chart", "bind port → chosen line", "validate parameters and dependencies"], true);
  label(c, 540, 22, "Chart");
  box(c, 540, 40, 200, 104, "Independent records", ["ordinary, editable chart data", "instance pinned to v3"]);
  arrow(c, [[234, 92], [260, 92]]);
  arrow(c, [[512, 92], [538, 92]], { accent: true });

  box(c, 20, 196, 214, 64, "Phrase preset · v4", ["library edited later"]);
  arrow(c, [[127, 144], [127, 194]], { dashed: true });
  box(c, 540, 196, 200, 64, "Chart unchanged", ["until the author re-applies"]);
  arrow(c, [[234, 228], [538, 228]], { dashed: true });
  note(c, 386, 220, "no silent changes · local edits block re-apply", "middle");
  return wrap(
    c,
    760,
    280,
    "Phrase presets compile to independent chart records",
    "A library phrase preset holds records with local IDs, typed parameters and ports. Applying it is a single undoable step that remaps IDs so they are unique in the chart, binds ports to chosen lines and validates parameters. The result is ordinary editable chart data pinned to the preset version. Later library versions never change a finished chart silently; re-applying is explicit and blocked if the author made local edits.",
    standalone,
  );
}

/** DesktopIdle: state machine. */
export function desktopIdleStates(standalone = false): string {
  const c: Ctx = { id: "dd", parts: [] };
  box(c, 20, 30, 140, 70, "Watching", ["poll every 250 ms"]);
  box(c, 206, 30, 170, 70, "Engaged?", ["excluded app · fullscreen", "video actually playing"]);
  box(c, 440, 30, 150, 70, "Enter ambient", ["minimise · mask cursor", "taskbar auto-hide"], true);
  box(c, 620, 30, 120, 70, "Ambient", ["grace window first"]);
  box(c, 440, 200, 150, 64, "Restore", ["windows, taskbar"]);
  arrow(c, [[160, 65], [204, 65]]);
  arrow(c, [[376, 65], [438, 65]]);
  note(c, 408, 118, "no, and", "middle", 10.5);
  note(c, 408, 132, "idle ≥ N s", "middle", 10.5);
  arrow(c, [[590, 65], [618, 65]]);
  arrow(c, [[680, 100], [680, 232], [592, 232]], { accent: true });
  note(c, 635, 150, "cursor moved", "middle", 10.5);
  note(c, 635, 164, "≥ 100 px after", "middle", 10.5);
  note(c, 635, 178, "grace window", "middle", 10.5);
  arrow(c, [[440, 232], [90, 232], [90, 102]]);
  arrow(c, [[291, 100], [291, 150], [92, 150]], { dashed: true });
  note(c, 200, 166, "yes: keep watching", "middle", 10.5);
  return wrap(
    c,
    760,
    280,
    "DesktopIdle state machine",
    "The app watches system idle time. If the user is engaged, meaning an excluded app is focused, an app is fullscreen, or a video is actually playing, it keeps watching. Otherwise, after N idle seconds it enters ambient mode: minimising windows, masking the cursor and auto-hiding the taskbar. A grace window ignores the input these actions generate. Moving the cursor at least 100 pixels after the grace window restores windows and the taskbar and returns to watching.",
    standalone,
  );
}

/** Riot data study pipeline. */
export function riotPipeline(standalone = false): string {
  const c: Ctx = { id: "dl", parts: [] };
  label(c, 20, 22, "2024 data (Riot Games API)");
  box(c, 20, 40, 146, 64, "Top-ladder players", ["≈300 accounts"]);
  box(c, 190, 40, 110, 64, "Match IDs", ["per player"]);
  box(c, 324, 40, 150, 64, "Match detail", ["participant-level JSON"]);
  box(c, 498, 40, 150, 64, "Team features", ["blue side, 2020 schema"], true);
  arrow(c, [[166, 72], [188, 72]]);
  arrow(c, [[300, 72], [322, 72]]);
  arrow(c, [[474, 72], [496, 72]]);
  c.parts.push(`<rect x="190" y="120" width="284" height="32" rx="4" class="d-box" stroke-width="1" stroke-dasharray="4 3"/>`);
  note(c, 332, 141, "100 calls / 2 min → throttle + JSON cache", "middle", 11);

  label(c, 20, 196, "2020 data (public dataset)");
  box(c, 20, 214, 170, 58, "≈9,900 ranked games", ["first 10 minutes only"]);
  box(c, 214, 214, 190, 58, "Clean", ["drop redundant, collinear"]);
  box(c, 620, 214, 120, 58, "MySQL", ["one table per year"]);
  arrow(c, [[190, 243], [212, 243]]);
  arrow(c, [[404, 243], [618, 243]]);
  arrow(c, [[648, 72], [680, 72], [680, 212]]);
  box(c, 420, 304, 320, 52, "Compare", ["correlation with winning, 2020 vs 2024"], true);
  arrow(c, [[680, 272], [680, 302]]);
  return wrap(
    c,
    760,
    370,
    "Riot data study pipeline",
    "For 2024 data, about 300 top-ladder accounts lead to match IDs and then match details from the Riot Games API, throttled and cached to respect a limit of 100 calls per 2 minutes. Participant data is reshaped into blue-side team features matching the 2020 schema. The 2020 public dataset of about 9,900 games, covering the first ten minutes only, is cleaned of redundant and collinear columns. Both are loaded into MySQL, one table per year, and compared for correlation with winning.",
    standalone,
  );
}

export const DIAGRAMS: Record<string, (standalone?: boolean) => string> = {
  "judgement-contract": judgementContract,
  pipeline,
  timing,
  "perf-chart": perfChart,
  presets,
  "desktop-idle-states": desktopIdleStates,
  "riot-pipeline": riotPipeline,
};

/** Replace `<!-- diagram:name -->` markers in rendered HTML. */
export function injectDiagrams(htmlText: string): string {
  return htmlText.replace(/<!--\s*diagram:([a-z0-9-]+)\s*-->/g, (_, name: string) => {
    const fn = DIAGRAMS[name];
    if (!fn) throw new Error(`Unknown diagram: ${name}`);
    return `<div class="fig-scroll" tabindex="0" role="region" aria-label="Diagram (scrolls sideways on small screens)">${fn(false)}</div>`;
  });
}
