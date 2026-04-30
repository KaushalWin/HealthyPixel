import type {
  AppSettings,
  BpTagCategory,
  BpTagDefinition,
  FoodReading,
  FoodTagCategory,
  FoodTagDefinition,
  SugarTagCategory,
  SugarTagDefinition,
  TagDefinition,
  WeightTagCategory,
  WeightTagDefinition
} from './types';

type BuiltInTagSeed<TCategory extends string> = {
  id: string;
  label: string;
  category: TCategory;
  rangeMin: number | null;
  rangeMax: number | null;
};

type FlatBuiltInTagSeed = {
  id: string;
  label: string;
  rangeMin: number | null;
  rangeMax: number | null;
};

type BpTagSeed = {
  id: string;
  label: string;
  category: BpTagCategory;
  systolicMin: number | null;
  systolicMax: number | null;
  diastolicMin: number | null;
  diastolicMax: number | null;
};

type FoodTagSeed = {
  id: string;
  label: string;
  category: FoodTagCategory;
  rangeMin: number | null;
  rangeMax: number | null;
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
  bpTags: 'hp.bp.tags.v1',
  foodReadings: 'hp.food.readings.v1',
  foodTags: 'hp.food.tags.v1',
  aiOpenAiApiKey: 'hp.ai.openai.api-key.v1',
  aiDeepSeekApiKey: 'hp.ai.deepseek.api-key.v1'
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
  bpChartColorNeutral: '#888888',
  foodChartColorInside: '#14804f',
  foodChartColorOutside: '#d64045',
  foodChartColorNeutral: '#b76d18',
  dashboardModules: ['sugar', 'weight', 'height', 'bp', 'food'],
  dashboardChartPreset: 'lastWeek'
};

const BUILT_IN_TAG_SEEDS: BuiltInTagSeed<SugarTagCategory>[] = [
  { id: 'pre-breakfast', label: 'Pre breakfast', category: 'timing', rangeMin: 70, rangeMax: 100 },
  { id: 'post-breakfast', label: 'Post breakfast', category: 'timing', rangeMin: 70, rangeMax: 140 },
  { id: 'pre-lunch', label: 'Pre lunch', category: 'timing', rangeMin: 70, rangeMax: 100 },
  { id: 'post-lunch', label: 'Post lunch', category: 'timing', rangeMin: 70, rangeMax: 140 },
  { id: 'pre-dinner', label: 'Pre dinner', category: 'timing', rangeMin: 70, rangeMax: 100 },
  { id: 'post-dinner', label: 'Post dinner', category: 'timing', rangeMin: 70, rangeMax: 140 },
  { id: 'pre-snack', label: 'Pre snack', category: 'timing', rangeMin: 70, rangeMax: 100 },
  { id: 'post-snack', label: 'Post snack', category: 'timing', rangeMin: 70, rangeMax: 140 },
  { id: 'pre-exercise', label: 'Pre exercise', category: 'activity', rangeMin: 70, rangeMax: 140 },
  { id: 'post-exercise', label: 'Post exercise', category: 'activity', rangeMin: 70, rangeMax: 140 },
  { id: 'random', label: 'Random', category: 'context', rangeMin: 70, rangeMax: 140 },
  { id: 'fasting', label: 'Fasting', category: 'timing', rangeMin: 70, rangeMax: 100 },
  { id: 'weekend', label: 'Weekend', category: 'context', rangeMin: 70, rangeMax: 140 },
  { id: 'cheat', label: 'Cheat', category: 'context', rangeMin: 70, rangeMax: 140 }
];

const WEIGHT_TAG_SEEDS: BuiltInTagSeed<WeightTagCategory>[] = [
  { id: 'w-morning', label: 'Morning', category: 'timing', rangeMin: null, rangeMax: null },
  { id: 'w-evening', label: 'Evening', category: 'timing', rangeMin: null, rangeMax: null },
  { id: 'w-pre-exercise', label: 'Pre exercise', category: 'bodyState', rangeMin: null, rangeMax: null },
  { id: 'w-post-exercise', label: 'Post exercise', category: 'bodyState', rangeMin: null, rangeMax: null },
  { id: 'w-fasting', label: 'Fasting', category: 'bodyState', rangeMin: null, rangeMax: null },
  { id: 'w-random', label: 'Random', category: 'routine', rangeMin: null, rangeMax: null }
];

const HEIGHT_TAG_SEEDS: FlatBuiltInTagSeed[] = [
  { id: 'h-standing', label: 'Standing', rangeMin: null, rangeMax: null },
  { id: 'h-morning', label: 'Morning', rangeMin: null, rangeMax: null },
  { id: 'h-random', label: 'Random', rangeMin: null, rangeMax: null }
];

