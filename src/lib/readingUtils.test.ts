import { describe, expect, it } from 'vitest';
import { createDefaultBpTags, createDefaultTags } from './defaults';
import {
  applyCategorizedReadingFilters,
  buildBpTagBreakdown,
  buildValueTagBreakdown,
  createCategorizedReadingFilters
} from './readingUtils';
import type { BpReading, BpTagCategory, SugarReading, SugarTagCategory } from './types';

const fixedNowIso = '2026-04-29T12:00:00.000Z';

describe('readingUtils category helpers', () => {
  it('filters sugar readings by tags and categories with AND semantics across dimensions', () => {
    const tags = createDefaultTags(fixedNowIso);
    const tagsById = new Map(tags.map((tag) => [tag.id, tag] as const));
    const readings: SugarReading[] = [
      {
        id: 'sugar-1',
        value: 98,
        readingDateTimeIso: fixedNowIso,
        tagIds: ['fasting'],
        note: null,
        createdAtIso: fixedNowIso,
        updatedAtIso: fixedNowIso
      },
      {
        id: 'sugar-2',
        value: 140,
        readingDateTimeIso: '2026-04-29T18:00:00.000Z',
        tagIds: ['post-exercise'],
        note: null,
        createdAtIso: fixedNowIso,
        updatedAtIso: fixedNowIso
      },
      {
        id: 'sugar-3',
        value: 155,
        readingDateTimeIso: '2026-04-29T20:00:00.000Z',
        tagIds: ['weekend'],
        note: null,
        createdAtIso: fixedNowIso,
        updatedAtIso: fixedNowIso
      }
    ];

    const results = applyCategorizedReadingFilters(
      readings,
      createCategorizedReadingFilters({
        tagIds: ['fasting'],
        categories: ['timing']
      }),
      tagsById
    );

    expect(results.map((reading) => reading.id)).toEqual(['sugar-1']);
  });

  it('builds sugar tag breakdowns from categorized tags', () => {
    const tags = createDefaultTags(fixedNowIso);
    const tagsById = new Map(tags.map((tag) => [tag.id, tag] as const));
    const readings: SugarReading[] = [
      {
        id: 'sugar-1',
        value: 100,
        readingDateTimeIso: fixedNowIso,
        tagIds: ['fasting'],
        note: null,
        createdAtIso: fixedNowIso,
        updatedAtIso: fixedNowIso
      },
      {
        id: 'sugar-2',
        value: 104,
        readingDateTimeIso: '2026-04-29T18:00:00.000Z',
        tagIds: ['fasting', 'weekend'],
        note: null,
        createdAtIso: fixedNowIso,
        updatedAtIso: fixedNowIso
      }
    ];

    const breakdown = buildValueTagBreakdown(readings, tagsById, ['timing'] as SugarTagCategory[]);

    expect(breakdown).toEqual([
      {
        key: 'fasting',
        label: 'Fasting',
        category: 'timing',
        count: 2,
        totalValue: 204,
        averageValue: 102
      }
    ]);
  });

  it('builds blood pressure tag breakdowns from categorized tags', () => {
    const tags = createDefaultBpTags(fixedNowIso);
    const tagsById = new Map(tags.map((tag) => [tag.id, tag] as const));
    const readings: BpReading[] = [
      {
        id: 'bp-1',
        systolic: 122,
        diastolic: 80,
        readingDateTimeIso: fixedNowIso,
        tagIds: ['bp-morning'],
        note: null,
        createdAtIso: fixedNowIso,
        updatedAtIso: fixedNowIso
      },
      {
        id: 'bp-2',
        systolic: 128,
        diastolic: 84,
        readingDateTimeIso: '2026-04-29T18:00:00.000Z',
        tagIds: ['bp-morning', 'bp-random'],
        note: null,
        createdAtIso: fixedNowIso,
        updatedAtIso: fixedNowIso
      }
    ];

    const breakdown = buildBpTagBreakdown(readings, tagsById, ['timing'] as BpTagCategory[]);

    expect(breakdown).toEqual([
      {
        key: 'bp-morning',
        label: 'Morning',
        category: 'timing',
        count: 2,
        averageSystolic: 125,
        averageDiastolic: 82
      }
    ]);
  });
});