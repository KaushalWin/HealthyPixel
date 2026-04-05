import type {
  AppSettings,
  ChartPreset,
  ReadingDraft,
  ReadingFilters,
  ReadingStatus,
  SugarReading,
  TagDefinition
} from './types';

export function formatDateInput(date: Date) {
  const localValue = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localValue.toISOString().slice(0, 10);
}

export function parseStoredJson<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function applyReadingFilters(readings: SugarReading[], filters: ReadingFilters) {
  const startBoundary = filters.startDate ? `${filters.startDate}T00:00:00` : null;
  const endBoundary = filters.endDate ? `${filters.endDate}T23:59:59.999` : null;

  return readings.filter((reading) => {
    if (startBoundary && reading.readingDateTimeIso < new Date(startBoundary).toISOString()) {
      return false;
    }

    if (endBoundary && reading.readingDateTimeIso > new Date(endBoundary).toISOString()) {
      return false;
    }

    if (filters.tagIds.length === 0) {
      return true;
    }

    return filters.tagIds.some((tagId) => reading.tagIds.includes(tagId));
  });
}

export function sortReadingsDescending(readings: SugarReading[]) {
  return [...readings].sort((left, right) =>
    right.readingDateTimeIso.localeCompare(left.readingDateTimeIso)
  );
}

export function sortReadingsAscending(readings: SugarReading[]) {
  return [...readings].sort((left, right) =>
    left.readingDateTimeIso.localeCompare(right.readingDateTimeIso)
  );
}

export function createReadingDraft(now = new Date()): ReadingDraft {
  return {
    value: Number.NaN,
    readingDateTimeIso: now.toISOString(),
    tagIds: [],
    note: ''
  };
}

export function buildPresetDateRange(preset: ChartPreset, now = new Date()): ReadingFilters {
  const today = new Date(now);
  const start = new Date(today);
  const end = new Date(today);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  switch (preset) {
    case 'today':
      break;
    case 'lastWeek':
      start.setDate(start.getDate() - 6);
      break;
    case 'lastMonth':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'thisMonth':
      start.setDate(1);
      end.setMonth(end.getMonth() + 1, 0);
      break;
    case 'thisYear':
      start.setMonth(0, 1);
      end.setMonth(11, 31);
      break;
  }

  return {
    startDate: formatDateInput(start),
    endDate: formatDateInput(end),
    tagIds: []
  };
}

export function resolveReadingRange(tags: TagDefinition[]) {
  const validTags = tags.filter((tag) => tag.rangeMin !== null || tag.rangeMax !== null);
  if (validTags.length === 0) {
    return null;
  }

  const rangeMin = Math.max(...validTags.map((tag) => tag.rangeMin ?? Number.NEGATIVE_INFINITY));
  const rangeMax = Math.min(...validTags.map((tag) => tag.rangeMax ?? Number.POSITIVE_INFINITY));

  return {
    min: Number.isFinite(rangeMin) ? rangeMin : null,
    max: Number.isFinite(rangeMax) ? rangeMax : null
  };
}

export function classifyReading(
  reading: SugarReading,
  tags: TagDefinition[]
): { status: ReadingStatus; range: { min: number | null; max: number | null } | null } {
  const range = resolveReadingRange(tags);
  if (!range) {
    return { status: 'neutral', range: null };
  }

  if (range.min !== null && reading.value < range.min) {
    return { status: 'outside', range };
  }

  if (range.max !== null && reading.value > range.max) {
    return { status: 'outside', range };
  }

  return { status: 'inside', range };
}

export function buildReadingMetrics(readings: SugarReading[], tagsById: Map<string, TagDefinition>) {
  let insideCount = 0;
  let outsideCount = 0;
  let neutralCount = 0;

  for (const reading of readings) {
    const tags = reading.tagIds.map((tagId) => tagsById.get(tagId)).filter(Boolean) as TagDefinition[];
    const status = classifyReading(reading, tags).status;
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
    insideCount,
    outsideCount,
    neutralCount,
    insidePercent: evaluatedCount === 0 ? 0 : Math.round((insideCount / evaluatedCount) * 100),
    outsidePercent: evaluatedCount === 0 ? 0 : Math.round((outsideCount / evaluatedCount) * 100),
    highestValue: readings.length === 0 ? null : Math.max(...readings.map((reading) => reading.value)),
    lowestValue: readings.length === 0 ? null : Math.min(...readings.map((reading) => reading.value))
  };
}

export function syncTagStats(readings: SugarReading[], tags: TagDefinition[]) {
  const usageMap = new Map<string, { count: number; lastUsedAtIso: string | null }>();

  for (const reading of readings) {
    for (const tagId of reading.tagIds) {
      const previous = usageMap.get(tagId) ?? { count: 0, lastUsedAtIso: null };
      usageMap.set(tagId, {
        count: previous.count + 1,
        lastUsedAtIso:
          !previous.lastUsedAtIso || previous.lastUsedAtIso < reading.readingDateTimeIso
            ? reading.readingDateTimeIso
            : previous.lastUsedAtIso
      });
    }
  }

  return tags.map((tag) => {
    const usage = usageMap.get(tag.id);
    return {
      ...tag,
      usageCount: usage?.count ?? 0,
      lastUsedAtIso: usage?.lastUsedAtIso ?? null
    };
  });
}

export function sortTags(
  tags: TagDefinition[],
  settings: AppSettings,
  readings: SugarReading[]
) {
  const sorted = [...tags];

  switch (settings.tagSortMode) {
    case 'alphabetical':
      sorted.sort((left, right) => left.label.localeCompare(right.label));
      break;
    case 'creationDate':
      sorted.sort((left, right) => left.createdAtIso.localeCompare(right.createdAtIso));
      break;
    case 'popular': {
      const since = new Date();
      since.setDate(since.getDate() - settings.popularWindowDays + 1);
      const usageCounts = new Map<string, number>();
      for (const reading of readings) {
        if (reading.readingDateTimeIso < since.toISOString()) {
          continue;
        }

        for (const tagId of reading.tagIds) {
          usageCounts.set(tagId, (usageCounts.get(tagId) ?? 0) + 1);
        }
      }
      sorted.sort((left, right) => {
        const countGap = (usageCounts.get(right.id) ?? 0) - (usageCounts.get(left.id) ?? 0);
        return countGap === 0 ? left.label.localeCompare(right.label) : countGap;
      });
      break;
    }
    case 'recentlyUsed':
    default:
      sorted.sort((left, right) => {
        const rightValue = right.lastUsedAtIso ?? '';
        const leftValue = left.lastUsedAtIso ?? '';
        const dateGap = rightValue.localeCompare(leftValue);
        return dateGap === 0 ? left.label.localeCompare(right.label) : dateGap;
      });
      break;
  }

  return sorted;
}