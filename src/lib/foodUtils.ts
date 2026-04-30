import { resolveReadingRange } from './readingUtils';
import type {
  FoodReading,
  FoodReadingDraft,
  FoodReadingFilters,
  FoodTagCategory,
  FoodTagDefinition,
  LogicalMatchMode,
  ReadingStatus
} from './types';

export const FOOD_TAG_CATEGORY_ORDER: FoodTagCategory[] = [
  'planned',
  'actual',
  'context',
  'behavior'
];

export const FOOD_TAG_CATEGORY_LABELS: Record<FoodTagCategory, string> = {
  planned: 'Planned tags',
  actual: 'Actual tags',
  context: 'Context tags',
  behavior: 'Behavior tags'
};

export type FoodTagBreakdownDatum = {
  key: string;
  label: string;
  category: FoodTagCategory;
  count: number;
  totalCalories: number;
  averageCalories: number;
};

export type FoodCategoryBreakdownDatum = {
  key: FoodTagCategory;
  label: string;
  count: number;
  totalCalories: number;
  averageCalories: number;
};

export function createFoodDraft(now = new Date()): FoodReadingDraft {
  return {
    mealName: '',
    calories: Number.NaN,
    readingDateTimeIso: now.toISOString(),
    tagIds: [],
    note: ''
  };
}

export function createFoodReadingFilters(
  overrides: Partial<FoodReadingFilters> = {}
): FoodReadingFilters {
  return {
    startDate: '',
    endDate: '',
    tagIds: [],
    categories: [],
    tagMatchMode: 'or',
    categoryMatchMode: 'or',
    combinedMode: 'and',
    ...overrides
  };
}

export function groupFoodTagsByCategory(tags: FoodTagDefinition[]) {
  return FOOD_TAG_CATEGORY_ORDER.reduce<Record<FoodTagCategory, FoodTagDefinition[]>>(
    (grouped, category) => {
      grouped[category] = tags.filter((tag) => tag.category === category);
      return grouped;
    },
    {
      planned: [],
      actual: [],
      context: [],
      behavior: []
    }
  );
}

function matchesSelectedValues(
  selectedValues: string[],
  availableValues: Set<string>,
  mode: LogicalMatchMode
) {
  if (selectedValues.length === 0) {
    return true;
  }

  if (mode === 'and') {
    return selectedValues.every((value) => availableValues.has(value));
  }

  return selectedValues.some((value) => availableValues.has(value));
}

function getFoodReadingCategories(
  reading: FoodReading,
  tagsById: Map<string, FoodTagDefinition>
): FoodTagCategory[] {
  const categories = new Set<FoodTagCategory>();

  for (const tagId of reading.tagIds) {
    const tag = tagsById.get(tagId);
    if (tag) {
      categories.add(tag.category);
    }
  }

  return Array.from(categories);
}

export function applyFoodReadingFilters(
  readings: FoodReading[],
  filters: FoodReadingFilters,
  tagsById: Map<string, FoodTagDefinition>
) {
  if (
    filters.startDate !== '' &&
    filters.endDate !== '' &&
    filters.startDate > filters.endDate
  ) {
    return [];
  }

  const startBoundary = filters.startDate ? `${filters.startDate}T00:00:00` : null;
  const endBoundary = filters.endDate ? `${filters.endDate}T23:59:59.999` : null;

  return readings.filter((reading) => {
    if (startBoundary && reading.readingDateTimeIso < new Date(startBoundary).toISOString()) {
      return false;
    }

    if (endBoundary && reading.readingDateTimeIso > new Date(endBoundary).toISOString()) {
      return false;
    }

    const tagMatches = matchesSelectedValues(
      filters.tagIds,
      new Set(reading.tagIds),
      filters.tagMatchMode
    );

    const categoryMatches = matchesSelectedValues(
      filters.categories,
      new Set(getFoodReadingCategories(reading, tagsById)),
      filters.categoryMatchMode
    );

    if (filters.tagIds.length === 0) {
      return categoryMatches;
    }

    if (filters.categories.length === 0) {
      return tagMatches;
    }

    return filters.combinedMode === 'and'
      ? tagMatches && categoryMatches
      : tagMatches || categoryMatches;
  });
}

