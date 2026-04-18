export type TagType = 'builtin' | 'custom';

export type TagSortMode = 'recentlyUsed' | 'popular' | 'alphabetical' | 'creationDate';

export type ChartPreset = 'today' | 'lastWeek' | 'lastMonth' | 'thisMonth' | 'thisYear';

export type ReadingStatus = 'inside' | 'outside' | 'neutral';

export type VitalModule = 'sugar' | 'weight' | 'height' | 'bp';

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

export type ReadingFilters = {
  startDate: string;
  endDate: string;
  tagIds: string[];
};

export type AppDataShape = {
  readings: SugarReading[];
  tags: TagDefinition[];
  weightReadings: WeightReading[];
  weightTags: TagDefinition[];
  heightReadings: HeightReading[];
  heightTags: TagDefinition[];
  bpReadings: BpReading[];
  bpTags: BpTagDefinition[];
  settings: AppSettings;
};