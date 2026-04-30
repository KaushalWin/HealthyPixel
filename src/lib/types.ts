export type TagType = 'builtin' | 'custom';

export type TagSortMode = 'recentlyUsed' | 'popular' | 'alphabetical' | 'creationDate';

export type ChartPreset = 'today' | 'lastWeek' | 'lastMonth' | 'thisMonth' | 'thisYear';

export type ReadingStatus = 'inside' | 'outside' | 'neutral';

export type VitalModule = 'sugar' | 'weight' | 'height' | 'bp' | 'food';

export type SugarTagCategory = 'timing' | 'activity' | 'context' | 'general';

export type WeightTagCategory = 'timing' | 'bodyState' | 'routine' | 'general';

export type BpTagCategory = 'timing' | 'bodyState' | 'context' | 'general';

export type FoodTagCategory = 'planned' | 'actual' | 'context' | 'behavior';

export type LogicalMatchMode = 'and' | 'or';

export type TagDefinition = {
  id: string;
  label: string;
  type: TagType;
  createdAtIso: string;
  updatedAtIso: string;
  usageCount: number;
  lastUsedAtIso: string | null;
  rangeMin: number | null;
  rangeMax: number | null;
};

export type CategorizedTagDefinition<TCategory extends string> = TagDefinition & {
  category: TCategory;
};

export type SugarTagDefinition = CategorizedTagDefinition<SugarTagCategory>;

export type WeightTagDefinition = CategorizedTagDefinition<WeightTagCategory>;

export type BpTagDefinition = {
  id: string;
  label: string;
  type: TagType;
  createdAtIso: string;
  updatedAtIso: string;
  usageCount: number;
  lastUsedAtIso: string | null;
  rangeMin: number | null;
  rangeMax: number | null;
  systolicMin: number | null;
  systolicMax: number | null;
  diastolicMin: number | null;
  diastolicMax: number | null;
  category: BpTagCategory;
};

export type FoodTagDefinition = {
  id: string;
  label: string;
  type: TagType;
  createdAtIso: string;
  updatedAtIso: string;
  usageCount: number;
  lastUsedAtIso: string | null;
  rangeMin: number | null;
  rangeMax: number | null;
  category: FoodTagCategory;
};

export type SugarReading = {
  id: string;
  value: number;
  readingDateTimeIso: string;
  tagIds: string[];
  note: string | null;
  createdAtIso: string;
  updatedAtIso: string;
};

export type WeightReading = {
  id: string;
  value: number;
  readingDateTimeIso: string;
  tagIds: string[];
  note: string | null;
  createdAtIso: string;
  updatedAtIso: string;
};

export type HeightReading = {
  id: string;
  value: number;
  readingDateTimeIso: string;
  tagIds: string[];
  note: string | null;
  createdAtIso: string;
  updatedAtIso: string;
};

export type BpReading = {
  id: string;
  systolic: number;
  diastolic: number;
  readingDateTimeIso: string;
  tagIds: string[];
  note: string | null;
  createdAtIso: string;
  updatedAtIso: string;
};

export type FoodReading = {
  id: string;
  mealName: string;
  calories: number;
  readingDateTimeIso: string;
  tagIds: string[];
  note: string | null;
  createdAtIso: string;
  updatedAtIso: string;
};

export type AppSettings = {
  defaultChartPreset: ChartPreset;
  tagSortMode: TagSortMode;
  popularWindowDays: number;
  chartColorInside: string;
  chartColorOutside: string;
  chartColorNeutral: string;
  weightChartColorInside: string;
  weightChartColorOutside: string;
  weightChartColorNeutral: string;
  heightChartColorInside: string;
  heightChartColorOutside: string;
  heightChartColorNeutral: string;
  bpChartColorSystolic: string;
  bpChartColorDiastolic: string;
  bpChartColorNeutral: string;
  foodChartColorInside: string;
  foodChartColorOutside: string;
  foodChartColorNeutral: string;
  dashboardModules: VitalModule[];
  dashboardChartPreset: ChartPreset;
};

export type ReadingDraft = {
  value: number;
  readingDateTimeIso: string;
  tagIds: string[];
  note: string | null;
};

export type BpDraft = {
  systolic: number;
  diastolic: number;
  readingDateTimeIso: string;
  tagIds: string[];
  note: string | null;
};

export type FoodReadingDraft = {
  mealName: string;
  calories: number;
  readingDateTimeIso: string;
  tagIds: string[];
  note: string | null;
};

export type ReadingFilters = {
  startDate: string;
  endDate: string;
  tagIds: string[];
};

export type CategorizedReadingFilters<TCategory extends string> = ReadingFilters & {
  categories: TCategory[];
};

export type SugarReadingFilters = CategorizedReadingFilters<SugarTagCategory>;

export type WeightReadingFilters = CategorizedReadingFilters<WeightTagCategory>;

export type BpReadingFilters = CategorizedReadingFilters<BpTagCategory>;

export type FoodReadingFilters = ReadingFilters & {
  categories: FoodTagCategory[];
  tagMatchMode: LogicalMatchMode;
  categoryMatchMode: LogicalMatchMode;
  combinedMode: LogicalMatchMode;
};

export type AppDataShape = {
  readings: SugarReading[];
  tags: SugarTagDefinition[];
  weightReadings: WeightReading[];
  weightTags: WeightTagDefinition[];
  heightReadings: HeightReading[];
  heightTags: TagDefinition[];
  bpReadings: BpReading[];
  bpTags: BpTagDefinition[];
  foodReadings: FoodReading[];
  foodTags: FoodTagDefinition[];
  settings: AppSettings;
};