## Context

Memora is an independent game I've been building since late 2025: a rhythm game in the style of Phigros and Arcaea, joined to a visual-novel story. I'm the sole designer and developer. It is built in Unity 6 and C#, and runs on Android, iOS and Windows.

Rhythm games in this style don't use a fixed track. Judgement lines move, rotate, appear and disappear, and the chart is choreographed like a music video. I wanted to take that further: notes that float free of lines, notes that fly into *other* notes, targets that move before you hit them, and a full layer of effects that respond to the music.

This page covers the engineering behind it: the decisions, the trade-offs and what I measured. The source code is private. The [public showcase repository](https://github.com/dhk-developer/memora-showcase) has architecture notes, diagrams and a small clean-room code sample.

<div class="brief">
<div><p>Users</p><p><strong>Players</strong> need every note to be readable and fair, whatever the scene is doing. <strong>Chart authors</strong> (me, for now) need to build and preview choreography quickly.</p></div>
<div><p>Core requirement</p><p>Presentation can be as ambitious as the music calls for, and judgement stays deterministic and explainable.</p></div>
<div><p>Scope today</p><p>Rhythm runtime, charting editor, story editor and reader, character and progression systems, calibration, settings.</p></div>
</div>

## The problem

Once lines move, a simple question gets hard: **where and when is this note judged?**

With a fixed track, the answer is one lane and one time. In Memora a note might belong to a line that is rotating, or float in open space. It might be aimed at another note, or at a point that is still moving when the player taps. On top of that, the chart author wants the note's *entrance* to be expressive: a curve, a spiral, a snap on the beat, an overshoot after the hit.

If presentation and judgement share the same data, every visual idea becomes a gameplay risk. An animation that overshoots could move the hit point. A camera shake could shift the target. An effect that lingers could extend a hold.

## Constraints

- **Timing must be deterministic.** The same chart and the same input must give the same judgement on every device and every run.
- **The editor must preview anything, anywhere.** An author scrubs to beat 296 and expects the exact frame the player will see, without replaying the song from the start.
- **Existing charts must keep working.** Each new feature arrives as optional data. Older charts and saves are treated as contracts, not drafts.
- **Mobile performance.** Charts can hold hundreds of notes and continuous effects. Nothing per-frame should scale with the whole chart.
- **One developer.** Each system has to be explainable and testable by one person.

## The core decision: a judgement contract

I split every playable note into two layers that never write to each other.

<figure class="wide frame">
<span class="frame-label">Diagram</span>
<!-- diagram:judgement-contract -->
<figcaption>The line moves and the note takes a curved, animated route. The hit point, beat and timing windows come only from the chart's judgement data.</figcaption>
</figure>

1. **The judgement contract.** A scheduled beat, a target (a line position, a floating point, another note or an authored point), an action (tap, hold, slide or flick) and, where relevant, a duration or anchor path. Input is only ever compared against this.
2. **Presentation.** How the note enters, moves, scales, fades, overshoots and leaves. It is authored as keyframes in *musical* time (beats rather than seconds), so motion can follow phrases and subdivisions.

Three separate resolver paths work out where the note is judged, where its head is drawn, and where its cue line starts, and all three meet at the same hit point. The rule that makes the design work is that **decorative systems cannot move scoring targets.** Camera shake, layers and effects apply after judgement geometry has been resolved.

This also makes a *visual-only* note possible. It is drawn and animated exactly like a real note, but it is never judged, scored, missed or played by autoplay. Authors can use it for fake-outs and flourishes without creating hidden gameplay.

<div class="decision">
<p>Decision</p>
<dl>
<dt>Chose</dt><dd>Two layers per note, with judgement resolved first and presentation layered on top.</dd>
<dt>Instead of</dt><dd>One transform that drives both what you see and what you hit.</dd>
<dt>Trade-off</dt><dd>More data per note, and two paths to keep consistent. In return, any visual idea is safe to try, and "why was that a Miss?" always has a single, inspectable answer.</dd>
</dl>
</div>

## Timing and judgement

Frame time isn't accurate enough for rhythm judgement, and it drifts from the audio. Memora schedules the song on the audio system's DSP clock and derives everything from it.

<figure class="wide frame">
<span class="frame-label">Diagram</span>
<!-- diagram:timing -->
<figcaption>Song time comes from the audio clock, corrected for the chart offset and the player's measured device latency. Default windows are shown and are tunable per chart.</figcaption>
</figure>

- The song starts with a scheduled pre-roll on the audio clock. **Song time is the DSP time since that scheduled start**, minus the chart's audio offset and a per-device calibration offset. Pausing freezes song time.
- Beats come from song time and BPM. Line poses, targets and presentation are all *sampled* at that beat, never integrated frame by frame, so a dropped frame cannot push a line off course.
- Input is multi-touch with per-finger tracking. Flicks need a minimum travel distance and must reset between flicks. Holds and slides are judged while they are held, not only at the start.
- Scoring always sums to exactly 1,000,000 for a full Perfect run: 900,000 for accuracy (Great earns 70%) and 100,000 for combo.

### Measuring device latency

Every phone and headset adds its own delay. The calibration screen plays a continuous four-beat loop and asks for four taps on the accent. Each tap is measured against the scheduled DSP time of its nearest accent. The offset is the mean of the middle two of the four sorted deltas, so a single stray tap can't skew the result. A median-deviation check decides whether the set is reliable, and two conflicting clusters of taps trigger a retry instead of quietly overwriting the saved value. A second finger landing on the same accent is ignored.

<div class="bridge">
<p>The analyst's view</p>
<p>This is acceptance criteria turned into code: "the saved offset must reflect the player's intent, not their worst tap". Writing the rule down first (what counts as reliable, what triggers a retry) made the algorithm obvious.</p>
</div>

## Targets that move

A floating note can be judged at its own position, at **another note's** position, or at an **authored point** that may still be moving before the hit.

The subtle part is *when* a moving target is sampled. If note B is aimed at note A, B must arrive where A's head will be **at B's hit beat**, not where A was at A's own beat. Every target provider has to be a pure function of *(chart, beat, bounds)*. It must never read a live transform, the frame clock or accumulated state. That contract is what lets the editor jump backwards through a chart and get the same answer as playing forwards. Reverse-seek assertions check exactly that.

Notes can approach in one of two modes:

- **Predictive** (the default). The note aims at where its target *will be* at the hit beat. It's readable, and fair when the line is about to move.
- **Adaptive.** The note follows the target's *current* pose. When a line jumps instantly (a teleport), the note gets a correction so it doesn't jump with it. The correction is rebuilt statelessly from a compiled schedule of teleports, so the result never depends on the previous frame or on seek order.

## An editor that can stand anywhere in the song

The charting editor is a custom Unity editor window. It has a timeline and object tree, a gamefield preview, audio and waveform preview, pitch-preserving slowed playback, a layers dock, a phrase library and full undo.

<figure class="wide frame">
<span class="frame-label">Diagram</span>
<!-- diagram:pipeline -->
<figcaption>One set of evaluators turns a beat into state. The editor preview and gameplay both call them and only differ in how they draw the result.</figcaption>
</figure>

The main architectural decision was to **extract shared evaluators** used by both the runtime and the editor preview: target resolution, note approach, scroll distance, choreography geometry, layer composition and the aperture. Earlier on, the preview had its own approximations, and they drifted from gameplay in hit effects, projection and audio response. Each extraction came with parity checks comparing the two.

Seeking to an arbitrary beat without replaying history needed some specific structures:

- **Interval indexes.** An incrementally balanced interval tree finds everything active at a beat. Overlap queries never truncate results.
- **Compact repeat schedules.** Repeated events are stored once and expanded only for the window being queried.
- **A cached scroll-distance integral.** This turns variable scroll speed into distance, prepared once per horizon and invalidated by timing edits.
- **Latest-request-wins seeking.** A newer seek supersedes older pending work, and the preview only publishes a *complete* prepared result, never half a list.

## Performance: a measured fix

With larger charts, editor playback became sluggish. I profiled it rather than guessing. The Frames inspector was **serialising the entire chart four times on every layout pass and four more times on every repaint**, just to take undo snapshots while idle. The fix had three parts:

- Move inspector fields to **typed edit transactions**, so a full undo snapshot is taken only for a real edit.
- **Cache poses, projections and line classifications within a GUI pass**, and invalidate them on beat, viewport or document changes.
- **Stop drawing off-screen timeline rows.**

<figure class="wide frame">
<span class="frame-label">Measured</span>
<!-- diagram:perf-chart -->
<figcaption>Measured at 1× audio playback on a 1800×980 editor with 2 s warm-up and 8 s of measurement per section. These are section averages, not a guarantee for every chart or machine.</figcaption>
</figure>

| Section (start beat) | Preview updates/s, before | after | Mean repaint, before | after |
|---|---:|---:|---:|---:|
| Chart A (56) | 14.8 | 59.6 | 47.3 ms | 11.5 ms |
| Chart B (60) | 9.6 | 56.1 | 74.6 ms | 15.6 ms |
| Chart C (142) | 4.6 | 55.0 | 119.8 ms | 14.9 ms |
| Chart C (296) | 5.0 | 66.5 | 121.4 ms | 12.9 ms |

The fix couldn't be allowed to change what the author sees. 18,125 automated checks compared cached and fresh results across seeks, aspect ratios, edits and undo. Screenshots at identical beats were pixel-identical before and after, and SHA-256 hashes confirmed that no chart file changed.

## Reusable phrases without fragile references

Authors repeat ideas: a stream of notes, a converging pattern, a pair of lines trading a melody. The phrase library stores these as parameterised presets.

<figure class="wide frame">
<span class="frame-label">Diagram</span>
<!-- diagram:presets -->
<figcaption>Presets compile into ordinary chart records. Library changes never reach into finished charts.</figcaption>
</figure>

Applying a preset **compiles** it into ordinary, independent chart records. Internal IDs are remapped to be unique in this chart, and external targets are bound through named ports. Numeric parameters are whitelisted and typed, and imported recipes can't execute code. The whole apply is **one undo step**, and the result is **pinned** to the preset version. If the library changes later, the finished chart doesn't. Re-applying is explicit, and it is refused when the author has edited the copy.

<div class="decision">
<p>Decision</p>
<dl>
<dt>Chose</dt><dd>Compile presets to copies and pin the version.</dd>
<dt>Instead of</dt><dd>Live references from the chart to the library.</dd>
<dt>Trade-off</dt><dd>A library fix doesn't propagate on its own. A finished song can never change without someone deciding it should.</dd>
</dl>
</div>

## Compatibility as a requirement

I treat existing charts and player saves as stakeholders with requirements of their own. Unknown JSON fields, song and episode IDs, and save keys are compatibility contracts. When a feature replaced an old one (for example, gameplay lines now always span the full playfield), the old fields stay readable but dormant rather than being deleted. Data the runtime can't honour yet is protected by a save preflight, so it isn't silently lost.

Story progress uses the same approach. Saves are wrapped in a SHA-256 checksum envelope and written to a pending file, then swapped in with a backup, so a crash mid-write can't corrupt progress. Recovery tries the current file, then the pending file, then the backup. A save from a *newer* schema is never overwritten by an older build.

<div class="bridge">
<p>The analyst's view</p>
<p>In client work, "don't break what people already rely on" is usually the requirement nobody writes down. Here I wrote it down, as explicit contracts with a check in front of every save.</p>
</div>

## Also in the build

- **Story system.** Episodes are written in a custom story editor and compiled to Yarn Spinner bytecode with a content hash. References are validated before anything reaches the reader. Deleting an episode first checks for incoming links, prerequisites and rewards.
- **Music-reactive visuals that respect seeking.** Visualisers read the song's original audio at *chart time* (FFT windows over the PCM data, with a bounded cache) instead of the live output spectrum. Seek order, playback speed and volume therefore can't change what's drawn.
- **Vector UI pipeline.** SVG artwork is tessellated at import into persistent sprite meshes, with a fast path for halftone dot fields. A 350-dot field comes to 9,614 vertices, well inside uGUI's limits.
- **Design system in code.** Colour, spacing and motion tokens are shared by every screen. This website's palette comes from them.

## Verification and known limits

I keep a capability matrix that separates *available*, *partial* and *missing*, so nothing is claimed as finished before it is:

| Capability | Status |
|---|---|
| Tap, hold, slide and flick on lines and in free space | Available |
| Predictive and adaptive approach, per note | Available, with automated checks |
| Multiple independently moving playable lines | Available |
| Reusable phrase presets with pinned versions | Available, with automated checks |
| Variable BPM (tempo maps) | **Missing, deliberately deferred.** It needs one invertible clock across playback, grid, waveform and judgement, and I won't fake it with scroll-speed tricks |
| Layers on playable notes or lines | Reserved in the data model, not connected |
| Performance testing on target mobile devices | Not yet done |

## Reflection

What I'd change, knowing what I know now:

- **Draw module boundaries earlier.** Partial classes split the two largest classes into readable files, but they don't reduce coupling. Assembly definitions around the evaluators, editor and story system would enforce the separation the design already has.
- **Build the shared evaluators first.** Extracting them after the preview and runtime had drifted cost more than writing them once at the start.
- **Profile on devices sooner.** The editor numbers are measured. Mobile frame times are the next thing to measure, not assume.

<aside class="ask frame">
<span class="frame-label">Ask me about</span>
<ul>
<li>How gameplay stays synchronised with the audio clock, and what calibration corrects for.</li>
<li>Why a note aimed at another note samples it at its own hit beat.</li>
<li>How the editor jumps to any beat without replaying the song.</li>
<li>What caused the editor slowdown, and how I proved the fix didn't change anything.</li>
<li>Why presets compile to copies instead of references.</li>
<li>Why variable BPM is deferred rather than approximated.</li>
</ul>
</aside>
