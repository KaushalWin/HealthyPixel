import { DEFAULT_SETTINGS } from './defaults';
import type {
  AppDataShape,
  AppSettings,
  BpReading,
  BpTagDefinition,
  ChartPreset,
  FoodReading,
  FoodTagCategory,
  FoodTagDefinition,
  SugarReading,
  TagDefinition,
  TagSortMode,
  TagType,
  VitalModule,
  WeightReading,
  HeightReading
} from './types';

export const APP_DATA_EXPORT_APP = 'pixie-track';
export const APP_DATA_EXPORT_VERSION = 1;

export type AppDataExportPayload = {
  app: typeof APP_DATA_EXPORT_APP;
  version: typeof APP_DATA_EXPORT_VERSION;
  exportedAtIso: string;
  data: AppDataShape;
};

export class AppDataImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppDataImportError';
  }
}

const CHART_PRESETS: ChartPreset[] = ['today', 'lastWeek', 'lastMonth', 'thisMonth', 'thisYear'];
const TAG_SORT_MODES: TagSortMode[] = ['recentlyUsed', 'popular', 'alphabetical', 'creationDate'];
const TAG_TYPES: TagType[] = ['builtin', 'custom'];
const FOOD_TAG_CATEGORIES: FoodTagCategory[] = ['planned', 'actual', 'context', 'behavior'];
const VITAL_MODULES: VitalModule[] = ['sugar', 'weight', 'height', 'bp', 'food'];

function fail(message: string): never {
  throw new AppDataImportError(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) {
    fail(`${label} must be an object.`);
  }

  return value;
}

function readString(value: unknown, label: string): string {
  if (typeof value !== 'string') {
    fail(`${label} must be a string.`);
  }

  return value;
}

function readNullableString(value: unknown, label: string): string | null {
  if (value === null) return null;
  return readString(value, label);
}

function readFiniteNumber(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    fail(`${label} must be a finite number.`);
  }

  return value;
}

function readNullableNumber(value: unknown, label: string): number | null {
  if (value === null) return null;
  return readFiniteNumber(value, label);
}

function readStringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'string')) {
    fail(`${label} must be an array of strings.`);
  }

  return value;
}

function readEnumValue<T extends string>(value: unknown, allowed: readonly T[], label: string): T {
  const resolvedValue = readString(value, label);
  if (!allowed.includes(resolvedValue as T)) {
    fail(`${label} is invalid.`);
  }

  return resolvedValue as T;
}

function readOptionalEnumValue<T extends string>(
  record: Record<string, unknown>,
  key: string,
  allowed: readonly T[],
  fallback: T,
  label: string
): T {
  if (!(key in record)) {
    return fallback;
  }

  return readEnumValue(record[key], allowed, label);
}

function readOptionalString(record: Record<string, unknown>, key: string, fallback: string, label: string): string {
  if (!(key in record)) {
    return fallback;
  }

  return readString(record[key], label);
}

function readOptionalFiniteNumber(
  record: Record<string, unknown>,
  key: string,
  fallback: number,
  label: string
): number {
  if (!(key in record)) {
    return fallback;
  }

  return readFiniteNumber(record[key], label);
}

function readOptionalVitalModules(record: Record<string, unknown>, fallback: VitalModule[]): VitalModule[] {
  if (!('dashboardModules' in record)) {
    return fallback;
  }

  return readStringArray(record.dashboardModules, 'settings.dashboardModules').map((entry, index) =>
    readEnumValue(entry, VITAL_MODULES, `settings.dashboardModules[${index}]`)
  );
}

function readTagBase(record: Record<string, unknown>, label: string) {
  return {
    id: readString(record.id, `${label}.id`),
    label: readString(record.label, `${label}.label`),
    type: readEnumValue(record.type, TAG_TYPES, `${label}.type`),
    createdAtIso: readString(record.createdAtIso, `${label}.createdAtIso`),
    updatedAtIso: readString(record.updatedAtIso, `${label}.updatedAtIso`),
    usageCount: readFiniteNumber(record.usageCount, `${label}.usageCount`),
    lastUsedAtIso: readNullableString(record.lastUsedAtIso, `${label}.lastUsedAtIso`),
    rangeMin: readNullableNumber(record.rangeMin, `${label}.rangeMin`),
    rangeMax: readNullableNumber(record.rangeMax, `${label}.rangeMax`)
  };
}

