## Context

Windows has *Show desktop*, but it only runs when you ask for it. I wanted my desktop to clear itself when I walk away, like a quiet screensaver that shows my wallpaper, and to restore everything exactly as it was when I come back. It shouldn't do this in the middle of a game, a full-screen app or a video I'm watching.

DesktopIdle is a small tray utility I built for that, released on GitHub with tagged versions.

<div class="brief">
<div><p>User</p><p>Me, and anyone who wants a tidy desktop when idle without a traditional screensaver.</p></div>
<div><p>Must</p><p>Never interrupt real activity. Always restore exactly. Never leave the system in a changed state.</p></div>
<div><p>Built with</p><p>C#, .NET 8, WinForms tray app, Win32 via P/Invoke, WinRT media sessions.</p></div>
</div>

## The problem

"Idle" sounds like one number from the operating system. In practice it's a judgement:

- A film playing full-screen is idle *input*, but it isn't idle *attention*.
- A YouTube tab is only worth protecting while it's **playing**, not while it's paused.
- Some apps, like games, should never trigger it at all. Others, like a music player, should stay visible when everything else is minimised.

Then there's a harder problem that only showed up in testing.

## The bug: the app woke itself up

Entering ambient mode moves the cursor away from the taskbar and minimises windows. Both of those produce **input events**, and input is exactly what ends idle mode. The first release sometimes exited the moment it started.

The fix (the "Bugfix false exit" commit) treats programmatic input as expected rather than as a user returning:

1. **Grace window.** For a short period after entering, which is always longer than the input-freshness threshold, input doesn't count.
2. **Cursor anchor.** The cursor's resting position is recorded once it has been moved.
3. **Distance threshold.** Only movement of **100 px or more** from that anchor ends ambient mode, so a knock on the desk doesn't.

<figure class="wide frame">
<span class="frame-label">Diagram</span>
<!-- diagram:desktop-idle-states -->
<figcaption>Engagement checks run before the idle timer is considered. The grace window stops the app's own actions from ending ambient mode.</figcaption>
</figure>

## Decisions

<div class="decision">
<p>Decision · hiding the cursor</p>
<dl>
<dt>Chose</dt><dd>A borderless, top-most, non-activating window at 1% opacity that uses a blank cursor. Windows shows that window's cursor because it is the hit-test target.</dd>
<dt>Instead of</dt><dd>Replacing the system-wide cursor.</dd>
<dt>Why</dt><dd>A system cursor change would outlive a crash and leave the user without a pointer. The mask window disappears with the process, so there's nothing to clean up.</dd>
</dl>
</div>

- **Is a video really playing?** Browser window titles show whether a YouTube tab is focused. The Windows media-session API then confirms whether it is actually *playing*. That check is cached, because it's asynchronous and relatively slow.
- **Fullscreen detection** compares the foreground window's bounds with its monitor, and ignores the desktop shell's own windows.
- **The taskbar** auto-hide state is read before ambient mode starts and written back afterwards, so the user's setting is never lost. A keeper timer stops the taskbar reappearing while ambient mode is active.
- **Restoring** replays the captured window list in order with a tiny stagger, so windows don't all redraw at once.
- **Settings** are plain JSON, and every threshold is clamped to a safe minimum when loaded. DesktopIdle always excludes itself.

## Outcome

Two tagged releases (v1.0.0 and v1.0.1) are published as a self-contained single-file executable, with no runtime install needed.

## Reflection

- The false-exit bug was a **requirements** bug before it was a code bug. "Exit when the user moves" should have been "exit when the user moves, not when we move the cursor". Writing the acceptance criterion precisely made the fix obvious.
- Next, I'd add a small automated harness for the state machine, so the grace-window logic is tested without a real desktop.
