# Feature 4 — Weight Tracking

## Product Scope

Users can add, save, list, edit, and chart weight readings using local-only storage.

## Functional Summary

1. User can add a weight reading in kilograms (0–700 kg).
2. Date-time is preselected to now and can be changed with the shared DateTimePicker.
3. User can attach one or multiple tags via the chip selector below the value input.
4. Built-in tags are bootstrapped on first load with default healthy ranges.
5. Save stores the reading in localStorage under `hp.weight.readings.v1`.
6. After save, user is redirected to the Weight List page.
7. List shows readings sorted by date-time descending.
8. User can edit an existing reading.
9. Weight Chart shows a ComposedChart (Area + Line) with range-aware coloring.

## Built-In Tags

1. Morning (range: 40–120 kg)
2. Post meal (range: 40–120 kg)
3. Post exercise (range: 40–120 kg)
4. Evening (range: 40–120 kg)
5. Weekly check (range: 40–120 kg)
6. Random (no range)

## Data Model

```ts
interface WeightReading {
  id: string;
  value: number;       // kg
  timestamp: string;   // ISO
  tagIds: string[];
  note: string;
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
- Chart colors (inside/outside/neutral) configured in Chart Settings.
