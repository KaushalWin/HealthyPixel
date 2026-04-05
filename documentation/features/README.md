# HealthyPixel Feature Planning

This folder defines product and technical planning for upcoming features before implementation.

## Included Feature Documents

1. [Feature 1 - Sugar Readings Entry and List](./feature-1-sugar-readings.md)
2. [Feature 2 - Sugar Trends Chart and Insights](./feature-2-sugar-chart-and-insights.md)
3. [Feature 3 - Settings and Sub Settings](./feature-3-settings-and-sub-settings.md)

## Planning Goals

1. Lock user flows and expected behavior first.
2. Record data models and local-storage contracts.
3. Identify reusable components early.
4. List open decisions clearly so implementation does not rely on assumptions.

## Shared Architecture Direction Summary

1. Storage should remain local-only and privacy-first.
2. Readings, tags, and settings should each have a dedicated store key in localStorage.
3. Date handling should use one shared utility strategy across entry, list, chart, and filters.
4. New screens should rely on reusable components validated first in the Tests page.
5. Chart range defaults should come from settings and be overridable in the chart screen.
6. Navigation should be categorized so the menu stays short and readable as pages grow.
7. Quick Actions should stay minimal; initially only Add Sugar should appear there.

## Common Reusable Components to Build First

1. DateTimePicker (native inputs, default now, controlled/uncontrolled support)
2. DateRangePicker (date-only for chart filtering)
3. TagSelector (built-in + custom tags, sort modes)
4. SugarReadingForm (value, date-time, tags, save/update mode)
5. SugarReadingList (sortable, filterable, edit action)
6. HighlightBadge (inside range, outside range, neutral)
7. EmptyStatePanel (no readings for selected range)
8. MetricsSummaryCard (inside/outside counts and percentages)
9. AppSectionMenu (categorized page navigation)
10. SettingsLinkNotice (small inline reminder with redirect action)

## Shared Utilities to Build First

1. Date/time formatting and parsing utility
2. Reading sort/filter utility
3. Tag range evaluation utility
4. Percentage and summary metrics utility
5. localStorage schema migration/validation utility

## Cross-Feature Risks

1. Tag-based highlight rules need exact precedence when multiple tags are assigned.
2. Date filtering boundaries need timezone clarity to avoid off-by-one-day errors.
3. localStorage schema changes need versioning to avoid data loss later.
4. Editing flows need stable identifiers for each reading.
