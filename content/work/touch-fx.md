## Context

Some games draw a small burst wherever you tap, and I wanted the same feedback on my Windows desktop. It sounds trivial, but it has three real constraints. It must cover every monitor. It must never intercept a click meant for another app. And it should cost nothing when nobody is clicking. This is a fan utility and has no affiliation with any game publisher.

## How it works

- **Click-through overlay.** A borderless, transparent, top-most WPF window spans the whole virtual screen. Its extended window style is set to *transparent + layered + tool window*, so the OS routes every click to whatever is underneath and the overlay never appears in Alt-Tab.
- **Global input.** A low-level mouse hook watches for left-button presses anywhere. The hook only records the position and hands off to the UI thread. The drawing happens there, so the hook returns immediately and never slows input.
- **Render only while alive.** Each click spawns a pulse, a tapered rotating arc and a mixture of filled and hollow triangles and squares with damped motion. The drawing surface subscribes to the per-frame render callback **only while effects are alive** and unsubscribes when the last one fades, so it's idle when you aren't clicking.
- **Bounded cost.** Effects have hard caps (32 burst particles, 3 pulses, 3 arcs). Under rapid clicking new bursts shrink rather than stacking up.
- **Cheap redraws.** Brushes, pens and geometry are created once and frozen, so WPF can reuse them without change tracking.
- **Fits the theme.** The app reads the Windows light/dark setting and switches to higher-contrast colours on bright backgrounds.
- **Always escapable.** There's a global Ctrl + Alt + Q quit shortcut, a tray menu and an optional start-with-Windows setting.

## Outcome

Three releases (v0.1.0 to v0.1.2), each responding to use: a larger effect radius, then automatic light/dark modes. It's small, but it's a complete product loop: build, release, use, adjust.

## Reflection

The interesting part was deciding what *not* to do: no timer running constantly, no unbounded effects and no input capture. Next I'd move from a full-screen WPF surface to a composition-based renderer so the idle cost is exactly zero, and add per-monitor DPI testing.
