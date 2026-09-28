## Context

A dashboard is a set of requirements in visual form. Who is reading it, what decision are they making, and what must be visible without clicking? I built this Tableau dashboard to answer one reader's question: *how have the world's major equity markets performed, how risky has that been, and who is leading this year?*

## Design decisions

- **Three lenses on one screen.** Long-run indexed performance (2019 = 100), 2024 year-to-date return against annualised volatility, and a heatmap of annual returns by market. Each chart answers one question.
- **Two deliberate scopes.** The long-run chart and heatmap use ten headline indices, so they stay readable. The risk/return scatter uses a wider set to give context for this year. The dashboard says so, so nobody mistakes one scope for the other.
- **KPI cards with a definition.** Top and weakest year-to-date performer, best compound growth since 2019, and deepest drawdown. Each has a precise meaning rather than a vague "best market".
- **An insight panel with caveats.** The main takeaways are written out alongside the methodological limits, as a BA would write assumptions into a requirements document.

## What it showed (to 24 June 2024)

Taiwan's index led year-to-date. The NASDAQ Composite had the strongest growth since 2019. Latin American indices lagged in 2024, and Hang Seng had the deepest drawdown among the headline indices.

## Reflection

The hardest part wasn't Tableau. It was deciding what to leave out. Next time I'd test the dashboard with two or three real readers before finalising the layout, the same way I test requirements with stakeholders.