export function classifyFoodReading(
  reading: FoodReading,
  tags: FoodTagDefinition[]
): { status: ReadingStatus; range: { min: number | null; max: number | null } | null } {
  const range = resolveReadingRange(tags);

  if (!range) {
    return { status: 'neutral', range: null };
  }

  if (range.min !== null && reading.calories < range.min) {
    return { status: 'outside', range };
  }

  if (range.max !== null && reading.calories > range.max) {
    return { status: 'outside', range };
  }

  return { status: 'inside', range };
}

export function buildFoodMetrics(
  readings: FoodReading[],
  tagsById: Map<string, FoodTagDefinition>
) {
  let insideCount = 0;
  let outsideCount = 0;
  let neutralCount = 0;
  let totalCalories = 0;

  for (const reading of readings) {
    totalCalories += reading.calories;
    const tags = reading.tagIds
      .map((tagId) => tagsById.get(tagId))
      .filter(Boolean) as FoodTagDefinition[];
    const status = classifyFoodReading(reading, tags).status;

    if (status === 'inside') {
      insideCount += 1;
    } else if (status === 'outside') {
      outsideCount += 1;
    } else {
      neutralCount += 1;
    }
  }

  const evaluatedCount = insideCount + outsideCount;

  return {
    totalCount: readings.length,
    totalCalories,
    averageCalories:
      readings.length === 0 ? 0 : Math.round(totalCalories / readings.length),
    insideCount,
    outsideCount,
    neutralCount,
    insidePercent:
      evaluatedCount === 0 ? 0 : Math.round((insideCount / evaluatedCount) * 100),
    outsidePercent:
      evaluatedCount === 0 ? 0 : Math.round((outsideCount / evaluatedCount) * 100),
    highestCalories:
      readings.length === 0
        ? null
        : Math.max(...readings.map((reading) => reading.calories)),
    lowestCalories:
      readings.length === 0
        ? null
        : Math.min(...readings.map((reading) => reading.calories))
  };
}

export function buildFoodTagBreakdown(
  readings: FoodReading[],
  tagsById: Map<string, FoodTagDefinition>,
  categories: FoodTagCategory[] = []
) {
  const totals = new Map<string, FoodTagBreakdownDatum>();

  for (const reading of readings) {
    for (const tagId of new Set(reading.tagIds)) {
      const tag = tagsById.get(tagId);
      if (!tag) {
        continue;
      }

      if (categories.length > 0 && !categories.includes(tag.category)) {
        continue;
      }

      const current = totals.get(tag.id) ?? {
        key: tag.id,
        label: tag.label,
        category: tag.category,
        count: 0,
        totalCalories: 0,
        averageCalories: 0
      };

      totals.set(tag.id, {
        ...current,
        count: current.count + 1,
        totalCalories: current.totalCalories + reading.calories,
        averageCalories: 0
      });
    }
  }

  return Array.from(totals.values())
    .map((value) => ({
      ...value,
      averageCalories: Math.round(value.totalCalories / value.count)
    }))
    .sort(
      (left, right) =>
        right.count - left.count ||
        right.averageCalories - left.averageCalories ||
        left.label.localeCompare(right.label)
    );
}

export function buildFoodCategoryBreakdown(
  readings: FoodReading[],
  tagsById: Map<string, FoodTagDefinition>
) {
  const totals = new Map<FoodTagCategory, FoodCategoryBreakdownDatum>();

  for (const category of FOOD_TAG_CATEGORY_ORDER) {
    totals.set(category, {
      key: category,
      label: FOOD_TAG_CATEGORY_LABELS[category],
      count: 0,
      totalCalories: 0,
      averageCalories: 0
    });
  }

  for (const reading of readings) {
    for (const category of getFoodReadingCategories(reading, tagsById)) {
      const current = totals.get(category);
      if (!current) {
        continue;
      }

      totals.set(category, {
        ...current,
        count: current.count + 1,
        totalCalories: current.totalCalories + reading.calories,
        averageCalories: 0
      });
    }
  }

  return FOOD_TAG_CATEGORY_ORDER.map((category) => {
    const value = totals.get(category)!;
    return {
      ...value,
      averageCalories: value.count === 0 ? 0 : Math.round(value.totalCalories / value.count)
    };
  });
}