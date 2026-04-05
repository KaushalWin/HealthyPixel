import type { AppSettings, TagDefinition } from './types';

type BuiltInTagSeed = {
  id: string;
  label: string;
  rangeMin: number | null;
  rangeMax: number | null;
};

export const STORAGE_KEYS = {
  readings: 'hp.readings.v1',
  tags: 'hp.tags.v1',
  settings: 'hp.settings.v1'
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  defaultChartPreset: 'lastWeek',
  tagSortMode: 'recentlyUsed',
  popularWindowDays: 14,
  chartColorInside: '#14804f',
  chartColorOutside: '#d64045',
  chartColorNeutral: '#2176d2'
};

const BUILT_IN_TAG_SEEDS: BuiltInTagSeed[] = [
  { id: 'pre-breakfast', label: 'Pre breakfast', rangeMin: 70, rangeMax: 100 },
  { id: 'post-breakfast', label: 'Post breakfast', rangeMin: 70, rangeMax: 140 },
  { id: 'pre-lunch', label: 'Pre lunch', rangeMin: 70, rangeMax: 100 },
  { id: 'post-lunch', label: 'Post lunch', rangeMin: 70, rangeMax: 140 },
  { id: 'pre-dinner', label: 'Pre dinner', rangeMin: 70, rangeMax: 100 },
  { id: 'post-dinner', label: 'Post dinner', rangeMin: 70, rangeMax: 140 },
  { id: 'pre-snack', label: 'Pre snack', rangeMin: 70, rangeMax: 100 },
  { id: 'post-snack', label: 'Post snack', rangeMin: 70, rangeMax: 140 },
  { id: 'pre-exercise', label: 'Pre exercise', rangeMin: 70, rangeMax: 140 },
  { id: 'post-exercise', label: 'Post exercise', rangeMin: 70, rangeMax: 140 },
  { id: 'random', label: 'Random', rangeMin: 70, rangeMax: 140 },
  { id: 'fasting', label: 'Fasting', rangeMin: 70, rangeMax: 100 },
  { id: 'weekend', label: 'Weekend', rangeMin: 70, rangeMax: 140 },
  { id: 'cheat', label: 'Cheat', rangeMin: 70, rangeMax: 140 }
];

export function createDefaultTags(nowIso = new Date().toISOString()): TagDefinition[] {
  return BUILT_IN_TAG_SEEDS.map((seed) => ({
    ...seed,
    type: 'builtin',
    createdAtIso: nowIso,
    updatedAtIso: nowIso,
    usageCount: 0,
    lastUsedAtIso: null
  }));
}