function readValueReading(value: unknown, label: string): SugarReading | WeightReading | HeightReading {
  const record = readRecord(value, label);
  return {
    id: readString(record.id, `${label}.id`),
    value: readFiniteNumber(record.value, `${label}.value`),
    readingDateTimeIso: readString(record.readingDateTimeIso, `${label}.readingDateTimeIso`),
    tagIds: readStringArray(record.tagIds, `${label}.tagIds`),
    note: readNullableString(record.note, `${label}.note`),
    createdAtIso: readString(record.createdAtIso, `${label}.createdAtIso`),
    updatedAtIso: readString(record.updatedAtIso, `${label}.updatedAtIso`)
  };
}

function readSugarReadings(value: unknown): SugarReading[] {
  if (!Array.isArray(value)) {
    fail('data.readings must be an array.');
  }

  return value.map((entry, index) => readValueReading(entry, `data.readings[${index}]`) as SugarReading);
}

function readWeightReadings(value: unknown): WeightReading[] {
  if (!Array.isArray(value)) {
    fail('data.weightReadings must be an array.');
  }

  return value.map((entry, index) => readValueReading(entry, `data.weightReadings[${index}]`) as WeightReading);
}

function readHeightReadings(value: unknown): HeightReading[] {
  if (!Array.isArray(value)) {
    fail('data.heightReadings must be an array.');
  }

  return value.map((entry, index) => readValueReading(entry, `data.heightReadings[${index}]`) as HeightReading);
}

function readTags(value: unknown): TagDefinition[] {
  if (!Array.isArray(value)) {
    fail('data.tags must be an array.');
  }

  return value.map((entry, index) => {
    const record = readRecord(entry, `data.tags[${index}]`);
    return readTagBase(record, `data.tags[${index}]`);
  });
}

function readWeightTags(value: unknown): TagDefinition[] {
  if (!Array.isArray(value)) {
    fail('data.weightTags must be an array.');
  }

  return value.map((entry, index) => {
    const record = readRecord(entry, `data.weightTags[${index}]`);
    return readTagBase(record, `data.weightTags[${index}]`);
  });
}

function readHeightTags(value: unknown): TagDefinition[] {
  if (!Array.isArray(value)) {
    fail('data.heightTags must be an array.');
  }

  return value.map((entry, index) => {
    const record = readRecord(entry, `data.heightTags[${index}]`);
    return readTagBase(record, `data.heightTags[${index}]`);
  });
}

function readBpReadings(value: unknown): BpReading[] {
  if (!Array.isArray(value)) {
    fail('data.bpReadings must be an array.');
  }

  return value.map((entry, index) => {
    const record = readRecord(entry, `data.bpReadings[${index}]`);
    return {
      id: readString(record.id, `data.bpReadings[${index}].id`),
      systolic: readFiniteNumber(record.systolic, `data.bpReadings[${index}].systolic`),
      diastolic: readFiniteNumber(record.diastolic, `data.bpReadings[${index}].diastolic`),
      readingDateTimeIso: readString(record.readingDateTimeIso, `data.bpReadings[${index}].readingDateTimeIso`),
      tagIds: readStringArray(record.tagIds, `data.bpReadings[${index}].tagIds`),
      note: readNullableString(record.note, `data.bpReadings[${index}].note`),
      createdAtIso: readString(record.createdAtIso, `data.bpReadings[${index}].createdAtIso`),
      updatedAtIso: readString(record.updatedAtIso, `data.bpReadings[${index}].updatedAtIso`)
    };
  });
}

