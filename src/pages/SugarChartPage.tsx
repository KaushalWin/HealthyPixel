import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useMemo, useState } from 'react';
import { CategoryChipFilter } from '../components/CategoryChipFilter';
import { SiteShell } from '../components/SiteShell';
import { DateRangePicker } from '../components/sugar/DateRangePicker';
import { SugarReadingList } from '../components/sugar/SugarReadingList';
import { SugarTagGroupSelector } from '../components/sugar/SugarTagGroupSelector';
import { useAppData } from '../context/AppDataContext';
import {
  applyCategorizedReadingFilters,
  buildValueTagBreakdown,
  buildPresetDateRange,
  createCategorizedReadingFilters,
  buildReadingMetrics,
  classifyReading,
  sortReadingsAscending,
  sortReadingsDescending
} from '../lib/readingUtils';
import {
  SUGAR_TAG_CATEGORY_CHART_COLORS,
  SUGAR_TAG_CATEGORY_LABELS,
  SUGAR_TAG_CATEGORY_ORDER
} from '../lib/tagCategories';
import type { ChartPreset, SugarReadingFilters, SugarTagDefinition } from '../lib/types';

const chartDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short'
});

const tooltipFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  hour12: false
});

type ChartDatum = {
  id: string;
  label: string;
  value: number;
  status: 'inside' | 'outside' | 'neutral';
  dateTime: string;
  color: string;
};

