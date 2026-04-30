import {
  Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { useMemo, useState } from 'react';
import { CategoryChipFilter } from '../components/CategoryChipFilter';
import { SiteShell } from '../components/SiteShell';
import { DateRangePicker } from '../components/sugar/DateRangePicker';
import { WeightReadingList } from '../components/weight/WeightReadingList';
import { WeightTagGroupSelector } from '../components/weight/WeightTagGroupSelector';
import { useAppData } from '../context/AppDataContext';
import {
  applyCategorizedReadingFilters, buildPresetDateRange, buildReadingMetrics, classifyReading, createCategorizedReadingFilters,
  sortReadingsAscending, sortReadingsDescending
} from '../lib/readingUtils';
import { WEIGHT_TAG_CATEGORY_LABELS, WEIGHT_TAG_CATEGORY_ORDER } from '../lib/tagCategories';
import type { ChartPreset, WeightReadingFilters, WeightTagDefinition } from '../lib/types';

const chartDateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
const tooltipFmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', hour12: false });

type ChartDatum = { id: string; label: string; value: number; status: string; dateTime: string; color: string };

export function WeightChartPage() {
  const { weightReadings, settings, weightTags } = useAppData();
  const [activePreset, setActivePreset] = useState<ChartPreset | 'custom'>(settings.defaultChartPreset);
  const [filters, setFilters] = useState<WeightReadingFilters>(() => createCategorizedReadingFilters(buildPresetDateRange(settings.defaultChartPreset)));
  const hasInvalidRange = filters.startDate !== '' && filters.endDate !== '' && filters.startDate > filters.endDate;

  const tagsById = useMemo(() => new Map(weightTags.map((t) => [t.id, t] as const)), [weightTags]);
  const filteredReadings = useMemo(() => hasInvalidRange ? [] : applyCategorizedReadingFilters(weightReadings, filters, tagsById), [filters, hasInvalidRange, tagsById, weightReadings]);

  const chartData = useMemo<ChartDatum[]>(() => {
    return sortReadingsAscending(filteredReadings).map((r) => {
      const rTags = r.tagIds.map((id) => tagsById.get(id)).filter(Boolean) as WeightTagDefinition[];
      const status = classifyReading(r as any, rTags).status;
      const color = status === 'inside' ? settings.weightChartColorInside : status === 'outside' ? settings.weightChartColorOutside : settings.weightChartColorNeutral;
      return { id: r.id, label: chartDateFmt.format(new Date(r.readingDateTimeIso)), value: r.value, status, dateTime: r.readingDateTimeIso, color };
    });
  }, [filteredReadings, settings, tagsById]);

  const metrics = useMemo(() => buildReadingMetrics(filteredReadings as any, tagsById as any), [filteredReadings, tagsById]);

  return (
    <SiteShell title="Weight Trends" subtitle="Chart view with optional filters below.">
      <section className="doc-card chart-card" aria-label="Weight trend chart">
        <div className="section-header-inline"><div><h2>Weight chart</h2><p>Colors reflect range classification from Settings.</p></div></div>
        {chartData.length === 0 ? (
          <div className="empty-state"><p>{hasInvalidRange ? 'Fix the date range to view the chart.' : 'No readings match the chart filters yet.'}</p></div>
        ) : (
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={chartData}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--ink-soft)" />
                <YAxis stroke="var(--ink-soft)" />
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const p = payload[0].payload as ChartDatum;
                  return <div className="chart-tooltip"><p>{tooltipFmt.format(new Date(p.dateTime))}</p><strong>{p.value} kg</strong></div>;
                }} />
                <Area type="linear" dataKey="value" fill={settings.weightChartColorNeutral} fillOpacity={0.18} stroke="none" />
                <Line type="linear" dataKey="value" stroke={settings.weightChartColorNeutral} strokeWidth={3}
                  dot={(props: any) => { const pl = props.payload as ChartDatum; return <circle cx={props.cx} cy={props.cy} r={4.5} fill={pl.color} stroke="var(--card)" strokeWidth={2} />; }}
                  activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="metrics-grid">
          <article className="metric-card positive"><p>Inside range</p><strong>{metrics.insidePercent}%</strong><span>{metrics.insideCount} readings</span></article>
          <article className="metric-card caution"><p>Outside range</p><strong>{metrics.outsidePercent}%</strong><span>{metrics.outsideCount} readings</span></article>
          <article className="metric-card neutral"><p>Neutral</p><strong>{metrics.neutralCount}</strong><span>{metrics.totalCount} total</span></article>
          <article className="metric-card"><p>Low / high</p><strong>{metrics.lowestValue ?? '-'} / {metrics.highestValue ?? '-'}</strong><span>kg in filter range</span></article>
        </div>
      </section>
      <section className="doc-card section-stack compact-controls">
        <details className="compact-details">
          <summary>Chart filters</summary>
          <DateRangePicker filters={filters} onChange={(f) => { setActivePreset('custom'); setFilters((current) => ({ ...current, startDate: f.startDate, endDate: f.endDate })); }} activePreset={activePreset} onPresetChange={(p) => { setActivePreset(p); setFilters((current) => ({ ...current, ...buildPresetDateRange(p) })); }} showPresets errorMessage={hasInvalidRange ? 'Start date cannot be after end date.' : null} />
          <CategoryChipFilter
            title="Categories"
            helperText="Filter weight chart data by grouped tag categories."
            categories={WEIGHT_TAG_CATEGORY_ORDER}
            categoryLabels={WEIGHT_TAG_CATEGORY_LABELS}
            selectedCategories={filters.categories}
            onChange={(categories) => setFilters((current) => ({ ...current, categories }))}
          />
          <WeightTagGroupSelector tags={weightTags} readings={weightReadings} settings={settings} selectedTagIds={filters.tagIds} onChange={(tagIds) => setFilters((c) => ({ ...c, tagIds }))} label="Specific tags" helperText="Filters apply to both the chart and list below." manageLinkTo="/settings/tags" />
        </details>
      </section>
      <WeightReadingList title="Readings in this chart" readings={sortReadingsDescending(filteredReadings)} tagsById={tagsById} settings={settings} emptyMessage="No readings for the chart filters." />
    </SiteShell>
  );
}