const BP_TAG_SEEDS: BpTagSeed[] = [
  { id: 'bp-morning', label: 'Morning', category: 'timing', systolicMin: 90, systolicMax: 140, diastolicMin: 60, diastolicMax: 90 },
  { id: 'bp-evening', label: 'Evening', category: 'timing', systolicMin: 90, systolicMax: 140, diastolicMin: 60, diastolicMax: 90 },
  { id: 'bp-pre-exercise', label: 'Pre exercise', category: 'bodyState', systolicMin: 90, systolicMax: 140, diastolicMin: 60, diastolicMax: 90 },
  { id: 'bp-post-exercise', label: 'Post exercise', category: 'bodyState', systolicMin: 90, systolicMax: 170, diastolicMin: 60, diastolicMax: 90 },
  { id: 'bp-resting', label: 'Resting', category: 'bodyState', systolicMin: 90, systolicMax: 120, diastolicMin: 60, diastolicMax: 80 },
  { id: 'bp-random', label: 'Random', category: 'context', systolicMin: 90, systolicMax: 140, diastolicMin: 60, diastolicMax: 90 }
];

const FOOD_TAG_SEEDS: FoodTagSeed[] = [
  { id: 'food-planned-healthy', label: 'Healthy', category: 'planned', rangeMin: 250, rangeMax: 550 },
  { id: 'food-planned-high-protein', label: 'High protein', category: 'planned', rangeMin: 350, rangeMax: 700 },
  { id: 'food-planned-light', label: 'Light', category: 'planned', rangeMin: 120, rangeMax: 320 },
  { id: 'food-planned-comfort', label: 'Comfort', category: 'planned', rangeMin: 450, rangeMax: 850 },
  { id: 'food-actual-portion-ok', label: 'Portion ok', category: 'actual', rangeMin: 250, rangeMax: 600 },
  { id: 'food-actual-overeat', label: 'Overeat', category: 'actual', rangeMin: 700, rangeMax: 1500 },
  { id: 'food-actual-heavy', label: 'Heavy', category: 'actual', rangeMin: 650, rangeMax: 1400 },
  { id: 'food-actual-light', label: 'Light meal', category: 'actual', rangeMin: 100, rangeMax: 320 },
  { id: 'food-context-breakfast', label: 'Breakfast', category: 'context', rangeMin: null, rangeMax: null },
  { id: 'food-context-lunch', label: 'Lunch', category: 'context', rangeMin: null, rangeMax: null },
  { id: 'food-context-dinner', label: 'Dinner', category: 'context', rangeMin: null, rangeMax: null },
  { id: 'food-context-snack', label: 'Snack', category: 'context', rangeMin: null, rangeMax: null },
  { id: 'food-context-cheat', label: 'Cheat', category: 'context', rangeMin: null, rangeMax: null },
  { id: 'food-context-office', label: 'Office', category: 'context', rangeMin: null, rangeMax: null },
  { id: 'food-behavior-bored-binge', label: 'Bored binge', category: 'behavior', rangeMin: null, rangeMax: null },
  { id: 'food-behavior-mindful', label: 'Mindful', category: 'behavior', rangeMin: null, rangeMax: null },
  { id: 'food-behavior-rushed', label: 'Rushed', category: 'behavior', rangeMin: null, rangeMax: null },
  { id: 'food-behavior-stress-eat', label: 'Stress eat', category: 'behavior', rangeMin: null, rangeMax: null }
];

export function createDefaultTags(nowIso = new Date().toISOString()): SugarTagDefinition[] {
  return BUILT_IN_TAG_SEEDS.map((seed) => ({
    ...seed,
    type: 'builtin',
    createdAtIso: nowIso,
    updatedAtIso: nowIso,
    usageCount: 0,
    lastUsedAtIso: null
  }));
}

