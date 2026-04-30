import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { SiteShell } from '../components/SiteShell';
import { CategoryChipFilter } from '../components/CategoryChipFilter';
import { DateRangePicker } from '../components/sugar/DateRangePicker';
import { SugarReadingList } from '../components/sugar/SugarReadingList';
import { SugarTagGroupSelector } from '../components/sugar/SugarTagGroupSelector';
import { useAppData } from '../context/AppDataContext';
import { applyCategorizedReadingFilters, sortReadingsDescending } from '../lib/readingUtils';
import { SUGAR_TAG_CATEGORY_LABELS, SUGAR_TAG_CATEGORY_ORDER } from '../lib/tagCategories';
import type { SugarReadingFilters, SugarTagCategory } from '../lib/types';

function parseCategories(searchParams: URLSearchParams): SugarTagCategory[] {
  return (searchParams.get('categories') ?? '')
    .split(',')
    .filter((value): value is SugarTagCategory =>
      SUGAR_TAG_CATEGORY_ORDER.includes(value as SugarTagCategory)
    );
}

function filtersFromSearch(searchParams: URLSearchParams): SugarReadingFilters {
  return {
    startDate: searchParams.get('start') ?? '',
    endDate: searchParams.get('end') ?? '',
    tagIds: (searchParams.get('tags') ?? '').split(',').filter(Boolean),
    categories: parseCategories(searchParams)
  };
}

export function SugarReadingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { readings, settings, tags } = useAppData();
  const [filters, setFilters] = useState<SugarReadingFilters>(() => filtersFromSearch(searchParams));

  useEffect(() => {
    setFilters(filtersFromSearch(searchParams));
  }, [searchParams]);

  const hasInvalidRange =
    filters.startDate !== '' && filters.endDate !== '' && filters.startDate > filters.endDate;

  const tagsById = useMemo(() => new Map(tags.map((tag) => [tag.id, tag] as const)), [tags]);

  const filteredReadings = useMemo(() => {
    if (hasInvalidRange) {
      return [];
    }

    return sortReadingsDescending(applyCategorizedReadingFilters(readings, filters, tagsById));
  }, [filters, hasInvalidRange, readings, tagsById]);

  const updateFilters = (nextFilters: SugarReadingFilters) => {
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
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <SiteShell
      title="Sugar Reading List"
      subtitle="Compact list with quick add and optional filters."
    >
      <section className="doc-card section-stack">
        <div className="action-row">
          <Link to="/sugar/add" className="primary-button">
            Add new entry
          </Link>
          <Link to="/sugar/chart" className="secondary-button">
            Open chart
          </Link>
        </div>

        <details className="compact-details">
          <summary>List filters</summary>

          <DateRangePicker
            filters={filters}
            onChange={(nextFilters) =>
              updateFilters({
                ...filters,
                startDate: nextFilters.startDate,
                endDate: nextFilters.endDate
              })
            }
            errorMessage={hasInvalidRange ? 'Start date cannot be after end date.' : null}
          />

          <CategoryChipFilter
            title="Categories"
            helperText="Filter sugar readings by grouped tag categories."
            categories={SUGAR_TAG_CATEGORY_ORDER}
            categoryLabels={SUGAR_TAG_CATEGORY_LABELS}
            selectedCategories={filters.categories}
            onChange={(categories) => updateFilters({ ...filters, categories })}
          />

          <SugarTagGroupSelector
            tags={tags}
            readings={readings}
            settings={settings}
            selectedTagIds={filters.tagIds}
            onChange={(tagIds) => updateFilters({ ...filters, tagIds })}
            label="Specific tags"
            helperText="Filter by one or more specific sugar tags."
            manageLinkTo="/settings/tags"
          />

          <div className="action-row compact">
            <button
              type="button"
              className="secondary-button small"
              onClick={() => updateFilters({ startDate: '', endDate: '', tagIds: [], categories: [] })}
            >
              Clear filters
            </button>
          </div>
        </details>
      </section>

      <SugarReadingList
        title="Readings"
        readings={filteredReadings}
        tagsById={tagsById}
        settings={settings}
        emptyMessage={
          hasInvalidRange
            ? 'Fix the date range to see readings.'
            : 'No sugar readings match the current filters.'
        }
        highlightReadingId={searchParams.get('highlight')}
      />
    </SiteShell>
  );
}