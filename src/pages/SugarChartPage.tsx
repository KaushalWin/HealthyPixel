import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useMemo, useState } from 'react';
import { SiteShell } from '../components/SiteShell';
import { DateRangePicker } from '../components/sugar/DateRangePicker';
import { SugarReadingList } from '../components/sugar/SugarReadingList';
import { TagSelector } from '../components/sugar/TagSelector';
import { useAppData } from '../context/AppDataContext';
import {
  applyReadingFilters,
  buildPresetDateRange,
  buildReadingMetrics,
  classifyReading,
  sortReadingsAscending,
  sortReadingsDescending
} from '../lib/readingUtils';
import type { ChartPreset, ReadingFilters, TagDefinition } from '../lib/types';

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
  const [filters, setFilters] = useState<ReadingFilters>(() =>
    buildPresetDateRange(settings.defaultChartPreset)
  );

  const hasInvalidRange =
    filters.startDate !== '' && filters.endDate !== '' && filters.startDate > filters.endDate;

  const filteredReadings = useMemo(() => {
    if (hasInvalidRange) {
      return [];
    }

    return applyReadingFilters(readings, filters);
  }, [filters, hasInvalidRange, readings]);

  const tagsById = useMemo(() => new Map(tags.map((tag) => [tag.id, tag])), [tags]);

  const chartData = useMemo<ChartDatum[]>(() => {
    return sortReadingsAscending(filteredReadings).map((reading) => {
      const readingTags = reading.tagIds
        .map((tagId) => tagsById.get(tagId))
        .filter(Boolean) as TagDefinition[];
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

      <section className="doc-card section-stack compact-controls">
        <details className="compact-details">
          <summary>Chart filters</summary>

          <DateRangePicker
            filters={filters}
            onChange={(nextFilters) => {
              setActivePreset('custom');
              setFilters(nextFilters);
            }}
            activePreset={activePreset}
            onPresetChange={(preset) => {
              setActivePreset(preset);
              setFilters({ ...buildPresetDateRange(preset), tagIds: filters.tagIds });
            }}
            showPresets
            errorMessage={hasInvalidRange ? 'Start date cannot be after end date.' : null}
          />

          <TagSelector
            tags={tags}
            readings={readings}
            settings={settings}
            selectedTagIds={filters.tagIds}
            onChange={(tagIds) => setFilters((current) => ({ ...current, tagIds }))}
            helperText="Filters apply to both the chart and list below."
            manageLinkTo="/settings/tags"
            mode="dropdown"
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