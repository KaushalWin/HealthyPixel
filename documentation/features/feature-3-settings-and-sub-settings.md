# Feature 3 - Settings and Sub Settings

## Product Scope

Add a Settings page with sub pages for tag management, chart default range management, and chart color configuration.

## Functional Summary

Settings main page:

1. Entry point for all configuration.
2. Navigation to sub settings pages.

Sub setting A: Tag management

1. Add and remove built-in and custom tags.
2. Manage sort order of tag selector.
3. Supported sort modes:
   - Recently used
   - Popular within selected timeframe (default 2 weeks)
   - Alphabetical
   - Creation date
4. Store all tag metadata in localStorage only.
5. While adding or editing a tag, user can set an optional healthy range (min and max) for sugar values.
6. Built-in tags are removable.
7. Custom tags are renameable.

Sub setting B: Default chart time range

1. Set default chart date preset.
2. Presets:
   - Today
   - Last week
   - Last month (rolling window)
   - This month (calendar month)
   - This year (calendar year)
3. Presets should include today by default.

Sub setting C: Chart colors

1. Configure colors for inside-range values.
2. Configure colors for outside-range values.
3. Configure colors for neutral or untagged values.
4. Use a good color picker control.
5. Colors should affect chart line/point styling immediately if the implementation is simple and safe.

## First-Run Defaults

1. On first website open, local storage should be bootstrapped with default settings and default built-in tags.
2. Popular tag sorting should default to a 2-week window.
3. Built-in tags should include their default order and initial range values.
4. Chart default preset should be initialized in settings.
5. Default chart colors for inside, outside, and neutral values should be initialized in settings.

## Suggested Data Model

Tag entity:

1. id: string
2. label: string
3. type: builtin | custom
4. createdAtIso: string
5. updatedAtIso: string
6. usageCount: number
7. lastUsedAtIso: string | null
8. rangeMin: number | null
9. rangeMax: number | null

Settings entity:

1. defaultChartPreset: today | lastWeek | lastMonth | thisMonth | thisYear
2. tagSortMode: recentlyUsed | popular | alphabetical | creationDate
3. popularWindowDays: number
4. chartColorInside: string
5. chartColorOutside: string
6. chartColorNeutral: string

## Technical Plan Summary

1. Build SettingsPage with links to sub pages.
2. Build TagManagementPage with create/update/delete flows.
3. Build TagRangeEditor modal or inline section.
4. Build ChartDefaultsPage with date preset radio group.
5. Build ChartColorSettingsPage with color picker inputs for inside, outside, and neutral states.
6. Build TagOrdering utility to support all sort strategies.
7. Track tag usage on reading save/update.
8. Persist settings and tags in localStorage with schema guards.
9. Add defaults bootstrap when settings are missing.
10. If low-risk, settings changes should reflect immediately in chart views; otherwise, safe refresh-based application is acceptable.
11. Add a single reset action that clears all local data rather than separate partial resets.

## Edge Cases to Handle

1. Deleting a tag currently used by existing readings.
2. Duplicate custom tag names.
3. Invalid range entries where min is greater than max.
4. Popular sorting when no readings exist in timeframe.
5. First-run bootstrap should not duplicate defaults when settings already exist.
6. Color selections should remain accessible and readable enough against the chart background.

## Confirmed Decisions

1. Built-in tags are removable.
2. Custom tags can be renamed.
3. Popular sorting defaults to 2 weeks.
4. Tag ranges are optional.
5. Last month means rolling today-minus-one-month through today.
6. Immediate chart updates are preferred if simple and low-risk; otherwise a safer non-live approach is acceptable.
7. Replace reset-to-default with a single delete-all-data or delete-account style reset that clears everything local.
