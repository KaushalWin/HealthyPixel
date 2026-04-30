# Feature 6 — Blood Pressure Tracking

## Product Scope

Users can add, save, list, edit, and chart blood pressure readings using local-only storage. BP readings store both systolic (upper) and diastolic (lower) values.

## Functional Summary

1. User enters systolic (40–300 mmHg) and diastolic (20–200 mmHg) values.
2. Diastolic must be less than systolic — form validates this.
3. Date-time is preselected to now and can be changed with the shared DateTimePicker.
4. User can attach one or multiple grouped tags, or leave tags empty for a neutral/unclassified save.
5. BP tags are grouped into `timing`, `bodyState`, `context`, and `general` categories.
6. BP tags define 4 range fields: systolic min/max and diastolic min/max.
7. Save stores the reading in localStorage under `hp.bp.readings.v1`.
8. After save, user is redirected to the BP List page.
9. List shows readings as `120/80 mmHg` format with classification badges.
10. User can edit an existing reading.
11. BP Chart shows two lines: systolic and diastolic, with a legend.
12. BP Chart also shows a top-tag breakdown chart for the filtered reading set.

## Built-In Tags

1. Morning (`timing`, sys 90–140, dia 60–90)
2. Evening (`timing`, sys 90–140, dia 60–90)
3. Pre exercise (`bodyState`, sys 90–140, dia 60–90)
4. Post exercise (`bodyState`, sys 90–170, dia 60–90)
5. Resting (`bodyState`, sys 90–120, dia 60–80)
6. Random (`context`, sys 90–140, dia 60–90)
7. `general` is reserved for migrated legacy custom tags and new uncategorized custom tags.

## Data Model

```ts
interface BpReading {
  id: string;
  systolic: number;
  diastolic: number;
  readingDateTimeIso: string;
  tagIds: string[];
  note: string | null;
  createdAtIso: string;
  updatedAtIso: string;
}

interface BpTagDefinition {
  id: string;
  label: string;
  type: 'builtin' | 'custom';
  category: 'timing' | 'bodyState' | 'context' | 'general';
  rangeMin: number | null;
  rangeMax: number | null;
  systolicMin: number | null;
  systolicMax: number | null;
  diastolicMin: number | null;
  diastolicMax: number | null;
  usageCount: number;
  lastUsedAtIso: string | null;
  createdAtIso: string;
  updatedAtIso: string;
}
```

## Pages and Routes

| Page | Route |
|------|-------|
| Add BP | `/bp/add` |
| BP List | `/bp` |
| Edit BP | `/bp/edit/:readingId` |
| BP Chart | `/bp/chart` |

## Settings Integration

- BP tags managed in Tag Settings under the Blood Pressure tab (4-range fields).
- Category is selected when creating custom BP tags and can be edited later for custom tags.
- Chart colors (systolic line / diastolic line / neutral) configured in Chart Settings.
- Legacy BP tags imported from older data are normalized into the current category model on load/import.

## Classification Logic

A BP reading is classified by checking each tagged range:
- **Inside**: both systolic and diastolic are within the tag's ranges.
- **Outside**: either value is outside the tag's ranges.
- **Neutral**: no tags attached or tag has no range defined.
