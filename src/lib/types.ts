export type TagType = 'builtin' | 'custom';

export type TagSortMode = 'recentlyUsed' | 'popular' | 'alphabetical' | 'creationDate';

export type ChartPreset = 'today' | 'lastWeek' | 'lastMonth' | 'thisMonth' | 'thisYear';

export type ReadingStatus = 'inside' | 'outside' | 'neutral';

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

export type SugarReading = {
  id: string;
  value: number;
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
};

export type ReadingDraft = {
  value: number;
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
  settings: AppSettings;
};