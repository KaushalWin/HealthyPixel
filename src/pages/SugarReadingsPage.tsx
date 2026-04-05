import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { SiteShell } from '../components/SiteShell';
import { DateRangePicker } from '../components/sugar/DateRangePicker';
import { SugarReadingList } from '../components/sugar/SugarReadingList';
import { TagSelector } from '../components/sugar/TagSelector';
import { useAppData } from '../context/AppDataContext';
import { applyReadingFilters, sortReadingsDescending } from '../lib/readingUtils';
import type { ReadingFilters } from '../lib/types';

function filtersFromSearch(searchParams: URLSearchParams): ReadingFilters {
  return {
    startDate: searchParams.get('start') ?? '',
    endDate: searchParams.get('end') ?? '',
    tagIds: (searchParams.get('tags') ?? '').split(',').filter(Boolean)
  };
}

export function SugarReadingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { readings, settings, tags } = useAppData();
  const [filters, setFilters] = useState<ReadingFilters>(() => filtersFromSearch(searchParams));

  useEffect(() => {
    setFilters(filtersFromSearch(searchParams));
  }, [searchParams]);

  const hasInvalidRange =
    filters.startDate !== '' && filters.endDate !== '' && filters.startDate > filters.endDate;

  const filteredReadings = useMemo(() => {
    if (hasInvalidRange) {
      return [];
    }

    return sortReadingsDescending(applyReadingFilters(readings, filters));
  }, [filters, hasInvalidRange, readings]);

  const tagsById = useMemo(() => new Map(tags.map((tag) => [tag.id, tag])), [tags]);

  const updateFilters = (nextFilters: ReadingFilters) => {
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
            onChange={updateFilters}
            errorMessage={hasInvalidRange ? 'Start date cannot be after end date.' : null}
          />

          <TagSelector
            tags={tags}
            readings={readings}
            settings={settings}
            selectedTagIds={filters.tagIds}
            onChange={(tagIds) => updateFilters({ ...filters, tagIds })}
            helperText="Filter by one or more tags."
            manageLinkTo="/settings/tags"
            mode="dropdown"
          />

          <div className="action-row compact">
            <button
              type="button"
              className="secondary-button small"
              onClick={() => updateFilters({ startDate: '', endDate: '', tagIds: [] })}
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