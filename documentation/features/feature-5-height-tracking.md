# Feature 5 — Height Tracking

## Product Scope

Users can add, save, list, edit, and chart height readings using local-only storage.

## Functional Summary

1. User can add a height reading in centimetres (0–300 cm).
2. Date-time is preselected to now and can be changed with the shared DateTimePicker.
3. User can attach one or multiple tags via the chip selector.
4. Built-in tags are bootstrapped on first load.
5. Save stores the reading in localStorage under `hp.height.readings.v1`.
6. After save, user is redirected to the Height List page.
7. List shows readings sorted by date-time descending.
8. User can edit an existing reading.
9. Height Chart shows a ComposedChart (Area + Line) with range-aware coloring.

## Built-In Tags

1. Morning (range: 100–220 cm)
2. Post exercise (range: 100–220 cm)
3. Random (no range)

## Data Model

```ts
interface HeightReading {
  id: string;
  value: number;       // cm
  timestamp: string;   // ISO
  tagIds: string[];
  note: string;
}
```

## Pages and Routes

| Page | Route |
|------|-------|
| Add Height | `/height/add` |
| Height List | `/height` |
| Edit Height | `/height/edit/:readingId` |
| Height Chart | `/height/chart` |

## Settings Integration

- Height tags managed in Tag Settings under the Height tab.
- Chart colors (inside/outside/neutral) configured in Chart Settings.