function readBpTags(value: unknown): BpTagDefinition[] {
  if (!Array.isArray(value)) {
    fail('data.bpTags must be an array.');
  }

  return value.map((entry, index) => {
    const record = readRecord(entry, `data.bpTags[${index}]`);
    return {
      ...readTagBase(record, `data.bpTags[${index}]`),
      systolicMin: readNullableNumber(record.systolicMin, `data.bpTags[${index}].systolicMin`),
      systolicMax: readNullableNumber(record.systolicMax, `data.bpTags[${index}].systolicMax`),
      diastolicMin: readNullableNumber(record.diastolicMin, `data.bpTags[${index}].diastolicMin`),
      diastolicMax: readNullableNumber(record.diastolicMax, `data.bpTags[${index}].diastolicMax`)
    };
  });
}

function readFoodReadings(value: unknown): FoodReading[] {
  if (!Array.isArray(value)) {
    fail('data.foodReadings must be an array.');
  }

  return value.map((entry, index) => {
    const record = readRecord(entry, `data.foodReadings[${index}]`);
    return {
      id: readString(record.id, `data.foodReadings[${index}].id`),
      mealName: readString(record.mealName, `data.foodReadings[${index}].mealName`),
      calories: readFiniteNumber(record.calories, `data.foodReadings[${index}].calories`),
      readingDateTimeIso: readString(record.readingDateTimeIso, `data.foodReadings[${index}].readingDateTimeIso`),
      tagIds: readStringArray(record.tagIds, `data.foodReadings[${index}].tagIds`),
      note: readNullableString(record.note, `data.foodReadings[${index}].note`),
      createdAtIso: readString(record.createdAtIso, `data.foodReadings[${index}].createdAtIso`),
      updatedAtIso: readString(record.updatedAtIso, `data.foodReadings[${index}].updatedAtIso`)
    };
  });
}

function readFoodTags(value: unknown): FoodTagDefinition[] {
  if (!Array.isArray(value)) {
    fail('data.foodTags must be an array.');
  }

  return value.map((entry, index) => {
    const record = readRecord(entry, `data.foodTags[${index}]`);
    return {
      ...readTagBase(record, `data.foodTags[${index}]`),
      category: readEnumValue(record.category, FOOD_TAG_CATEGORIES, `data.foodTags[${index}].category`)
    };
  });
}

function readSettings(value: unknown): AppSettings {
  const record = readRecord(value, 'data.settings');

  return {
    defaultChartPreset: readOptionalEnumValue(
      record,
      'defaultChartPreset',
      CHART_PRESETS,
      DEFAULT_SETTINGS.defaultChartPreset,
      'settings.defaultChartPreset'
    ),
    tagSortMode: readOptionalEnumValue(
      record,
      'tagSortMode',
      TAG_SORT_MODES,
      DEFAULT_SETTINGS.tagSortMode,
      'settings.tagSortMode'
    ),
    popularWindowDays: readOptionalFiniteNumber(
      record,
      'popularWindowDays',
      DEFAULT_SETTINGS.popularWindowDays,
      'settings.popularWindowDays'
    ),
    chartColorInside: readOptionalString(record, 'chartColorInside', DEFAULT_SETTINGS.chartColorInside, 'settings.chartColorInside'),
    chartColorOutside: readOptionalString(record, 'chartColorOutside', DEFAULT_SETTINGS.chartColorOutside, 'settings.chartColorOutside'),
    chartColorNeutral: readOptionalString(record, 'chartColorNeutral', DEFAULT_SETTINGS.chartColorNeutral, 'settings.chartColorNeutral'),
    weightChartColorInside: readOptionalString(record, 'weightChartColorInside', DEFAULT_SETTINGS.weightChartColorInside, 'settings.weightChartColorInside'),
    weightChartColorOutside: readOptionalString(record, 'weightChartColorOutside', DEFAULT_SETTINGS.weightChartColorOutside, 'settings.weightChartColorOutside'),
    weightChartColorNeutral: readOptionalString(record, 'weightChartColorNeutral', DEFAULT_SETTINGS.weightChartColorNeutral, 'settings.weightChartColorNeutral'),
    heightChartColorInside: readOptionalString(record, 'heightChartColorInside', DEFAULT_SETTINGS.heightChartColorInside, 'settings.heightChartColorInside'),
    heightChartColorOutside: readOptionalString(record, 'heightChartColorOutside', DEFAULT_SETTINGS.heightChartColorOutside, 'settings.heightChartColorOutside'),
    heightChartColorNeutral: readOptionalString(record, 'heightChartColorNeutral', DEFAULT_SETTINGS.heightChartColorNeutral, 'settings.heightChartColorNeutral'),
    bpChartColorSystolic: readOptionalString(record, 'bpChartColorSystolic', DEFAULT_SETTINGS.bpChartColorSystolic, 'settings.bpChartColorSystolic'),
    bpChartColorDiastolic: readOptionalString(record, 'bpChartColorDiastolic', DEFAULT_SETTINGS.bpChartColorDiastolic, 'settings.bpChartColorDiastolic'),
    bpChartColorNeutral: readOptionalString(record, 'bpChartColorNeutral', DEFAULT_SETTINGS.bpChartColorNeutral, 'settings.bpChartColorNeutral'),
    foodChartColorInside: readOptionalString(record, 'foodChartColorInside', DEFAULT_SETTINGS.foodChartColorInside, 'settings.foodChartColorInside'),
    foodChartColorOutside: readOptionalString(record, 'foodChartColorOutside', DEFAULT_SETTINGS.foodChartColorOutside, 'settings.foodChartColorOutside'),
    foodChartColorNeutral: readOptionalString(record, 'foodChartColorNeutral', DEFAULT_SETTINGS.foodChartColorNeutral, 'settings.foodChartColorNeutral'),
    dashboardModules: readOptionalVitalModules(record, DEFAULT_SETTINGS.dashboardModules),
    dashboardChartPreset: readOptionalEnumValue(
      record,
      'dashboardChartPreset',
      CHART_PRESETS,
      DEFAULT_SETTINGS.dashboardChartPreset,
      'settings.dashboardChartPreset'
    )
  };
}

