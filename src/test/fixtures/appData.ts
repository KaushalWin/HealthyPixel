import { DEFAULT_SETTINGS, createDefaultBpTags, createDefaultFoodReadings, createDefaultFoodTags, createDefaultHeightTags, createDefaultTags, createDefaultWeightTags } from '../../lib/defaults';
import type { AppDataShape } from '../../lib/types';

export const fixedNow = new Date('2026-04-29T12:00:00.000Z');
export const fixedNowIso = fixedNow.toISOString();

export function createFixtureAppData(): AppDataShape {
  return {
    readings: [
      {
        id: 'sugar-1',
        value: 112,
        readingDateTimeIso: fixedNowIso,
        tagIds: ['fasting'],
        note: 'Morning check',
        createdAtIso: fixedNowIso,
        updatedAtIso: fixedNowIso
      }
    ],
    tags: createDefaultTags(fixedNowIso),
    weightReadings: [
      {
        id: 'weight-1',
        value: 78.4,
        readingDateTimeIso: fixedNowIso,
        tagIds: ['w-morning'],
        note: null,
        createdAtIso: fixedNowIso,
        updatedAtIso: fixedNowIso
      }
    ],
    weightTags: createDefaultWeightTags(fixedNowIso),
    heightReadings: [
      {
        id: 'height-1',
        value: 172,
        readingDateTimeIso: fixedNowIso,
        tagIds: ['h-standing'],
        note: null,
        createdAtIso: fixedNowIso,
        updatedAtIso: fixedNowIso
      }
    ],
    heightTags: createDefaultHeightTags(fixedNowIso),
    bpReadings: [
      {
        id: 'bp-1',
        systolic: 124,
        diastolic: 82,
        readingDateTimeIso: fixedNowIso,
        tagIds: ['bp-morning'],
        note: 'Before breakfast',
        createdAtIso: fixedNowIso,
        updatedAtIso: fixedNowIso
      }
    ],
    bpTags: createDefaultBpTags(fixedNowIso),
    foodReadings: createDefaultFoodReadings(fixedNow),
    foodTags: createDefaultFoodTags(fixedNowIso),
    settings: {
      ...DEFAULT_SETTINGS,
      popularWindowDays: 21,
      dashboardModules: ['food', 'sugar', 'bp']
    }
  };
}