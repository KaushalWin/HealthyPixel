import {
  Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { useMemo, useState } from 'react';
import { SiteShell } from '../components/SiteShell';
import { DateRangePicker } from '../components/sugar/DateRangePicker';
import { HeightReadingList } from '../components/height/HeightReadingList';
import { TagChipSelector } from '../components/TagChipSelector';
import { useAppData } from '../context/AppDataContext';
import {
  applyReadingFilters, buildPresetDateRange, buildReadingMetrics, classifyReading,
  sortReadingsAscending, sortReadingsDescending
} from '../lib/readingUtils';
import type { ChartPreset, ReadingFilters, TagDefinition } from '../lib/types';

const chartDateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
const tooltipFmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', hour12: false });

type ChartDatum = { id: string; label: string; value: number; status: string; dateTime: string; color: string };

export function HeightChartPage() {
  const { heightReadings, settings, heightTags } = useAppData();
  const [activePreset, setActivePreset] = useState<ChartPreset | 'custom'>(settings.defaultChartPreset);
  const [filters, setFilters] = useState<ReadingFilters>(() => buildPresetDateRange(settings.defaultChartPreset));
  const hasInvalidRange = filters.startDate !== '' && filters.endDate !== '' && filters.startDate > filters.endDate;

  const filteredReadings = useMemo(() => hasInvalidRange ? [] : applyReadingFilters(heightReadings, filters), [filters, hasInvalidRange, heightReadings]);
  const tagsById = useMemo(() => new Map(heightTags.map((t) => [t.id, t])), [heightTags]);

  const chartData = useMemo<ChartDatum[]>(() => {
    return sortReadingsAscending(filteredReadings).map((r) => {
      const rTags = r.tagIds.map((id) => tagsById.get(id)).filter(Boolean) as TagDefinition[];
      const status = classifyReading(r as any, rTags).status;
      const color = status === 'inside' ? settings.heightChartColorInside : status === 'outside' ? settings.heightChartColorOutside : settings.heightChartColorNeutral;
      return { id: r.id, label: chartDateFmt.format(new Date(r.readingDateTimeIso)), value: r.value, status, dateTime: r.readingDateTimeIso, color };
    });
  }, [filteredReadings, settings, tagsById]);

  const metrics = useMemo(() => buildReadingMetrics(filteredReadings as any, tagsById as any), [filteredReadings, tagsById]);

  return (
    <SiteShell title="Height Trends" subtitle="Chart view with optional filters below.">
      <section className="doc-card chart-card" aria-label="Height trend chart">
        <div className="section-header-inline"><div><h2>Height chart</h2><p>Colors reflect range classification from Settings.</p></div></div>
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
                  return <div className="chart-tooltip"><p>{tooltipFmt.format(new Date(p.dateTime))}</p><strong>{p.value} cm</strong></div>;
                }} />
                <Area type="linear" dataKey="value" fill={settings.heightChartColorNeutral} fillOpacity={0.18} stroke="none" />
                <Line type="linear" dataKey="value" stroke={settings.heightChartColorNeutral} strokeWidth={3}
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
          <article className="metric-card"><p>Low / high</p><strong>{metrics.lowestValue ?? '-'} / {metrics.highestValue ?? '-'}</strong><span>cm in filter range</span></article>
        </div>
      </section>
      <section className="doc-card section-stack compact-controls">
        <details className="compact-details">
          <summary>Chart filters</summary>
          <DateRangePicker filters={filters} onChange={(f) => { setActivePreset('custom'); setFilters(f); }} activePreset={activePreset} onPresetChange={(p) => { setActivePreset(p); setFilters({ ...buildPresetDateRange(p), tagIds: filters.tagIds }); }} showPresets errorMessage={hasInvalidRange ? 'Start date cannot be after end date.' : null} />
          <TagChipSelector tags={heightTags} readings={heightReadings} settings={settings} selectedTagIds={filters.tagIds} onChange={(tagIds) => setFilters((c) => ({ ...c, tagIds }))} manageLinkTo="/settings/tags" />
        </details>
      </section>
      <HeightReadingList title="Readings in this chart" readings={sortReadingsDescending(filteredReadings)} tagsById={tagsById} settings={settings} emptyMessage="No readings for the chart filters." />
    </SiteShell>
  );
}
