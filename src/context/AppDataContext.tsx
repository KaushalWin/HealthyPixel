import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createDefaultBpTags, createDefaultFoodReadings, createDefaultFoodTags, createDefaultHeightTags, createDefaultTags, createDefaultWeightTags, DEFAULT_SETTINGS, STORAGE_KEYS } from '../lib/defaults';
import { createStableId, safeLocalStorageGet, safeLocalStorageSet } from '../lib/platform';
import { parseStoredJson, syncTagStats } from '../lib/readingUtils';
import { normalizeBpTag, normalizeSugarTag, normalizeWeightTag } from '../lib/tagCategories';
import { getInlineTextValidationError } from '../lib/textValidation';
import type { AppDataShape, AppSettings, BpDraft, BpReading, BpTagCategory, BpTagDefinition, FoodReading, FoodReadingDraft, FoodTagDefinition, HeightReading, ReadingDraft, SugarReading, SugarTagCategory, SugarTagDefinition, TagDefinition, WeightReading, WeightTagCategory, WeightTagDefinition } from '../lib/types';

type AppDataContextValue = AppDataShape & {
  exportAppData: () => AppDataShape;
  replaceAllAppData: (nextData: AppDataShape) => void;

  addReading: (draft: ReadingDraft) => SugarReading;
  updateReading: (readingId: string, draft: ReadingDraft) => SugarReading | null;
  addTag: (label: string, rangeMin: number | null, rangeMax: number | null, category?: SugarTagCategory) => SugarTagDefinition | null;
  updateTag: (tagId: string, updates: Partial<Omit<SugarTagDefinition, 'id' | 'type' | 'createdAtIso'>>) => void;
  removeTag: (tagId: string) => void;

  addWeightReading: (draft: ReadingDraft) => WeightReading;
  updateWeightReading: (readingId: string, draft: ReadingDraft) => WeightReading | null;
  addWeightTag: (label: string, rangeMin: number | null, rangeMax: number | null, category?: WeightTagCategory) => WeightTagDefinition | null;
  updateWeightTag: (tagId: string, updates: Partial<Omit<WeightTagDefinition, 'id' | 'type' | 'createdAtIso'>>) => void;
  removeWeightTag: (tagId: string) => void;

  addHeightReading: (draft: ReadingDraft) => HeightReading;
  updateHeightReading: (readingId: string, draft: ReadingDraft) => HeightReading | null;
  addHeightTag: (label: string, rangeMin: number | null, rangeMax: number | null) => TagDefinition;
  updateHeightTag: (tagId: string, updates: Partial<Omit<TagDefinition, 'id' | 'type' | 'createdAtIso'>>) => void;
  removeHeightTag: (tagId: string) => void;

  addBpReading: (draft: BpDraft) => BpReading;
  updateBpReading: (readingId: string, draft: BpDraft) => BpReading | null;
  addBpTag: (label: string, systolicMin: number | null, systolicMax: number | null, diastolicMin: number | null, diastolicMax: number | null, category?: BpTagCategory) => BpTagDefinition | null;
  updateBpTag: (tagId: string, updates: Partial<Omit<BpTagDefinition, 'id' | 'type' | 'createdAtIso'>>) => void;
  removeBpTag: (tagId: string) => void;

  addFoodReading: (draft: FoodReadingDraft) => FoodReading;
  updateFoodReading: (readingId: string, draft: FoodReadingDraft) => FoodReading | null;
  addFoodTag: (label: string, category: FoodTagDefinition['category'], rangeMin: number | null, rangeMax: number | null) => FoodTagDefinition | null;
  updateFoodTag: (tagId: string, updates: Partial<Omit<FoodTagDefinition, 'id' | 'type' | 'createdAtIso'>>) => void;
  removeFoodTag: (tagId: string) => void;

  updateSettings: (updates: Partial<AppSettings>) => void;
  resetAllData: () => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

function normalizeAppData(data: AppDataShape): AppDataShape {
  const normalizedSugarTags = data.tags.map(normalizeSugarTag);
  const normalizedWeightTags = data.weightTags.map(normalizeWeightTag);
  const normalizedBpTags = data.bpTags.map(normalizeBpTag);

  return {
    ...data,
    tags: syncTagStats(data.readings, normalizedSugarTags),
    weightTags: syncTagStats(data.weightReadings, normalizedWeightTags),
    heightTags: syncTagStats(data.heightReadings, data.heightTags),
    bpTags: syncTagStats(data.bpReadings, normalizedBpTags),
    foodTags: syncTagStats(data.foodReadings, data.foodTags),
    settings: { ...DEFAULT_SETTINGS, ...data.settings }
  };
}

function loadInitialAppData(): AppDataShape {
  const nowIso = new Date().toISOString();
  const readings = parseStoredJson<SugarReading[]>(safeLocalStorageGet(STORAGE_KEYS.readings), []);
  const tags = parseStoredJson<SugarTagDefinition[]>(
    safeLocalStorageGet(STORAGE_KEYS.tags),
    createDefaultTags(nowIso)
  );
  const weightReadings = parseStoredJson<WeightReading[]>(safeLocalStorageGet(STORAGE_KEYS.weightReadings), []);
  const weightTags = parseStoredJson<WeightTagDefinition[]>(
    safeLocalStorageGet(STORAGE_KEYS.weightTags),
    createDefaultWeightTags(nowIso)
  );
  const heightReadings = parseStoredJson<HeightReading[]>(safeLocalStorageGet(STORAGE_KEYS.heightReadings), []);
  const heightTags = parseStoredJson<TagDefinition[]>(
    safeLocalStorageGet(STORAGE_KEYS.heightTags),
    createDefaultHeightTags(nowIso)
  );
  const bpReadings = parseStoredJson<BpReading[]>(safeLocalStorageGet(STORAGE_KEYS.bpReadings), []);
  const bpTags = parseStoredJson<BpTagDefinition[]>(
    safeLocalStorageGet(STORAGE_KEYS.bpTags),
    createDefaultBpTags(nowIso)
  );
  const foodReadings = parseStoredJson<FoodReading[]>(
    safeLocalStorageGet(STORAGE_KEYS.foodReadings),
    createDefaultFoodReadings(new Date(nowIso))
  );
  const foodTags = parseStoredJson<FoodTagDefinition[]>(
    safeLocalStorageGet(STORAGE_KEYS.foodTags),
    createDefaultFoodTags(nowIso)
  );
  const settings = parseStoredJson<AppSettings>(
    safeLocalStorageGet(STORAGE_KEYS.settings),
    DEFAULT_SETTINGS
  );

  return normalizeAppData({
    readings,
    tags,
    weightReadings,
    weightTags,
    heightReadings,
    heightTags,
    bpReadings,
    bpTags,
    foodReadings,
    foodTags,
    settings: { ...DEFAULT_SETTINGS, ...settings }
  });
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
    safeLocalStorageSet(STORAGE_KEYS.weightReadings, JSON.stringify(state.weightReadings));
  }, [state.weightReadings]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.weightTags, JSON.stringify(state.weightTags));
  }, [state.weightTags]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.heightReadings, JSON.stringify(state.heightReadings));
  }, [state.heightReadings]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.heightTags, JSON.stringify(state.heightTags));
  }, [state.heightTags]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.bpReadings, JSON.stringify(state.bpReadings));
  }, [state.bpReadings]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.bpTags, JSON.stringify(state.bpTags));
  }, [state.bpTags]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.foodReadings, JSON.stringify(state.foodReadings));
  }, [state.foodReadings]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.foodTags, JSON.stringify(state.foodTags));
  }, [state.foodTags]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.settings, JSON.stringify(state.settings));
  }, [state.settings]);

  const value = useMemo<AppDataContextValue>(() => ({
    ...state,
    exportAppData: () => state,
    replaceAllAppData: (nextData) => {
      setState(normalizeAppData(nextData));
    },
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
    addTag: (label, rangeMin, rangeMax, category = 'general') => {
      const validationError = getInlineTextValidationError(label, 'Tag label');
      if (validationError) {
        return null;
      }

      const nowIso = new Date().toISOString();
      const trimmedLabel = label.trim();
      let createdTag: SugarTagDefinition | null = null;

      setState((current) => {
        const hasDuplicateLabel = current.tags.some(
          (candidate) => candidate.label.toLowerCase() === trimmedLabel.toLowerCase()
        );

        if (hasDuplicateLabel) {
          return current;
        }

        createdTag = {
          id: createStableId(),
          label: trimmedLabel,
          type: 'custom',
          createdAtIso: nowIso,
          updatedAtIso: nowIso,
          usageCount: 0,
          lastUsedAtIso: null,
          rangeMin,
          rangeMax,
          category
        };

        return {
          ...current,
          tags: [...current.tags, createdTag]
        };
      });

      return createdTag;
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
          const hasInvalidLabel =
            typeof trimmedLabel === 'string' &&
            getInlineTextValidationError(trimmedLabel, 'Tag label') !== null;

          const resolvedLabel =
            typeof trimmedLabel === 'string' &&
            trimmedLabel.length > 0 &&
            !hasDuplicateLabel &&
            !hasInvalidLabel
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

    addWeightReading: (draft) => {
      const nowIso = new Date().toISOString();
      const reading: WeightReading = {
        id: createStableId(),
        value: draft.value,
        readingDateTimeIso: draft.readingDateTimeIso,
        tagIds: draft.tagIds,
        note: draft.note?.trim() ? draft.note.trim() : null,
        createdAtIso: nowIso,
        updatedAtIso: nowIso
      };
      setState((current) => {
        const nextReadings = [...current.weightReadings, reading];
        return { ...current, weightReadings: nextReadings, weightTags: syncTagStats(nextReadings, current.weightTags) };
      });
      return reading;
    },
    updateWeightReading: (readingId, draft) => {
      let updatedReading: WeightReading | null = null;
      setState((current) => {
        const nextReadings = current.weightReadings.map((r) => {
          if (r.id !== readingId) return r;
          updatedReading = { ...r, value: draft.value, readingDateTimeIso: draft.readingDateTimeIso, tagIds: draft.tagIds, note: draft.note?.trim() ? draft.note.trim() : null, updatedAtIso: new Date().toISOString() };
          return updatedReading;
        });
        return { ...current, weightReadings: nextReadings, weightTags: syncTagStats(nextReadings, current.weightTags) };
      });
      return updatedReading;
    },
    addWeightTag: (label, rangeMin, rangeMax, category = 'general') => {
      const validationError = getInlineTextValidationError(label, 'Tag label');
      if (validationError) {
        return null;
      }

      const nowIso = new Date().toISOString();
      const trimmedLabel = label.trim();
      let createdTag: WeightTagDefinition | null = null;

      setState((current) => {
        const hasDuplicateLabel = current.weightTags.some(
          (candidate) => candidate.label.toLowerCase() === trimmedLabel.toLowerCase()
        );

        if (hasDuplicateLabel) {
          return current;
        }

        createdTag = { id: createStableId(), label: trimmedLabel, type: 'custom', createdAtIso: nowIso, updatedAtIso: nowIso, usageCount: 0, lastUsedAtIso: null, rangeMin, rangeMax, category };
        return { ...current, weightTags: [...current.weightTags, createdTag] };
      });

      return createdTag;
    },
    updateWeightTag: (tagId, updates) => {
      setState((current) => ({
        ...current,
        weightTags: current.weightTags.map((tag) => {
          if (tag.id !== tagId) return tag;
          const trimmedLabel = updates.label?.trim();
          const hasDup = typeof trimmedLabel === 'string' && trimmedLabel.length > 0 && current.weightTags.some((c) => c.id !== tagId && c.label.toLowerCase() === trimmedLabel.toLowerCase());
          const hasInvalidLabel = typeof trimmedLabel === 'string' && getInlineTextValidationError(trimmedLabel, 'Tag label') !== null;
          const resolvedLabel = typeof trimmedLabel === 'string' && trimmedLabel.length > 0 && !hasDup && !hasInvalidLabel ? trimmedLabel : tag.label;
          let resolvedMin = updates.rangeMin ?? tag.rangeMin;
          let resolvedMax = updates.rangeMax ?? tag.rangeMax;
          if (resolvedMin !== null && resolvedMax !== null && resolvedMin > resolvedMax) {
            if (updates.rangeMin !== undefined && updates.rangeMax === undefined) resolvedMax = resolvedMin;
            else if (updates.rangeMax !== undefined && updates.rangeMin === undefined) resolvedMin = resolvedMax;
          }
          return { ...tag, ...updates, label: resolvedLabel, rangeMin: resolvedMin, rangeMax: resolvedMax, updatedAtIso: new Date().toISOString() };
        })
      }));
    },
    removeWeightTag: (tagId) => {
      setState((current) => {
        const nextTags = current.weightTags.filter((t) => t.id !== tagId);
        const nextReadings = current.weightReadings.map((r) => ({ ...r, tagIds: r.tagIds.filter((v) => v !== tagId) }));
        return { ...current, weightTags: syncTagStats(nextReadings, nextTags), weightReadings: nextReadings };
      });
    },

    addHeightReading: (draft) => {
      const nowIso = new Date().toISOString();
      const reading: HeightReading = {
        id: createStableId(),
        value: draft.value,
        readingDateTimeIso: draft.readingDateTimeIso,
        tagIds: draft.tagIds,
        note: draft.note?.trim() ? draft.note.trim() : null,
        createdAtIso: nowIso,
        updatedAtIso: nowIso
      };
      setState((current) => {
        const nextReadings = [...current.heightReadings, reading];
        return { ...current, heightReadings: nextReadings, heightTags: syncTagStats(nextReadings, current.heightTags) };
      });
      return reading;
    },
    updateHeightReading: (readingId, draft) => {
      let updatedReading: HeightReading | null = null;
      setState((current) => {
        const nextReadings = current.heightReadings.map((r) => {
          if (r.id !== readingId) return r;
          updatedReading = { ...r, value: draft.value, readingDateTimeIso: draft.readingDateTimeIso, tagIds: draft.tagIds, note: draft.note?.trim() ? draft.note.trim() : null, updatedAtIso: new Date().toISOString() };
          return updatedReading;
        });
        return { ...current, heightReadings: nextReadings, heightTags: syncTagStats(nextReadings, current.heightTags) };
      });
      return updatedReading;
    },
    addHeightTag: (label, rangeMin, rangeMax) => {
      const nowIso = new Date().toISOString();
      const tag: TagDefinition = { id: createStableId(), label: label.trim(), type: 'custom', createdAtIso: nowIso, updatedAtIso: nowIso, usageCount: 0, lastUsedAtIso: null, rangeMin, rangeMax };
      setState((current) => ({ ...current, heightTags: [...current.heightTags, tag] }));
      return tag;
    },
    updateHeightTag: (tagId, updates) => {
      setState((current) => ({
        ...current,
        heightTags: current.heightTags.map((tag) => {
          if (tag.id !== tagId) return tag;
          const trimmedLabel = updates.label?.trim();
          const hasDup = typeof trimmedLabel === 'string' && trimmedLabel.length > 0 && current.heightTags.some((c) => c.id !== tagId && c.label.toLowerCase() === trimmedLabel.toLowerCase());
          const resolvedLabel = typeof trimmedLabel === 'string' && trimmedLabel.length > 0 && !hasDup ? trimmedLabel : tag.label;
          let resolvedMin = updates.rangeMin ?? tag.rangeMin;
          let resolvedMax = updates.rangeMax ?? tag.rangeMax;
          if (resolvedMin !== null && resolvedMax !== null && resolvedMin > resolvedMax) {
            if (updates.rangeMin !== undefined && updates.rangeMax === undefined) resolvedMax = resolvedMin;
            else if (updates.rangeMax !== undefined && updates.rangeMin === undefined) resolvedMin = resolvedMax;
          }
          return { ...tag, ...updates, label: resolvedLabel, rangeMin: resolvedMin, rangeMax: resolvedMax, updatedAtIso: new Date().toISOString() };
        })
      }));
    },
    removeHeightTag: (tagId) => {
      setState((current) => {
        const nextTags = current.heightTags.filter((t) => t.id !== tagId);
        const nextReadings = current.heightReadings.map((r) => ({ ...r, tagIds: r.tagIds.filter((v) => v !== tagId) }));
        return { ...current, heightTags: syncTagStats(nextReadings, nextTags), heightReadings: nextReadings };
      });
    },

    addBpReading: (draft) => {
      const nowIso = new Date().toISOString();
      const reading: BpReading = {
        id: createStableId(),
        systolic: draft.systolic,
        diastolic: draft.diastolic,
        readingDateTimeIso: draft.readingDateTimeIso,
        tagIds: draft.tagIds,
        note: draft.note?.trim() ? draft.note.trim() : null,
        createdAtIso: nowIso,
        updatedAtIso: nowIso
      };
      setState((current) => {
        const nextReadings = [...current.bpReadings, reading];
        return { ...current, bpReadings: nextReadings, bpTags: syncTagStats(nextReadings, current.bpTags) };
      });
      return reading;
    },
    updateBpReading: (readingId, draft) => {
      let updatedReading: BpReading | null = null;
      setState((current) => {
        const nextReadings = current.bpReadings.map((r) => {
          if (r.id !== readingId) return r;
          updatedReading = { ...r, systolic: draft.systolic, diastolic: draft.diastolic, readingDateTimeIso: draft.readingDateTimeIso, tagIds: draft.tagIds, note: draft.note?.trim() ? draft.note.trim() : null, updatedAtIso: new Date().toISOString() };
          return updatedReading;
        });
        return { ...current, bpReadings: nextReadings, bpTags: syncTagStats(nextReadings, current.bpTags) };
      });
      return updatedReading;
    },
    addBpTag: (label, systolicMin, systolicMax, diastolicMin, diastolicMax, category = 'general') => {
      const validationError = getInlineTextValidationError(label, 'Tag label');
      if (validationError) {
        return null;
      }

      const nowIso = new Date().toISOString();
      const trimmedLabel = label.trim();
      let createdTag: BpTagDefinition | null = null;

      setState((current) => {
        const hasDuplicateLabel = current.bpTags.some(
          (candidate) => candidate.label.toLowerCase() === trimmedLabel.toLowerCase()
        );

        if (hasDuplicateLabel) {
          return current;
        }

        createdTag = { id: createStableId(), label: trimmedLabel, type: 'custom', createdAtIso: nowIso, updatedAtIso: nowIso, usageCount: 0, lastUsedAtIso: null, rangeMin: null, rangeMax: null, systolicMin, systolicMax, diastolicMin, diastolicMax, category };
        return { ...current, bpTags: [...current.bpTags, createdTag] };
      });

      return createdTag;
    },
    updateBpTag: (tagId, updates) => {
      setState((current) => ({
        ...current,
        bpTags: current.bpTags.map((tag) => {
          if (tag.id !== tagId) return tag;
          const trimmedLabel = updates.label?.trim();
          const hasDup = typeof trimmedLabel === 'string' && trimmedLabel.length > 0 && current.bpTags.some((c) => c.id !== tagId && c.label.toLowerCase() === trimmedLabel.toLowerCase());
          const hasInvalidLabel = typeof trimmedLabel === 'string' && getInlineTextValidationError(trimmedLabel, 'Tag label') !== null;
          const resolvedLabel = typeof trimmedLabel === 'string' && trimmedLabel.length > 0 && !hasDup && !hasInvalidLabel ? trimmedLabel : tag.label;
          return { ...tag, ...updates, label: resolvedLabel, updatedAtIso: new Date().toISOString() };
        })
      }));
    },
    removeBpTag: (tagId) => {
      setState((current) => {
        const nextTags = current.bpTags.filter((t) => t.id !== tagId);
        const nextReadings = current.bpReadings.map((r) => ({ ...r, tagIds: r.tagIds.filter((v) => v !== tagId) }));
        return { ...current, bpTags: syncTagStats(nextReadings, nextTags), bpReadings: nextReadings };
      });
    },

    addFoodReading: (draft) => {
      const nowIso = new Date().toISOString();
      const reading: FoodReading = {
        id: createStableId(),
        mealName: draft.mealName.trim(),
        calories: draft.calories,
        readingDateTimeIso: draft.readingDateTimeIso,
        tagIds: draft.tagIds,
        note: draft.note?.trim() ? draft.note.trim() : null,
        createdAtIso: nowIso,
        updatedAtIso: nowIso
      };
      setState((current) => {
        const nextReadings = [...current.foodReadings, reading];
        return { ...current, foodReadings: nextReadings, foodTags: syncTagStats(nextReadings, current.foodTags) };
      });
      return reading;
    },
    updateFoodReading: (readingId, draft) => {
      let updatedReading: FoodReading | null = null;
      setState((current) => {
        const nextReadings = current.foodReadings.map((reading) => {
          if (reading.id !== readingId) return reading;

          updatedReading = {
            ...reading,
            mealName: draft.mealName.trim(),
            calories: draft.calories,
            readingDateTimeIso: draft.readingDateTimeIso,
            tagIds: draft.tagIds,
            note: draft.note?.trim() ? draft.note.trim() : null,
            updatedAtIso: new Date().toISOString()
          };
          return updatedReading;
        });
        return { ...current, foodReadings: nextReadings, foodTags: syncTagStats(nextReadings, current.foodTags) };
      });
      return updatedReading;
    },
    addFoodTag: (label, category, rangeMin, rangeMax) => {
      const validationError = getInlineTextValidationError(label, 'Tag label');
      if (validationError) {
        return null;
      }

      const trimmedLabel = label.trim();

      const nowIso = new Date().toISOString();
      let createdTag: FoodTagDefinition | null = null;
      setState((current) => {
        const hasDup = current.foodTags.some(
          (candidate) =>
            candidate.category === category && candidate.label.toLowerCase() === trimmedLabel.toLowerCase()
        );
        if (hasDup) {
          return current;
        }

        createdTag = {
          id: createStableId(),
          label: trimmedLabel,
          category,
          type: 'custom',
          createdAtIso: nowIso,
          updatedAtIso: nowIso,
          usageCount: 0,
          lastUsedAtIso: null,
          rangeMin,
          rangeMax
        };

        return { ...current, foodTags: [...current.foodTags, createdTag] };
      });
      return createdTag;
    },
    updateFoodTag: (tagId, updates) => {
      setState((current) => ({
        ...current,
        foodTags: current.foodTags.map((tag) => {
          if (tag.id !== tagId) return tag;
          const trimmedLabel = updates.label?.trim();
          const hasDup = typeof trimmedLabel === 'string' && trimmedLabel.length > 0 && current.foodTags.some((candidate) => candidate.id !== tagId && candidate.category === (updates.category ?? tag.category) && candidate.label.toLowerCase() === trimmedLabel.toLowerCase());
          const hasInvalidLabel = typeof trimmedLabel === 'string' && getInlineTextValidationError(trimmedLabel, 'Tag label') !== null;
          const resolvedLabel = typeof trimmedLabel === 'string' && trimmedLabel.length > 0 && !hasDup && !hasInvalidLabel ? trimmedLabel : tag.label;
          let resolvedMin = updates.rangeMin ?? tag.rangeMin;
          let resolvedMax = updates.rangeMax ?? tag.rangeMax;
          if (resolvedMin !== null && resolvedMax !== null && resolvedMin > resolvedMax) {
            if (updates.rangeMin !== undefined && updates.rangeMax === undefined) resolvedMax = resolvedMin;
            else if (updates.rangeMax !== undefined && updates.rangeMin === undefined) resolvedMin = resolvedMax;
          }
          return { ...tag, ...updates, label: resolvedLabel, rangeMin: resolvedMin, rangeMax: resolvedMax, updatedAtIso: new Date().toISOString() };
        })
      }));
    },
    removeFoodTag: (tagId) => {
      setState((current) => {
        const nextTags = current.foodTags.filter((tag) => tag.id !== tagId);
        const nextReadings = current.foodReadings.map((reading) => ({ ...reading, tagIds: reading.tagIds.filter((value) => value !== tagId) }));
        return { ...current, foodTags: syncTagStats(nextReadings, nextTags), foodReadings: nextReadings };
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
        weightReadings: [],
        weightTags: createDefaultWeightTags(nowIso),
        heightReadings: [],
        heightTags: createDefaultHeightTags(nowIso),
        bpReadings: [],
        bpTags: createDefaultBpTags(nowIso),
        foodReadings: createDefaultFoodReadings(new Date(nowIso)),
        foodTags: createDefaultFoodTags(nowIso),
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