export function SugarChartPage() {
  const { readings, settings, tags } = useAppData();
  const [activePreset, setActivePreset] = useState<ChartPreset | 'custom'>(
    settings.defaultChartPreset
  );
  const [filters, setFilters] = useState<SugarReadingFilters>(() =>
    createCategorizedReadingFilters(buildPresetDateRange(settings.defaultChartPreset))
  );

  const hasInvalidRange =
    filters.startDate !== '' && filters.endDate !== '' && filters.startDate > filters.endDate;

  const tagsById = useMemo(() => new Map(tags.map((tag) => [tag.id, tag] as const)), [tags]);

  const filteredReadings = useMemo(() => {
    if (hasInvalidRange) {
      return [];
    }

    return applyCategorizedReadingFilters(readings, filters, tagsById);
  }, [filters, hasInvalidRange, readings, tagsById]);

  const chartData = useMemo<ChartDatum[]>(() => {
    return sortReadingsAscending(filteredReadings).map((reading) => {
      const readingTags = reading.tagIds
        .map((tagId) => tagsById.get(tagId))
        .filter(Boolean) as SugarTagDefinition[];
      const status = classifyReading(reading, readingTags).status;
      const color =
        status === 'inside'
          ? settings.chartColorInside
          : status === 'outside'
            ? settings.chartColorOutside
            : settings.chartColorNeutral;

      return {
        id: reading.id,
        label: chartDateFormatter.format(new Date(reading.readingDateTimeIso)),
        value: reading.value,
        status,
        dateTime: reading.readingDateTimeIso,
        color
      };
    });
  }, [filteredReadings, settings.chartColorInside, settings.chartColorNeutral, settings.chartColorOutside, tagsById]);

  const metrics = useMemo(() => buildReadingMetrics(filteredReadings, tagsById), [filteredReadings, tagsById]);

  const tagBreakdown = useMemo(
    () => buildValueTagBreakdown(filteredReadings, tagsById, filters.categories).slice(0, 8),
    [filteredReadings, filters.categories, tagsById]
  );

  return (
    <SiteShell
      title="Sugar Trends"
      subtitle="Compact chart-first view with optional filters below."
    >
      <section className="doc-card chart-card" aria-label="Sugar trend chart">
        <div className="section-header-inline">
          <div>
            <h2>Reading chart</h2>
            <p>Inside range, outside range, and neutral values use separate colors from Settings.</p>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="empty-state">
            <p>{hasInvalidRange ? 'Fix the date range to view the chart.' : 'No readings match the chart filters yet.'}</p>
          </div>
        ) : (
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={chartData}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--ink-soft)" />
                <YAxis stroke="var(--ink-soft)" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) {
                      return null;
                    }

                    const point = payload[0]?.payload as ChartDatum;
                    return (
                      <div className="chart-tooltip">
                        <p>{tooltipFormatter.format(new Date(point.dateTime))}</p>
                        <strong>{point.value}</strong>
                      </div>
                    );
                  }}
                />
                <Area
                  type="linear"
                  dataKey="value"
                  fill={settings.chartColorNeutral}
                  fillOpacity={0.18}
                  stroke="none"
                />
                <Line
                  type="linear"
                  dataKey="value"
                  stroke={settings.chartColorNeutral}
                  strokeWidth={3}
                  dot={(props) => {
                    const payload = props.payload as ChartDatum;
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={4.5}
                        fill={payload.color}
                        stroke="var(--card)"
                        strokeWidth={2}
                      />
                    );
                  }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="metrics-grid">
          <article className="metric-card positive">
            <p>Inside range</p>
            <strong>{metrics.insidePercent}%</strong>
            <span>{metrics.insideCount} readings</span>
          </article>
          <article className="metric-card caution">
            <p>Outside range</p>
            <strong>{metrics.outsidePercent}%</strong>
            <span>{metrics.outsideCount} readings</span>
          </article>
          <article className="metric-card neutral">
            <p>Neutral / no range</p>
            <strong>{metrics.neutralCount}</strong>
            <span>{metrics.totalCount} total readings</span>
          </article>
          <article className="metric-card">
            <p>Lowest / highest</p>
            <strong>
              {metrics.lowestValue ?? '-'} / {metrics.highestValue ?? '-'}
            </strong>
            <span>Within the selected filters</span>
          </article>
        </div>
      </section>

      <section className="doc-card chart-card" aria-label="Sugar tag breakdown chart">
        <div className="section-header-inline">
          <div>
            <h2>Top matching tags</h2>
            <p>The chart below shows which sugar tags appear most often after your current filters are applied.</p>
          </div>
        </div>

        {tagBreakdown.length === 0 ? (
          <div className="empty-state">
            <p>No tag breakdown is available for the current filters yet.</p>
          </div>
        ) : (
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={tagBreakdown} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--ink-soft)" allowDecimals={false} />
                <YAxis type="category" dataKey="label" stroke="var(--ink-soft)" width={110} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) {
                      return null;
                    }

                    const point = payload[0]?.payload as (typeof tagBreakdown)[number];
                    return (
                      <div className="chart-tooltip">
                        <strong>{point.label}</strong>
                        <p>{point.count} readings</p>
                        <p>{point.averageValue} avg</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {tagBreakdown.map((entry) => (
                    <Cell key={entry.key} fill={SUGAR_TAG_CATEGORY_CHART_COLORS[entry.category]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="doc-card section-stack compact-controls">
        <details className="compact-details">
          <summary>Chart filters</summary>

          <DateRangePicker
            filters={filters}
            onChange={(nextFilters) => {
              setActivePreset('custom');
              setFilters((current) => ({
                ...current,
                startDate: nextFilters.startDate,
                endDate: nextFilters.endDate
              }));
            }}
            activePreset={activePreset}
            onPresetChange={(preset) => {
              setActivePreset(preset);
              setFilters((current) => ({
                ...current,
                ...buildPresetDateRange(preset)
              }));
            }}
            showPresets
            errorMessage={hasInvalidRange ? 'Start date cannot be after end date.' : null}
          />

          <CategoryChipFilter
            title="Categories"
            helperText="Filter sugar chart data by grouped tag categories."
            categories={SUGAR_TAG_CATEGORY_ORDER}
            categoryLabels={SUGAR_TAG_CATEGORY_LABELS}
            selectedCategories={filters.categories}
            onChange={(categories) => setFilters((current) => ({ ...current, categories }))}
          />

          <SugarTagGroupSelector
            tags={tags}
            readings={readings}
            settings={settings}
            selectedTagIds={filters.tagIds}
            onChange={(tagIds) => setFilters((current) => ({ ...current, tagIds }))}
            label="Specific tags"
            helperText="Filters apply to both the chart and list below."
            manageLinkTo="/settings/tags"
          />
        </details>
      </section>

      <SugarReadingList
        title="Readings in this chart"
        readings={sortReadingsDescending(filteredReadings)}
        tagsById={tagsById}
        settings={settings}
        emptyMessage="No readings are available for the chart filters."
      />
    </SiteShell>
  );
}