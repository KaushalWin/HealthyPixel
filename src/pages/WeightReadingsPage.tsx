import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { CategoryChipFilter } from '../components/CategoryChipFilter';
import { SiteShell } from '../components/SiteShell';
import { DateRangePicker } from '../components/sugar/DateRangePicker';
import { WeightReadingList } from '../components/weight/WeightReadingList';
import { WeightTagGroupSelector } from '../components/weight/WeightTagGroupSelector';
import { useAppData } from '../context/AppDataContext';
import { applyCategorizedReadingFilters, sortReadingsDescending } from '../lib/readingUtils';
import { WEIGHT_TAG_CATEGORY_LABELS, WEIGHT_TAG_CATEGORY_ORDER } from '../lib/tagCategories';
import type { WeightReadingFilters, WeightTagCategory } from '../lib/types';

function parseCategories(searchParams: URLSearchParams): WeightTagCategory[] {
  return (searchParams.get('categories') ?? '')
    .split(',')
    .filter((value): value is WeightTagCategory =>
      WEIGHT_TAG_CATEGORY_ORDER.includes(value as WeightTagCategory)
    );
}

function filtersFromSearch(searchParams: URLSearchParams): WeightReadingFilters {
  return {
    startDate: searchParams.get('start') ?? '',
    endDate: searchParams.get('end') ?? '',
    tagIds: (searchParams.get('tags') ?? '').split(',').filter(Boolean),
    categories: parseCategories(searchParams)
  };
}

export function WeightReadingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { weightReadings, settings, weightTags } = useAppData();
  const [filters, setFilters] = useState<WeightReadingFilters>(() => filtersFromSearch(searchParams));

  useEffect(() => { setFilters(filtersFromSearch(searchParams)); }, [searchParams]);

  const hasInvalidRange = filters.startDate !== '' && filters.endDate !== '' && filters.startDate > filters.endDate;

  const tagsById = useMemo(() => new Map(weightTags.map((t) => [t.id, t] as const)), [weightTags]);

  const filteredReadings = useMemo(() => {
    if (hasInvalidRange) return [];
    return sortReadingsDescending(applyCategorizedReadingFilters(weightReadings, filters, tagsById));
  }, [filters, hasInvalidRange, tagsById, weightReadings]);

  const updateFilters = (nextFilters: WeightReadingFilters) => {
    setFilters(nextFilters);
    const nextParams = new URLSearchParams(searchParams);
    if (nextFilters.startDate) nextParams.set('start', nextFilters.startDate); else nextParams.delete('start');
    if (nextFilters.endDate) nextParams.set('end', nextFilters.endDate); else nextParams.delete('end');
    if (nextFilters.tagIds.length > 0) nextParams.set('tags', nextFilters.tagIds.join(',')); else nextParams.delete('tags');
    if (nextFilters.categories.length > 0) nextParams.set('categories', nextFilters.categories.join(',')); else nextParams.delete('categories');
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <SiteShell title="Weight List" subtitle="Compact list with quick add and optional filters.">
      <section className="doc-card section-stack">
        <div className="action-row">
          <Link to="/weight/add" className="primary-button">Add new entry</Link>
          <Link to="/weight/chart" className="secondary-button">Open chart</Link>
        </div>
        <details className="compact-details">
          <summary>List filters</summary>
          <DateRangePicker filters={filters} onChange={(nextFilters) => updateFilters({ ...filters, startDate: nextFilters.startDate, endDate: nextFilters.endDate })} errorMessage={hasInvalidRange ? 'Start date cannot be after end date.' : null} />
          <CategoryChipFilter
            title="Categories"
            helperText="Filter weight readings by grouped tag categories."
            categories={WEIGHT_TAG_CATEGORY_ORDER}
            categoryLabels={WEIGHT_TAG_CATEGORY_LABELS}
            selectedCategories={filters.categories}
            onChange={(categories) => updateFilters({ ...filters, categories })}
          />
          <WeightTagGroupSelector tags={weightTags} readings={weightReadings} settings={settings} selectedTagIds={filters.tagIds} onChange={(tagIds) => updateFilters({ ...filters, tagIds })} label="Specific tags" helperText="Filter by one or more specific weight tags." manageLinkTo="/settings/tags" />
          <div className="action-row compact">
            <button type="button" className="secondary-button small" onClick={() => updateFilters({ startDate: '', endDate: '', tagIds: [], categories: [] })}>Clear filters</button>
          </div>
        </details>
      </section>
      <WeightReadingList
        title="Readings"
        readings={filteredReadings}
        tagsById={tagsById}
        settings={settings}
        emptyMessage={hasInvalidRange ? 'Fix the date range to see readings.' : 'No weight readings match the current filters.'}
        highlightReadingId={searchParams.get('highlight')}
      />
    </SiteShell>
  );
}
