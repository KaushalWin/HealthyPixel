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

  it('builds a json export filename', () => {
    expect(buildAppDataExportFileName(fixedNow)).toBe('pixie-track-export-2026-04-29T12-00-00-000Z.json');
  });
});