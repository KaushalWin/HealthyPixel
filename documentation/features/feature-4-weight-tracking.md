# Feature 4 — Weight Tracking

## Product Scope

Users can add, save, list, edit, and chart weight readings using local-only storage.

## Functional Summary

1. User can add a weight reading in kilograms (0–700 kg).
2. Date-time is preselected to now and can be changed with the shared DateTimePicker.
3. User can attach one or multiple grouped tags, or leave tags empty for a neutral/unclassified save.
4. Weight tags are grouped into `timing`, `bodyState`, `routine`, and `general` categories.
5. Built-in tags are bootstrapped on first load with the current live defaults.
6. Save stores the reading in localStorage under `hp.weight.readings.v1`.
7. After save, user is redirected to the Weight List page.
8. List shows readings sorted by date-time descending.
9. User can edit an existing reading.
10. Weight Chart shows a ComposedChart (Area + Line) with range-aware coloring plus category-aware filters.

## Built-In Tags

1. Morning (`timing`, no default range)
2. Evening (`timing`, no default range)
3. Pre exercise (`bodyState`, no default range)
4. Post exercise (`bodyState`, no default range)
5. Fasting (`bodyState`, no default range)
6. Random (`routine`, no default range)
7. `general` is reserved for migrated legacy custom tags and new uncategorized custom tags.

## Data Model

```ts
interface WeightReading {
  id: string;
  value: number;
  readingDateTimeIso: string;
  tagIds: string[];
  note: string | null;
  createdAtIso: string;
  updatedAtIso: string;
}

interface WeightTagDefinition {
  id: string;
  label: string;
  type: 'builtin' | 'custom';
  category: 'timing' | 'bodyState' | 'routine' | 'general';
  rangeMin: number | null;
  rangeMax: number | null;
  usageCount: number;
  lastUsedAtIso: string | null;
  createdAtIso: string;
  updatedAtIso: string;
}
```

## Pages and Routes

| Page | Route |
|------|-------|
| Add Weight | `/weight/add` |
| Weight List | `/weight` |
| Edit Weight | `/weight/edit/:readingId` |
| Weight Chart | `/weight/chart` |

## Settings Integration

- Weight tags managed in Tag Settings under the Weight tab.
- Category is selected when creating custom weight tags and can be edited later for custom tags.
- Chart colors (inside/outside/neutral) configured in Chart Settings.
- Legacy weight tags imported from older data are normalized into the current category model on load/import.
