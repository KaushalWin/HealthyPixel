import type { AppSettings, BpTagDefinition, TagDefinition } from './types';

type BuiltInTagSeed = {
  id: string;
  label: string;
  rangeMin: number | null;
  rangeMax: number | null;
};

type BpTagSeed = {
  id: string;
  label: string;
  systolicMin: number | null;
  systolicMax: number | null;
  diastolicMin: number | null;
  diastolicMax: number | null;
};

export const STORAGE_KEYS = {
  readings: 'hp.readings.v1',
  tags: 'hp.tags.v1',
  settings: 'hp.settings.v1',
  weightReadings: 'hp.weight.readings.v1',
  weightTags: 'hp.weight.tags.v1',
  heightReadings: 'hp.height.readings.v1',
  heightTags: 'hp.height.tags.v1',
  bpReadings: 'hp.bp.readings.v1',
  bpTags: 'hp.bp.tags.v1'
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  defaultChartPreset: 'lastWeek',
  tagSortMode: 'recentlyUsed',
  popularWindowDays: 14,
  chartColorInside: '#14804f',
  chartColorOutside: '#d64045',
  chartColorNeutral: '#2176d2',
  weightChartColorInside: '#14804f',
  weightChartColorOutside: '#d64045',
  weightChartColorNeutral: '#6b5ce7',
  heightChartColorInside: '#14804f',
  heightChartColorOutside: '#d64045',
  heightChartColorNeutral: '#e67e22',
  bpChartColorSystolic: '#d64045',
  bpChartColorDiastolic: '#2176d2',
  bpChartColorNeutral: '#888888'
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

const WEIGHT_TAG_SEEDS: BuiltInTagSeed[] = [
  { id: 'w-morning', label: 'Morning', rangeMin: null, rangeMax: null },
  { id: 'w-evening', label: 'Evening', rangeMin: null, rangeMax: null },
  { id: 'w-pre-exercise', label: 'Pre exercise', rangeMin: null, rangeMax: null },
  { id: 'w-post-exercise', label: 'Post exercise', rangeMin: null, rangeMax: null },
  { id: 'w-fasting', label: 'Fasting', rangeMin: null, rangeMax: null },
  { id: 'w-random', label: 'Random', rangeMin: null, rangeMax: null }
];

const HEIGHT_TAG_SEEDS: BuiltInTagSeed[] = [
  { id: 'h-standing', label: 'Standing', rangeMin: null, rangeMax: null },
  { id: 'h-morning', label: 'Morning', rangeMin: null, rangeMax: null },
  { id: 'h-random', label: 'Random', rangeMin: null, rangeMax: null }
];

const BP_TAG_SEEDS: BpTagSeed[] = [
  { id: 'bp-morning', label: 'Morning', systolicMin: 90, systolicMax: 140, diastolicMin: 60, diastolicMax: 90 },
  { id: 'bp-evening', label: 'Evening', systolicMin: 90, systolicMax: 140, diastolicMin: 60, diastolicMax: 90 },
  { id: 'bp-pre-exercise', label: 'Pre exercise', systolicMin: 90, systolicMax: 140, diastolicMin: 60, diastolicMax: 90 },
  { id: 'bp-post-exercise', label: 'Post exercise', systolicMin: 90, systolicMax: 170, diastolicMin: 60, diastolicMax: 90 },
  { id: 'bp-resting', label: 'Resting', systolicMin: 90, systolicMax: 120, diastolicMin: 60, diastolicMax: 80 },
  { id: 'bp-random', label: 'Random', systolicMin: 90, systolicMax: 140, diastolicMin: 60, diastolicMax: 90 }
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

export function createDefaultWeightTags(nowIso = new Date().toISOString()): TagDefinition[] {
  return WEIGHT_TAG_SEEDS.map((seed) => ({
    ...seed,
    type: 'builtin',
    createdAtIso: nowIso,
    updatedAtIso: nowIso,
    usageCount: 0,
    lastUsedAtIso: null
  }));
}

export function createDefaultHeightTags(nowIso = new Date().toISOString()): TagDefinition[] {
  return HEIGHT_TAG_SEEDS.map((seed) => ({
    ...seed,
    type: 'builtin',
    createdAtIso: nowIso,
    updatedAtIso: nowIso,
    usageCount: 0,
    lastUsedAtIso: null
  }));
}

export function createDefaultBpTags(nowIso = new Date().toISOString()): BpTagDefinition[] {
  return BP_TAG_SEEDS.map((seed) => ({
    ...seed,
    type: 'builtin',
    createdAtIso: nowIso,
    updatedAtIso: nowIso,
    usageCount: 0,
    lastUsedAtIso: null,
    rangeMin: null,
    rangeMax: null
  }));
}