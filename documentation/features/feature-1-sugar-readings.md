# Feature 1 - Sugar Readings Entry and List

## Product Scope

Users can add, save, list, and edit sugar readings using local-only storage.

## Functional Summary

1. User can add sugar reading as a numeric value.
2. Date-time is preselected to now and can be changed with the shared DateTimePicker.
3. User can attach one or multiple tags.
4. Built-in tags are available out of the box.
5. Custom tags are managed only from Settings, not from the entry form.
6. Save stores the reading in localStorage.
7. After save, user is redirected to sugar reading list.
8. List shows readings sorted by selected reading date-time in descending order.
9. User can edit an existing reading.
10. Reading form includes an optional note field.
11. Entry form should include a small note and button that redirects to Settings for tag management.
12. The app should have a direct Sugar List page in navigation, not only a post-save redirect.

## Built-In Tags Requested

1. Pre breakfast
2. Post breakfast
3. Pre lunch
4. Post lunch
5. Pre dinner
6. Post dinner
7. Pre snack
8. Post snack
9. Pre exercise
10. Post exercise
11. Random
12. Fasting
13. Weekend
14. Cheat

## Built-In Tag Defaults

1. Built-in tags should be bootstrapped from Settings on first app load.
2. Tags should appear in the same order defined by Settings sorting and tag configuration.
3. Post meal tags should ship with a default healthy range of 70 to 140.
4. Fasting should ship with a default healthy range that treats values up to 100 as inside range.
5. Other built-in tags should also receive default ranges from Settings bootstrap before implementation starts.

## Suggested Data Model

Reading entity:

1. id: string (uuid)
2. value: number
3. readingDateTimeIso: string
4. tagIds: string[]
5. note: string | null
6. createdAtIso: string
7. updatedAtIso: string

Tag entity reference:

1. id: string
2. label: string
3. type: builtin | custom

localStorage keys:

1. hp.readings.v1
2. hp.tags.v1
3. hp.settings.v1

## User Flow Summary

1. Open Add Sugar Reading page.
2. Enter reading number.
3. Keep now or update date-time.
4. Select one or multiple existing tags.
5. Optionally add a note.
6. If a needed tag is missing, use the Settings redirect action from this page.
7. Click Save.
8. Navigate to list page.
9. List sorted newest first by readingDateTimeIso.
10. Newly saved row should appear at the top and be visually highlighted.
11. Primary action at the top of the list page should be Add New Entry for fast repeated entry.
12. List should support filtering controls so the user can refine the result set as needed.
13. Click Edit on any item to update value/date-time/tags/note.

## Navigation Notes

1. Add Sugar and Sugar List should both be direct pages in the app navigation.
2. Navigation should be grouped/categorized so page growth does not create one long flat menu.
3. Quick Actions should include only Add Sugar for the current stage.

## Technical Plan Summary

1. Reuse DateTimePicker from shared components.
2. Build SugarReadingForm with create and edit modes.
3. Build TagSelector that consumes Settings-managed tags only.
4. Build SugarReadingList component with date-time-desc sorting and reusable filtering controls.
5. Add simple localStorage repository layer with parse/serialize guards.
6. Add route-level pages:
   - Add Sugar Reading page
   - Sugar Reading List page
   - Edit Sugar Reading page
7. Redirect to list after successful save or update.
8. Add validation:
   - reading is required
   - reading allows decimals
   - reading minimum is 0
   - reading maximum is 10000
9. Add note input to the form model and storage layer.
10. Add inline Settings redirect notice for tag management.
11. Ensure the list page can open directly from navigation without requiring a save-first flow.

## Edge Cases to Handle

1. Empty or non-numeric reading input.
2. Duplicate tag labels with case differences.
3. Invalid date-time input value.
4. Legacy or malformed localStorage payload.
5. Edit for deleted or missing reading id.
6. Multiple selected tags with different configured ranges.
7. Very large but still allowed values near validation maximum.

## Confirmed Decisions

1. A reading can have multiple tags.
2. Decimal values are allowed.
3. Numeric validation range is 0 to 10000.
4. Custom tags are created only from Settings.
5. Newly saved reading should be highlighted in the list.
6. Filtering should be added to the list instead of fixed grouping by day.
