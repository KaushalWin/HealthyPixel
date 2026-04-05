# Feature 2 - Sugar Trends Chart and Insights

## Product Scope

Provide a sugar trends chart with date filtering, highlighted out-of-range points based on tag range, and summary metrics.

## Functional Summary

1. Display line chart with points.
2. Fill color under line area.
3. Default date range comes from settings.
4. User can change date range using date-only selector.
5. User can also filter by one or multiple tags, and the same filters affect both chart and list below.
5. Show list of readings used in the chart below the graph.
6. Highlight out-of-range values based on tag-specific thresholds.
7. Show key summary metrics below chart.

## Display Rules

1. Chart lines should use straight segments only, with no smoothing.
2. Range validation should prevent start date being after end date.
3. Preset ranges should include today by default, but the user can manually adjust to narrower custom dates.

## Highlight Rules Requested

1. Highlight logic should come from tag ranges stored in Settings.
2. Built-in tags should ship with preset ranges through Settings bootstrap.
3. Post meal tags should start with a default range of 70 to 140.
4. Fasting should start with a default range that treats values up to 100 as inside range.
5. When multiple tags are attached, use the shortest combined range.
6. Example: if one tag allows 65 to 200 and another allows 90 to 140, use 90 to 140.
7. Threshold boundary values are inside range, not outside.
8. Readings with no tag should be neutral, not inside-range.

## Suggested Metrics Summary

1. Total readings in selected range.
2. Count of readings inside range.
3. Count of readings outside range.
4. Percentage inside range.
5. Percentage outside range.
6. Highest reading and lowest reading in range.

## Technical Plan Summary

1. Build SugarTrendChart component using reusable chart primitives.
2. Build DateRangePicker (date-only).
3. Reuse SugarReadingList with shared date and tag filter mode.
4. Build RangeEvaluator utility:
   - resolve applicable threshold from tag
   - classify each reading as inside, outside, or neutral
   - if multiple tags exist, apply the shortest effective range
   - treat threshold equality as inside
5. Build ChartSummaryMetrics component for percentages/counts.
6. Respect default range from settings on initial load.
7. Respect default chart colors from settings for inside, outside, and neutral points.
8. Share the active filters with the reading list below the chart.

## Data Handling Notes

1. Filter uses readingDateTimeIso converted to local date boundaries.
2. Date filter is inclusive of start and end date.
3. Sort for list remains descending by readingDateTimeIso.
4. Chart x-axis label format should stay compact and readable on mobile.
5. Tag filters should allow one or multiple selected tags.
6. Untagged readings should remain visible unless tag filtering excludes them.

## Edge Cases to Handle

1. No readings available in selected range.
2. Reading has multiple tags with conflicting ranges.
3. Reading references deleted tag id.
4. Selected date range where start is after end should be blocked by validation.
5. Very dense datasets causing unreadable x-axis labels.
6. Untagged readings should render with neutral color rather than inside-range color.

## Confirmed Decisions

1. Post meal defaults come from Settings bootstrap and initially use 70 to 140.
2. Other built-in tag ranges also come from Settings bootstrap.
3. Multiple-tag readings use the shortest resulting range.
4. Borderline values count as inside range.
5. Untagged readings use a separate neutral color.
6. Preset date ranges include today by default.
7. Chart line should use straight segments with sharp edges.
