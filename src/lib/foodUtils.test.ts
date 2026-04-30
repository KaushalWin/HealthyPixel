import { describe, expect, it } from 'vitest';
import { createDefaultFoodReadings, createDefaultFoodTags } from './defaults';
import { applyFoodReadingFilters, buildFoodMetrics, createFoodReadingFilters } from './foodUtils';

const fixedNow = new Date('2026-04-29T12:00:00.000Z');

function createFixture() {
  const tags = createDefaultFoodTags(fixedNow.toISOString());
  const readings = createDefaultFoodReadings(fixedNow);
  const tagsById = new Map(tags.map((tag) => [tag.id, tag]));

  return { tagsById, readings };
}

describe('foodUtils', () => {
  it('matches any selected food tags by default', () => {
    const { readings, tagsById } = createFixture();

    const results = applyFoodReadingFilters(
      readings,
      createFoodReadingFilters({
        tagIds: ['food-actual-overeat', 'food-behavior-bored-binge']
      }),
      tagsById
    );

    expect(results.map((reading) => reading.mealName)).toEqual(['Burger Combo', 'Ice Cream Cup']);
  });

  it('narrows results when tag and category filters are combined with AND', () => {
    const { readings, tagsById } = createFixture();

    const results = applyFoodReadingFilters(
      readings,
      createFoodReadingFilters({
        tagIds: ['food-context-snack'],
        categories: ['behavior']
      }),
      tagsById
    );

    expect(results.map((reading) => reading.mealName)).toEqual(['Chips + Cola', 'Fruit Bowl', 'Ice Cream Cup']);
  });

  it('builds calorie metrics from seeded food entries', () => {
    const { readings, tagsById } = createFixture();
    const metrics = buildFoodMetrics(readings, tagsById);

    expect(metrics.totalCount).toBe(12);
    expect(metrics.totalCalories).toBe(5780);
    expect(metrics.averageCalories).toBe(482);
    expect(metrics.lowestCalories).toBe(180);
    expect(metrics.highestCalories).toBe(980);
  });
});