export function buildAppDataExportPayload(data: AppDataShape, exportedAt = new Date()): AppDataExportPayload {
  return {
    app: APP_DATA_EXPORT_APP,
    version: APP_DATA_EXPORT_VERSION,
    exportedAtIso: exportedAt.toISOString(),
    data
  };
}

export function serializeAppDataExport(data: AppDataShape, exportedAt = new Date()) {
  return JSON.stringify(buildAppDataExportPayload(data, exportedAt), null, 2);
}

export function buildAppDataExportFileName(exportedAt = new Date()) {
  const timestamp = exportedAt.toISOString().replace(/[:.]/g, '-');
  return `pixie-track-export-${timestamp}.json`;
}

export function normalizeImportedAppData(value: unknown): AppDataShape {
  const record = readRecord(value, 'data');

  return {
    readings: readSugarReadings(record.readings),
    tags: readTags(record.tags),
    weightReadings: readWeightReadings(record.weightReadings),
    weightTags: readWeightTags(record.weightTags),
    heightReadings: readHeightReadings(record.heightReadings),
    heightTags: readHeightTags(record.heightTags),
    bpReadings: readBpReadings(record.bpReadings),
    bpTags: readBpTags(record.bpTags),
    foodReadings: readFoodReadings(record.foodReadings),
    foodTags: readFoodTags(record.foodTags),
    settings: readSettings(record.settings)
  };
}

export function parseAppDataImportJson(serializedPayload: string): AppDataShape {
  let parsed: unknown;

  try {
    parsed = JSON.parse(serializedPayload);
  } catch {
    fail('Import file is not valid JSON.');
  }

  const record = readRecord(parsed, 'Import payload');

  if ('app' in record) {
    const app = readString(record.app, 'payload.app');
    if (app !== APP_DATA_EXPORT_APP) {
      fail('Import file is not a PixieTrack export.');
    }
  }

  if ('version' in record) {
    const version = readFiniteNumber(record.version, 'payload.version');
    if (version !== APP_DATA_EXPORT_VERSION) {
      fail('Import file version is not supported.');
    }
  }

  const data = 'data' in record ? record.data : record;
  return normalizeImportedAppData(data);
}