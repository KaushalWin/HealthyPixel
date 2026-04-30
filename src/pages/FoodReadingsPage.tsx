import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { SiteShell } from '../components/SiteShell';
import { FoodFilterPanel } from '../components/food/FoodFilterPanel';
import { FoodReadingList } from '../components/food/FoodReadingList';
import { useAppData } from '../context/AppDataContext';
import { applyFoodReadingFilters, createFoodReadingFilters } from '../lib/foodUtils';
import { sortReadingsDescending } from '../lib/readingUtils';
import type { FoodReadingFilters, LogicalMatchMode } from '../lib/types';

function parseMatchMode(value: string | null): LogicalMatchMode {
  return value === 'and' ? 'and' : 'or';
}

function filtersFromSearch(searchParams: URLSearchParams): FoodReadingFilters {
  return createFoodReadingFilters({
    startDate: searchParams.get('start') ?? '',
    endDate: searchParams.get('end') ?? '',
    tagIds: (searchParams.get('tags') ?? '').split(',').filter(Boolean),
    categories: (searchParams.get('categories') ?? '').split(',').filter(Boolean) as FoodReadingFilters['categories'],
    tagMatchMode: parseMatchMode(searchParams.get('tagMode')),
    categoryMatchMode: parseMatchMode(searchParams.get('categoryMode')),
    combinedMode: searchParams.get('combinedMode') === 'or' ? 'or' : 'and'
  });
}

export function FoodReadingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { foodReadings, foodTags, settings } = useAppData();
  const [filters, setFilters] = useState<FoodReadingFilters>(() => filtersFromSearch(searchParams));

  useEffect(() => {
    setFilters(filtersFromSearch(searchParams));
  }, [searchParams]);

  const hasInvalidRange =
    filters.startDate !== '' && filters.endDate !== '' && filters.startDate > filters.endDate;

  const tagsById = useMemo(() => new Map(foodTags.map((tag) => [tag.id, tag])), [foodTags]);

  const filteredReadings = useMemo(() => {
    if (hasInvalidRange) {
      return [];
    }

    return sortReadingsDescending(applyFoodReadingFilters(foodReadings, filters, tagsById));
  }, [filters, foodReadings, hasInvalidRange, tagsById]);

  const updateFilters = (nextFilters: FoodReadingFilters) => {
    setFilters(nextFilters);
    const nextParams = new URLSearchParams(searchParams);

    if (nextFilters.startDate) {
      nextParams.set('start', nextFilters.startDate);
    } else {
      nextParams.delete('start');
    }

    if (nextFilters.endDate) {
      nextParams.set('end', nextFilters.endDate);
    } else {
      nextParams.delete('end');
    }

    if (nextFilters.tagIds.length > 0) {
      nextParams.set('tags', nextFilters.tagIds.join(','));
    } else {
      nextParams.delete('tags');
    }

    if (nextFilters.categories.length > 0) {
      nextParams.set('categories', nextFilters.categories.join(','));
    } else {
      nextParams.delete('categories');
    }

    nextParams.set('tagMode', nextFilters.tagMatchMode);
    nextParams.set('categoryMode', nextFilters.categoryMatchMode);
    nextParams.set('combinedMode', nextFilters.combinedMode);

    setSearchParams(nextParams, { replace: true });
  };

  return (
    <SiteShell title="Food Log" subtitle="Search meals by calories, dates, tag groups, and AND/OR matching.">
      <section className="doc-card section-stack">
        <div className="action-row">
          <Link to="/food/add" className="primary-button">
            Add new meal
          </Link>
          <Link to="/food/chart" className="secondary-button">
            Open food charts
          </Link>
        </div>

        <details className="compact-details" open>
          <summary>List filters</summary>

          <FoodFilterPanel
            filters={filters}
            onChange={updateFilters}
            tags={foodTags}
            readings={foodReadings}
            settings={settings}
            errorMessage={hasInvalidRange ? 'Start date cannot be after end date.' : null}
            manageLinkTo="/settings/tags"
          />

          <div className="action-row compact">
            <button
              type="button"
              className="secondary-button small"
              onClick={() => updateFilters(createFoodReadingFilters())}
            >
              Clear filters
            </button>
          </div>
        </details>
      </section>

      <FoodReadingList
        title="Meals"
        readings={filteredReadings}
        tagsById={tagsById}
        emptyMessage={
          hasInvalidRange
            ? 'Fix the date range to see meals.'
            : 'No food entries match the current filters.'
        }
        highlightReadingId={searchParams.get('highlight')}
        colors={{
          inside: settings.foodChartColorInside,
          outside: settings.foodChartColorOutside,
          neutral: settings.foodChartColorNeutral
        }}
      />
    </SiteShell>
  );
}