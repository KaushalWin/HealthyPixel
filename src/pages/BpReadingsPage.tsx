import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { CategoryChipFilter } from '../components/CategoryChipFilter';
import { SiteShell } from '../components/SiteShell';
import { DateRangePicker } from '../components/sugar/DateRangePicker';
import { BpReadingList } from '../components/bp/BpReadingList';
import { BpTagGroupSelector } from '../components/bp/BpTagGroupSelector';
import { useAppData } from '../context/AppDataContext';
import { applyCategorizedReadingFilters, sortReadingsDescending } from '../lib/readingUtils';
import { BP_TAG_CATEGORY_LABELS, BP_TAG_CATEGORY_ORDER } from '../lib/tagCategories';
import type { BpReadingFilters, BpTagCategory } from '../lib/types';

function parseCategories(searchParams: URLSearchParams): BpTagCategory[] {
  return (searchParams.get('categories') ?? '')
    .split(',')
    .filter((value): value is BpTagCategory =>
      BP_TAG_CATEGORY_ORDER.includes(value as BpTagCategory)
    );
}

function filtersFromSearch(searchParams: URLSearchParams): BpReadingFilters {
  return {
    startDate: searchParams.get('start') ?? '',
    endDate: searchParams.get('end') ?? '',
    tagIds: (searchParams.get('tags') ?? '').split(',').filter(Boolean),
    categories: parseCategories(searchParams)
  };
}

export function BpReadingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { bpReadings, settings, bpTags } = useAppData();
  const [filters, setFilters] = useState<BpReadingFilters>(() => filtersFromSearch(searchParams));

  useEffect(() => { setFilters(filtersFromSearch(searchParams)); }, [searchParams]);

  const hasInvalidRange = filters.startDate !== '' && filters.endDate !== '' && filters.startDate > filters.endDate;

  const tagsById = useMemo(() => new Map(bpTags.map((t) => [t.id, t] as const)), [bpTags]);

  const filteredReadings = useMemo(() => {
    if (hasInvalidRange) return [];
    return sortReadingsDescending(applyCategorizedReadingFilters(bpReadings, filters, tagsById));
  }, [bpReadings, filters, hasInvalidRange, tagsById]);

  const updateFilters = (nextFilters: BpReadingFilters) => {
    setFilters(nextFilters);
    const nextParams = new URLSearchParams(searchParams);
    if (nextFilters.startDate) nextParams.set('start', nextFilters.startDate); else nextParams.delete('start');
    if (nextFilters.endDate) nextParams.set('end', nextFilters.endDate); else nextParams.delete('end');
    if (nextFilters.tagIds.length > 0) nextParams.set('tags', nextFilters.tagIds.join(',')); else nextParams.delete('tags');
    if (nextFilters.categories.length > 0) nextParams.set('categories', nextFilters.categories.join(',')); else nextParams.delete('categories');
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <SiteShell title="BP List" subtitle="Blood pressure readings with filters.">
      <section className="doc-card section-stack">
        <div className="action-row">
          <Link to="/bp/add" className="primary-button">Add new entry</Link>
          <Link to="/bp/chart" className="secondary-button">Open chart</Link>
        </div>
        <details className="compact-details">
          <summary>List filters</summary>
          <DateRangePicker filters={filters} onChange={(nextFilters) => updateFilters({ ...filters, startDate: nextFilters.startDate, endDate: nextFilters.endDate })} errorMessage={hasInvalidRange ? 'Start date cannot be after end date.' : null} />
          <CategoryChipFilter
            title="Categories"
            helperText="Filter blood pressure readings by grouped tag categories."
            categories={BP_TAG_CATEGORY_ORDER}
            categoryLabels={BP_TAG_CATEGORY_LABELS}
            selectedCategories={filters.categories}
            onChange={(categories) => updateFilters({ ...filters, categories })}
          />
          <BpTagGroupSelector tags={bpTags} readings={bpReadings} settings={settings} selectedTagIds={filters.tagIds} onChange={(tagIds) => updateFilters({ ...filters, tagIds })} label="Specific tags" helperText="Filter by one or more specific blood pressure tags." manageLinkTo="/settings/tags" />
          <div className="action-row compact">
            <button type="button" className="secondary-button small" onClick={() => updateFilters({ startDate: '', endDate: '', tagIds: [], categories: [] })}>Clear filters</button>
          </div>
        </details>
      </section>
      <BpReadingList
        title="Readings"
        readings={filteredReadings}
        tagsById={tagsById}
        settings={settings}
        emptyMessage={hasInvalidRange ? 'Fix the date range to see readings.' : 'No blood pressure readings match the current filters.'}
        highlightReadingId={searchParams.get('highlight')}
      />
    </SiteShell>
  );
}
