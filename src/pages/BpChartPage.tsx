import {
  Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { useMemo, useState } from 'react';
import { CategoryChipFilter } from '../components/CategoryChipFilter';
import { SiteShell } from '../components/SiteShell';
import { DateRangePicker } from '../components/sugar/DateRangePicker';
import { BpReadingList } from '../components/bp/BpReadingList';
import { BpTagGroupSelector } from '../components/bp/BpTagGroupSelector';
import { useAppData } from '../context/AppDataContext';
import {
  applyCategorizedReadingFilters, buildBpReadingMetrics, buildBpTagBreakdown, buildPresetDateRange, classifyBpReading, createCategorizedReadingFilters,
  sortReadingsAscending, sortReadingsDescending
} from '../lib/readingUtils';
import { BP_TAG_CATEGORY_CHART_COLORS, BP_TAG_CATEGORY_LABELS, BP_TAG_CATEGORY_ORDER } from '../lib/tagCategories';
import type { BpReadingFilters, BpTagDefinition, ChartPreset } from '../lib/types';

const chartDateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
const tooltipFmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', hour12: false });

type ChartDatum = {
  id: string;
  label: string;
  systolic: number;
  diastolic: number;
  status: string;
  dateTime: string;
};

export function BpChartPage() {
  const { bpReadings, settings, bpTags } = useAppData();
  const [activePreset, setActivePreset] = useState<ChartPreset | 'custom'>(settings.defaultChartPreset);
  const [filters, setFilters] = useState<BpReadingFilters>(() => createCategorizedReadingFilters(buildPresetDateRange(settings.defaultChartPreset)));
  const hasInvalidRange = filters.startDate !== '' && filters.endDate !== '' && filters.startDate > filters.endDate;

  const tagsById = useMemo(() => new Map(bpTags.map((t) => [t.id, t] as const)), [bpTags]);
  const filteredReadings = useMemo(() => hasInvalidRange ? [] : applyCategorizedReadingFilters(bpReadings, filters, tagsById), [bpReadings, filters, hasInvalidRange, tagsById]);

  const chartData = useMemo<ChartDatum[]>(() => {
    return sortReadingsAscending(filteredReadings).map((r) => {
      const rTags = r.tagIds.map((id) => tagsById.get(id)).filter(Boolean) as BpTagDefinition[];
      const status = classifyBpReading(r, rTags).status;
      return {
        id: r.id,
        label: chartDateFmt.format(new Date(r.readingDateTimeIso)),
        systolic: r.systolic,
        diastolic: r.diastolic,
        status,
        dateTime: r.readingDateTimeIso
      };
    });
  }, [filteredReadings, tagsById]);

  const metrics = useMemo(() => buildBpReadingMetrics(filteredReadings, tagsById), [filteredReadings, tagsById]);

  const tagBreakdown = useMemo(
    () => buildBpTagBreakdown(filteredReadings, tagsById, filters.categories).slice(0, 8),
    [filteredReadings, filters.categories, tagsById]
  );

  return (
    <SiteShell title="BP Trends" subtitle="Dual-line chart for systolic and diastolic.">
      <section className="doc-card chart-card" aria-label="Blood pressure trend chart">
        <div className="section-header-inline">
          <div>
            <h2>Blood pressure chart</h2>
            <p>Systolic (top line) and diastolic (bottom line) over time.</p>
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
                    if (!active || !payload?.[0]) return null;
                    const p = payload[0].payload as ChartDatum;
                    return (
                      <div className="chart-tooltip">
                        <p>{tooltipFmt.format(new Date(p.dateTime))}</p>
                        <strong>{p.systolic}/{p.diastolic} mmHg</strong>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Line
                  type="linear"
                  dataKey="systolic"
                  name="Systolic"
                  stroke={settings.bpChartColorSystolic}
                  strokeWidth={3}
                  dot={{ r: 4, fill: settings.bpChartColorSystolic, stroke: 'var(--card)', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="linear"
                  dataKey="diastolic"
                  name="Diastolic"
                  stroke={settings.bpChartColorDiastolic}
                  strokeWidth={3}
                  dot={{ r: 4, fill: settings.bpChartColorDiastolic, stroke: 'var(--card)', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="metrics-grid">
          <article className="metric-card positive">
            <p>In range</p>
            <strong>{metrics.insidePercent}%</strong>
            <span>{metrics.insideCount} readings</span>
          </article>
          <article className="metric-card caution">
            <p>Out of range</p>
            <strong>{metrics.outsidePercent}%</strong>
            <span>{metrics.outsideCount} readings</span>
          </article>
          <article className="metric-card neutral">
            <p>Neutral</p>
            <strong>{metrics.neutralCount}</strong>
            <span>{metrics.totalCount} total</span>
          </article>
          <article className="metric-card">
            <p>Systolic range</p>
            <strong>{metrics.lowestSystolic ?? '-'} – {metrics.highestSystolic ?? '-'}</strong>
            <span>mmHg</span>
          </article>
          <article className="metric-card">
            <p>Diastolic range</p>
            <strong>{metrics.lowestDiastolic ?? '-'} – {metrics.highestDiastolic ?? '-'}</strong>
            <span>mmHg</span>
          </article>
        </div>
      </section>
      <section className="doc-card chart-card" aria-label="Blood pressure tag breakdown chart">
        <div className="section-header-inline">
          <div>
            <h2>Top matching tags</h2>
            <p>The chart below shows which blood pressure tags appear most often after your current filters are applied.</p>
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
                        <p>{point.averageSystolic}/{point.averageDiastolic} avg mmHg</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {tagBreakdown.map((entry) => (
                    <Cell key={entry.key} fill={BP_TAG_CATEGORY_CHART_COLORS[entry.category]} />
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
            onChange={(f) => { setActivePreset('custom'); setFilters((current) => ({ ...current, startDate: f.startDate, endDate: f.endDate })); }}
            activePreset={activePreset}
            onPresetChange={(p) => { setActivePreset(p); setFilters((current) => ({ ...current, ...buildPresetDateRange(p) })); }}
            showPresets
            errorMessage={hasInvalidRange ? 'Start date cannot be after end date.' : null}
          />
          <CategoryChipFilter
            title="Categories"
            helperText="Filter blood pressure chart data by grouped tag categories."
            categories={BP_TAG_CATEGORY_ORDER}
            categoryLabels={BP_TAG_CATEGORY_LABELS}
            selectedCategories={filters.categories}
            onChange={(categories) => setFilters((current) => ({ ...current, categories }))}
          />
          <BpTagGroupSelector tags={bpTags} readings={bpReadings} settings={settings} selectedTagIds={filters.tagIds} onChange={(tagIds) => setFilters((c) => ({ ...c, tagIds }))} label="Specific tags" helperText="Filters apply to both the chart and list below." manageLinkTo="/settings/tags" />
        </details>
      </section>
      <BpReadingList
        title="Readings in this chart"
        readings={sortReadingsDescending(filteredReadings)}
        tagsById={tagsById}
        settings={settings}
        emptyMessage="No readings for the chart filters."
      />
    </SiteShell>
  );
}
