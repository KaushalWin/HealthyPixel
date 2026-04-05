import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createDefaultTags, DEFAULT_SETTINGS, STORAGE_KEYS } from '../lib/defaults';
import { createStableId, safeLocalStorageGet, safeLocalStorageSet } from '../lib/platform';
import { parseStoredJson, syncTagStats } from '../lib/readingUtils';
import type { AppDataShape, AppSettings, ReadingDraft, SugarReading, TagDefinition } from '../lib/types';

type AppDataContextValue = AppDataShape & {
  addReading: (draft: ReadingDraft) => SugarReading;
  updateReading: (readingId: string, draft: ReadingDraft) => SugarReading | null;
  addTag: (label: string, rangeMin: number | null, rangeMax: number | null) => TagDefinition;
  updateTag: (tagId: string, updates: Partial<Omit<TagDefinition, 'id' | 'type' | 'createdAtIso'>>) => void;
  removeTag: (tagId: string) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetAllData: () => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

function loadInitialAppData(): AppDataShape {
  const nowIso = new Date().toISOString();
  const readings = parseStoredJson<SugarReading[]>(safeLocalStorageGet(STORAGE_KEYS.readings), []);
  const tags = parseStoredJson<TagDefinition[]>(
    safeLocalStorageGet(STORAGE_KEYS.tags),
    createDefaultTags(nowIso)
  );
  const settings = parseStoredJson<AppSettings>(
    safeLocalStorageGet(STORAGE_KEYS.settings),
    DEFAULT_SETTINGS
  );

  return {
    readings,
    tags: syncTagStats(readings, tags),
    settings: { ...DEFAULT_SETTINGS, ...settings }
  };
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppDataShape>(loadInitialAppData);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.readings, JSON.stringify(state.readings));
  }, [state.readings]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.tags, JSON.stringify(state.tags));
  }, [state.tags]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.settings, JSON.stringify(state.settings));
  }, [state.settings]);

  const value = useMemo<AppDataContextValue>(() => ({
    ...state,
    addReading: (draft) => {
      const nowIso = new Date().toISOString();
      const reading: SugarReading = {
        id: createStableId(),
        value: draft.value,
        readingDateTimeIso: draft.readingDateTimeIso,
        tagIds: draft.tagIds,
        note: draft.note?.trim() ? draft.note.trim() : null,
        createdAtIso: nowIso,
        updatedAtIso: nowIso
      };

      setState((current) => {
        const nextReadings = [...current.readings, reading];
        return {
          ...current,
          readings: nextReadings,
          tags: syncTagStats(nextReadings, current.tags)
        };
      });

      return reading;
    },
    updateReading: (readingId, draft) => {
      let updatedReading: SugarReading | null = null;
      setState((current) => {
        const nextReadings = current.readings.map((reading) => {
          if (reading.id !== readingId) {
            return reading;
          }

          updatedReading = {
            ...reading,
            value: draft.value,
            readingDateTimeIso: draft.readingDateTimeIso,
            tagIds: draft.tagIds,
            note: draft.note?.trim() ? draft.note.trim() : null,
            updatedAtIso: new Date().toISOString()
          };
          return updatedReading;
        });

        return {
          ...current,
          readings: nextReadings,
          tags: syncTagStats(nextReadings, current.tags)
        };
      });

      return updatedReading;
    },
    addTag: (label, rangeMin, rangeMax) => {
      const nowIso = new Date().toISOString();
      const tag: TagDefinition = {
        id: createStableId(),
        label: label.trim(),
        type: 'custom',
        createdAtIso: nowIso,
        updatedAtIso: nowIso,
        usageCount: 0,
        lastUsedAtIso: null,
        rangeMin,
        rangeMax
      };

      setState((current) => ({
        ...current,
        tags: [...current.tags, tag]
      }));

      return tag;
    },
    updateTag: (tagId, updates) => {
      setState((current) => ({
        ...current,
        tags: current.tags.map((tag) => {
          if (tag.id !== tagId) {
            return tag;
          }

          const trimmedLabel = updates.label?.trim();
          const hasDuplicateLabel =
            typeof trimmedLabel === 'string' &&
            trimmedLabel.length > 0 &&
            current.tags.some(
              (candidate) =>
                candidate.id !== tagId &&
                candidate.label.toLowerCase() === trimmedLabel.toLowerCase()
            );

          const resolvedLabel =
            typeof trimmedLabel === 'string' && trimmedLabel.length > 0 && !hasDuplicateLabel
              ? trimmedLabel
              : tag.label;

          let resolvedRangeMin = updates.rangeMin ?? tag.rangeMin;
          let resolvedRangeMax = updates.rangeMax ?? tag.rangeMax;

          if (
            resolvedRangeMin !== null &&
            resolvedRangeMax !== null &&
            resolvedRangeMin > resolvedRangeMax
          ) {
            if (updates.rangeMin !== undefined && updates.rangeMax === undefined) {
              resolvedRangeMax = resolvedRangeMin;
            } else if (updates.rangeMax !== undefined && updates.rangeMin === undefined) {
              resolvedRangeMin = resolvedRangeMax;
            }
          }

          return {
            ...tag,
            ...updates,
            label: resolvedLabel,
            rangeMin: resolvedRangeMin,
            rangeMax: resolvedRangeMax,
            updatedAtIso: new Date().toISOString()
          };
        })
      }));
    },
    removeTag: (tagId) => {
      setState((current) => {
        const nextTags = current.tags.filter((tag) => tag.id !== tagId);
        const nextReadings = current.readings.map((reading) => ({
          ...reading,
          tagIds: reading.tagIds.filter((value) => value !== tagId)
        }));

        return {
          ...current,
          tags: syncTagStats(nextReadings, nextTags),
          readings: nextReadings
        };
      });
    },
    updateSettings: (updates) => {
      setState((current) => ({
        ...current,
        settings: {
          ...current.settings,
          ...updates
        }
      }));
    },
    resetAllData: () => {
      const nowIso = new Date().toISOString();
      setState({
        readings: [],
        tags: createDefaultTags(nowIso),
        settings: DEFAULT_SETTINGS
      });
    }
  }), [state]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const value = useContext(AppDataContext);
  if (!value) {
    throw new Error('useAppData must be used within AppDataProvider');
  }

  return value;
}