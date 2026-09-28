## Context

I built this as an assessed project during my technical training in 2024. In League of Legends, patches regularly change what objectives are worth. I wanted to know **which in-game factors correlate most with winning, and whether that changed between 2020 and 2024.**

It's the most data-focused project on this site. I've included its limitations, because finding them was part of the work.

<div class="brief">
<div><p>Question</p><p>Which factors correlate with winning, and has that changed since 2020?</p></div>
<div><p>Data</p><p>A public 2020 dataset of ≈9,900 high-rank games, plus 2024 top-ladder matches pulled from the Riot Games API.</p></div>
<div><p>Stack</p><p>Python (Requests, Pandas, Seaborn), SQLAlchemy, MySQL.</p></div>
</div>

## Getting the 2024 data

There is no endpoint for "all recent high-rank matches". My plan was to go through the players instead:

1. Find the top ≈300 players on the ladder.
2. Resolve each player to their account ID, then list their recent match IDs.
3. Request match detail, a large participant-level JSON document per game.

The constraint was the free developer key: **100 requests every 2 minutes**. Several hundred players means well over 600 calls, so I throttled requests and cached each stage (players, match IDs, match detail) to JSON. A re-run only asks the API for what's new.

One finding surfaced here: **3,000 requested games produced 1,847 unique matches**. At the top of the ladder the same few hundred players keep meeting each other, so their match histories overlap heavily.

<figure class="wide frame">
<span class="frame-label">Diagram</span>
<!-- diagram:riot-pipeline -->
<figcaption>Two sources, one schema. The 2024 data is reshaped to match the 2020 dataset before both are loaded into MySQL.</figcaption>
</figure>

## Making two datasets comparable

The 2020 data is one row per game with team-level columns. The API returns ten participants per match. I rebuilt the team-level features for the blue side (kills, deaths, assists, wards, dragons, heralds, towers, gold and experience difference) and added objectives that didn't exist in 2020. On the 2020 side I dropped redundant and collinear columns (for example, red kills duplicate blue deaths) after checking a correlation matrix. Both tables were then loaded into MySQL through SQLAlchemy and aligned there.

## What the data suggested

- Dragons and turrets correlated with winning **much more strongly** in 2024. That fits patch changes that made dragons grant permanent stat buffs and added turret bounties.
- First blood mattered **less**, consistent with comeback mechanics that reward the team behind.
- Vision (wards placed and destroyed) stayed weakly correlated in both years.

## Where the comparison breaks

The most important result is methodological. **The 2020 dataset only covers the first ten minutes of each game, while the API returns whole games.** Correlations are still informative, but comparing *magnitudes* (for example "more kills in 2024") is not like-for-like, and I didn't present it that way. A fair version needs a historical source with full-game statistics.

<div class="bridge">
<p>The analyst's view</p>
<p>This is the same check I make at work before anyone relies on a number: are these two things actually measured the same way? Here they weren't, and the honest conclusion says so.</p>
</div>

## About the repository

The public repository contains the notebook, the cached data, both loaded tables and the account and match-ID request modules. Some of the supporting code the notebook describes (the league lookup and the throttling and cache helpers) isn't in the committed version, so treat the notebook as the record of the method.

## Reflection

- Use a full-game historical source, or restrict the 2024 features to the first ten minutes using the match timeline endpoint.
- Deduplicate match IDs *before* requesting detail, to save rate-limited calls.
- Move from correlation to a simple model (logistic regression) with held-out games, so the claims can be tested rather than just described.
