# Feature 8 — Food Tracking

## Product Scope

Users can log meals with a meal name, calories, date-time, optional note, and four independent tag categories: planned, actual, context, and behavior.

## Functional Summary

1. User can add a food entry with meal name and calories.
2. Date-time defaults to now and can be changed with the shared DateTimePicker.
3. The form groups food tags into four sections: planned, actual, context, and behavior.
4. Built-in food tags bootstrap on first load and sample food entries seed the module so the charts are meaningful immediately.
5. Save stores the entry in localStorage under `hp.food.readings.v1`.
6. Food List supports date filtering, category filtering, direct tag filtering, and explicit AND/OR logic for mixed selections.
7. Food Chart includes a calorie trend chart and a top-tag breakdown chart.
8. Color status follows calorie ranges attached to the selected food tags.
9. Users can edit an existing food entry.
10. Food tags are managed in Settings with category-aware creation and editing.

## Built-In Tag Categories

### Planned

1. Healthy
2. High protein
3. Light
4. Comfort

### Actual

1. Portion ok
2. Overeat
3. Heavy
4. Light meal

### Context

1. Breakfast
2. Lunch
3. Dinner
4. Snack
5. Cheat
6. Office

### Behavior

1. Bored binge
2. Mindful
3. Rushed
4. Stress eat

## Data Model

```ts
interface FoodReading {
  id: string;
  mealName: string;
  calories: number;
  readingDateTimeIso: string;
  tagIds: string[];
  note: string | null;
  createdAtIso: string;
  updatedAtIso: string;
}
```

## Pages and Routes

| Page | Route |
|------|-------|
| Add Food | `/food/add` |
| Food List | `/food/list` |
| Edit Food | `/food/edit/:readingId` |
| Food Chart | `/food/chart` |

## Filtering and Charts

- Food filters can target dates, specific tags, and whole categories.
- Users can choose AND or OR logic for selected tags, selected categories, and the combined tag-plus-category result.
- The chart page shows a calorie trend line plus a top-tag breakdown chart.
- The list and chart share the same grouped tag and category concepts.

## Settings Integration

- Food tags are managed in Tag Settings under the Food tab.
- Food chart colors are configured in Chart Settings.
- Food can be shown or hidden on the Analysis dashboard via Settings.