export function createDefaultWeightTags(nowIso = new Date().toISOString()): WeightTagDefinition[] {
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

export function createDefaultFoodTags(nowIso = new Date().toISOString()): FoodTagDefinition[] {
  return FOOD_TAG_SEEDS.map((seed) => ({
    ...seed,
    type: 'builtin',
    createdAtIso: nowIso,
    updatedAtIso: nowIso,
    usageCount: 0,
    lastUsedAtIso: null
  }));
}

type FoodSampleSeed = {
  id: string;
  mealName: string;
  calories: number;
  dayOffset: number;
  hour: number;
  minute: number;
  tagIds: string[];
  note: string | null;
};

const FOOD_SAMPLE_SEEDS: FoodSampleSeed[] = [
  {
    id: 'food-sample-paneer-roti',
    mealName: 'Paneer Roti',
    calories: 640,
    dayOffset: -5,
    hour: 20,
    minute: 15,
    tagIds: ['food-planned-high-protein', 'food-actual-heavy', 'food-context-dinner'],
    note: 'Felt full but still within planned dinner idea.'
  },
  {
    id: 'food-sample-oats-bowl',
    mealName: 'Oats Fruit Bowl',
    calories: 320,
    dayOffset: -5,
    hour: 8,
    minute: 10,
    tagIds: ['food-planned-healthy', 'food-actual-light', 'food-context-breakfast', 'food-behavior-mindful'],
    note: 'Quick breakfast before work.'
  },
  {
    id: 'food-sample-burger-combo',
    mealName: 'Burger Combo',
    calories: 980,
    dayOffset: -4,
    hour: 21,
    minute: 0,
    tagIds: ['food-planned-comfort', 'food-actual-overeat', 'food-context-dinner', 'food-context-cheat', 'food-behavior-bored-binge'],
    note: 'Late dinner after a long day.'
  },
  {
    id: 'food-sample-curd-rice',
    mealName: 'Curd Rice Bowl',
    calories: 410,
    dayOffset: -4,
    hour: 13,
    minute: 20,
    tagIds: ['food-planned-healthy', 'food-actual-portion-ok', 'food-context-lunch'],
    note: null
  },
  {
    id: 'food-sample-salad-wrap',
    mealName: 'Paneer Salad Wrap',
    calories: 360,
    dayOffset: -3,
    hour: 14,
    minute: 0,
    tagIds: ['food-planned-high-protein', 'food-actual-portion-ok', 'food-context-lunch', 'food-context-office'],
    note: 'Packed lunch.'
  },
  {
    id: 'food-sample-chips',
    mealName: 'Chips + Cola',
    calories: 540,
    dayOffset: -3,
    hour: 18,
    minute: 25,
    tagIds: ['food-planned-comfort', 'food-actual-heavy', 'food-context-snack', 'food-behavior-stress-eat'],
    note: 'Stress snack between tasks.'
  },
  {
    id: 'food-sample-khichdi',
    mealName: 'Moong Dal Khichdi',
    calories: 430,
    dayOffset: -2,
    hour: 20,
    minute: 5,
    tagIds: ['food-planned-healthy', 'food-actual-portion-ok', 'food-context-dinner', 'food-behavior-mindful'],
    note: null
  },
  {
    id: 'food-sample-protein-shake',
    mealName: 'Protein Shake',
    calories: 220,
    dayOffset: -2,
    hour: 7,
    minute: 45,
    tagIds: ['food-planned-high-protein', 'food-actual-light', 'food-context-breakfast'],
    note: 'Post workout breakfast start.'
  },
  {
    id: 'food-sample-thali',
    mealName: 'Gujarati Thali',
    calories: 880,
    dayOffset: -1,
    hour: 13,
    minute: 10,
    tagIds: ['food-planned-comfort', 'food-actual-heavy', 'food-context-lunch', 'food-context-cheat'],
    note: 'Family lunch out.'
  },
  {
    id: 'food-sample-fruit-bowl',
    mealName: 'Fruit Bowl',
    calories: 180,
    dayOffset: -1,
    hour: 17,
    minute: 5,
    tagIds: ['food-planned-light', 'food-actual-light', 'food-context-snack', 'food-behavior-mindful'],
    note: null
  },
  {
    id: 'food-sample-dal-roti',
    mealName: 'Dal Roti',
    calories: 510,
    dayOffset: 0,
    hour: 20,
    minute: 35,
    tagIds: ['food-planned-healthy', 'food-actual-portion-ok', 'food-context-dinner'],
    note: 'Simple home dinner.'
  },
  {
    id: 'food-sample-ice-cream',
    mealName: 'Ice Cream Cup',
    calories: 310,
    dayOffset: 0,
    hour: 22,
    minute: 0,
    tagIds: ['food-planned-comfort', 'food-actual-light', 'food-context-snack', 'food-behavior-bored-binge'],
    note: 'Craving after dinner.'
  }
];

export function createDefaultFoodReadings(now = new Date()): FoodReading[] {
  return FOOD_SAMPLE_SEEDS.map((seed) => {
    const readingDate = new Date(now);
    readingDate.setDate(readingDate.getDate() + seed.dayOffset);
    readingDate.setHours(seed.hour, seed.minute, 0, 0);
    const readingDateTimeIso = readingDate.toISOString();

    return {
      id: seed.id,
      mealName: seed.mealName,
      calories: seed.calories,
      readingDateTimeIso,
      tagIds: seed.tagIds,
      note: seed.note,
      createdAtIso: readingDateTimeIso,
      updatedAtIso: readingDateTimeIso
    };
  });
}