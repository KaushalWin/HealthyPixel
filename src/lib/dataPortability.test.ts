import { describe, expect, it } from 'vitest';
import {
  APP_DATA_EXPORT_APP,
  APP_DATA_EXPORT_VERSION,
  AppDataImportError,
  buildAppDataExportFileName,
  buildAppDataExportPayload,
  parseAppDataImportJson,
  serializeAppDataExport
} from './dataPortability';
import { createFixtureAppData, fixedNow, fixedNowIso } from '../test/fixtures/appData';

describe('dataPortability', () => {
  it('builds a versioned export payload', () => {
    const fixture = createFixtureAppData();
    const payload = buildAppDataExportPayload(fixture, fixedNow);

    expect(payload).toEqual({
      app: APP_DATA_EXPORT_APP,
      version: APP_DATA_EXPORT_VERSION,
      exportedAtIso: fixedNowIso,
      data: fixture
    });
  });

  it('round-trips exported app data through JSON import parsing', () => {
    const fixture = createFixtureAppData();
    const serialized = serializeAppDataExport(fixture, fixedNow);

    expect(parseAppDataImportJson(serialized)).toEqual(fixture);
  });

  it('rejects malformed JSON', () => {
    expect(() => parseAppDataImportJson('{not-json')).toThrow(AppDataImportError);
    expect(() => parseAppDataImportJson('{not-json')).toThrow('Import file is not valid JSON.');
  });

  it('rejects payloads with missing required app data keys', () => {
    const serialized = JSON.stringify({
      app: APP_DATA_EXPORT_APP,
      version: APP_DATA_EXPORT_VERSION,
      exportedAtIso: fixedNowIso,
      data: {
        readings: [],
        tags: []
      }
    });

    expect(() => parseAppDataImportJson(serialized)).toThrow('data.weightReadings must be an array.');
  });

  it('normalizes legacy export payloads that predate tag categories', () => {
    const fixture = createFixtureAppData();
    const serialized = JSON.stringify({
      app: APP_DATA_EXPORT_APP,
      version: 1,
      exportedAtIso: fixedNowIso,
      data: {
        ...fixture,
        tags: [
          ...fixture.tags.map(({ category, ...tag }) => tag),
          {
            id: 'legacy-sugar-custom',
            label: 'Night shift',
            type: 'custom',
            createdAtIso: fixedNowIso,
            updatedAtIso: fixedNowIso,
            usageCount: 0,
            lastUsedAtIso: null,
            rangeMin: null,
            rangeMax: null
          }
        ],
        weightTags: fixture.weightTags.map(({ category, ...tag }) => tag),
        bpTags: fixture.bpTags.map(({ category, ...tag }) => tag)
      }
    });

    const parsed = parseAppDataImportJson(serialized);

    expect(parsed.tags.find((tag) => tag.id === 'fasting')?.category).toBe('timing');
    expect(parsed.tags.find((tag) => tag.id === 'legacy-sugar-custom')?.category).toBe('general');
    expect(parsed.weightTags.find((tag) => tag.id === 'w-pre-exercise')?.category).toBe('bodyState');
    expect(parsed.bpTags.find((tag) => tag.id === 'bp-random')?.category).toBe('context');
  });

  it('builds a json export filename', () => {
    expect(buildAppDataExportFileName(fixedNow)).toBe('pixie-track-export-2026-04-29T12-00-00-000Z.json');
  });
});