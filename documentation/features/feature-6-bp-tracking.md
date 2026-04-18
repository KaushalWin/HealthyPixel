# Feature 6 — Blood Pressure Tracking

## Product Scope

Users can add, save, list, edit, and chart blood pressure readings using local-only storage. BP readings store both systolic (upper) and diastolic (lower) values.

## Functional Summary

1. User enters systolic (40–300 mmHg) and diastolic (20–200 mmHg) values.
2. Diastolic must be less than systolic — form validates this.
3. Date-time is preselected to now and can be changed with the shared DateTimePicker.
4. User can attach one or multiple tags via the chip selector.
5. BP tags define 4 range fields: systolic min/max and diastolic min/max.
6. Save stores the reading in localStorage under `hp.bp.readings.v1`.
7. After save, user is redirected to the BP List page.
8. List shows readings as "120/80 mmHg" format with classification badges.
9. User can edit an existing reading.
10. BP Chart shows two lines: systolic and diastolic, with a legend.

## Built-In Tags

1. Normal (sys 90–120, dia 60–80)
2. Elevated (sys 120–129, dia 60–80)
3. Stage 1 (sys 130–139, dia 80–89)
4. Stage 2 (sys 140–180, dia 90–120)
5. Morning (sys 90–140, dia 60–90)
6. Random (no range)

## Data Model

```ts
interface BpReading {
  id: string;
  systolic: number;
  diastolic: number;
  timestamp: string;   // ISO
  tagIds: string[];
  note: string;
}

interface BpTagDefinition {
  id: string;
  label: string;
  type: 'builtin' | 'custom';
  systolicMin: number | null;
  systolicMax: number | null;
  diastolicMin: number | null;
  diastolicMax: number | null;
  usageCount: number;
  lastUsed: string | null;
  createdAt: string;
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
- Chart colors (systolic line / diastolic line / neutral) configured in Chart Settings.

## Classification Logic

A BP reading is classified by checking each tagged range:
- **Inside**: both systolic and diastolic are within the tag's ranges.
- **Outside**: either value is outside the tag's ranges.
- **Neutral**: no tags attached or tag has no range defined.
