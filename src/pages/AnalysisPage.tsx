import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SiteShell } from '../components/SiteShell';
import { DateRangePicker } from '../components/sugar/DateRangePicker';
import { useAppData } from '../context/AppDataContext';
import {
  applyReadingFilters,
  buildBpReadingMetrics,
  buildPresetDateRange,
  buildReadingMetrics,
  classifyBpReading,
  classifyReading,
  sortReadingsAscending,
  sortReadingsDescending
} from '../lib/readingUtils';
import type {
  BpReading,
  BpTagDefinition,
  ChartPreset,
  ReadingFilters,
  SugarReading,
  TagDefinition,
  VitalModule,
  WeightReading,
  HeightReading
} from '../lib/types';

/* ─── date formatters ─── */

const chartDateFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

const relativeTimeFmt = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

function relativeTimeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMin = Math.round(diffMs / 60_000);
  if (diffMin < 60) return relativeTimeFmt.format(-diffMin, 'minute');
  const diffHr = Math.round(diffMs / 3_600_000);
  if (diffHr < 24) return relativeTimeFmt.format(-diffHr, 'hour');
  const diffDay = Math.round(diffMs / 86_400_000);
  if (diffDay < 30) return relativeTimeFmt.format(-diffDay, 'day');
  const diffMonth = Math.round(diffDay / 30);
  return relativeTimeFmt.format(-diffMonth, 'month');
}

/* ─── trend helpers ─── */

type Trend = 'up' | 'down' | 'stable' | 'none';

function getTrendArrow(trend: Trend) {
  if (trend === 'up') return '↑';
  if (trend === 'down') return '↓';
  if (trend === 'stable') return '→';
  return '';
}

function computeTrend(sorted: { value: number }[]): Trend {
  if (sorted.length < 2) return 'none';
  const prev = sorted[sorted.length - 2].value;
  const latest = sorted[sorted.length - 1].value;
  if (latest > prev) return 'up';
  if (latest < prev) return 'down';
  return 'stable';
}

function computeBpTrend(sorted: BpReading[]): Trend {
  if (sorted.length < 2) return 'none';
  const prev = sorted[sorted.length - 2].systolic;
  const latest = sorted[sorted.length - 1].systolic;
  if (latest > prev) return 'up';
  if (latest < prev) return 'down';
  return 'stable';
}

/* ─── module config ─── */

const MODULE_META: Record<VitalModule, { label: string; unit: string; chartRoute: string; addRoute: string }> = {
  sugar: { label: 'Sugar', unit: 'mg/dL', chartRoute: '/sugar/chart', addRoute: '/sugar/add' },
  weight: { label: 'Weight', unit: 'kg', chartRoute: '/weight/chart', addRoute: '/weight/add' },
  height: { label: 'Height', unit: 'cm', chartRoute: '/height/chart', addRoute: '/height/add' },
  bp: { label: 'Blood Pressure', unit: 'mmHg', chartRoute: '/bp/chart', addRoute: '/bp/add' }
};

/* ─── single-value mini card (Sugar / Weight / Height) ─── */

function ValueModuleCard({
  mod,
  readings,
  tags,
  filters,
  colorInside,
  colorOutside,
  colorNeutral
}: {
  mod: VitalModule;
  readings: (SugarReading | WeightReading | HeightReading)[];
  tags: TagDefinition[];
  filters: ReadingFilters;
  colorInside: string;
  colorOutside: string;
  colorNeutral: string;
}) {
  const meta = MODULE_META[mod];
  const filtered = useMemo(() => applyReadingFilters(readings, filters), [readings, filters]);
  const tagsById = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);
  const ascending = useMemo(() => sortReadingsAscending(filtered), [filtered]);
  const metrics = useMemo(() => buildReadingMetrics(filtered, tagsById), [filtered, tagsById]);

  const chartData = useMemo(
    () =>
      ascending.map((r) => {
        const rTags = r.tagIds.map((id) => tagsById.get(id)).filter(Boolean) as TagDefinition[];
        const status = classifyReading(r, rTags).status;
        const color = status === 'inside' ? colorInside : status === 'outside' ? colorOutside : colorNeutral;
        return {
          label: chartDateFmt.format(new Date(r.readingDateTimeIso)),
          value: r.value,
          color
        };
      }),
    [ascending, tagsById, colorInside, colorOutside, colorNeutral]
  );

  const latest = readings.length > 0 ? sortReadingsDescending(readings)[0] : null;
  const trend = computeTrend(ascending);
  const isStale = latest ? Date.now() - new Date(latest.readingDateTimeIso).getTime() > 7 * 86_400_000 : false;

  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if the user clicked an inner link
    if ((e.target as HTMLElement).closest('a')) return;
    navigate(meta.chartRoute);
  };

  return (
    <article className="doc-card dashboard-card" role="button" tabIndex={0} onClick={handleCardClick} onKeyDown={(e) => { if (e.key === 'Enter') navigate(meta.chartRoute); }}>
      <div className="dashboard-card__header">
        <h2>{meta.label}</h2>
        <span className="dashboard-card__detail-hint">View details →</span>
      </div>

      {latest ? (
        <div className="dashboard-card__summary">
          <span className="dashboard-card__value">
            {(latest as SugarReading | WeightReading | HeightReading).value} {meta.unit}
          </span>
          <span className={`dashboard-card__ago${isStale ? ' stale' : ''}`}>
            {relativeTimeAgo(latest.readingDateTimeIso)}
          </span>
          {trend !== 'none' && (
            <span className={`dashboard-card__trend trend-${trend}`}>
              {getTrendArrow(trend)}
            </span>
          )}
          <span className="dashboard-card__badge positive">{metrics.insidePercent}% in range</span>
        </div>
      ) : (
        <div className="empty-state compact">
          <p>No readings yet.</p>
          <Link to={meta.addRoute} className="primary-button inline-block">
            Add {meta.label}
          </Link>
        </div>
      )}

      {chartData.length > 1 && (
        <div className="dashboard-card__chart">
          <ResponsiveContainer width="100%" height={140}>
            <ComposedChart data={chartData}>
              <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="var(--ink-soft)" tick={{ fontSize: 10 }} />
              <YAxis stroke="var(--ink-soft)" tick={{ fontSize: 10 }} width={36} />
              <Area type="linear" dataKey="value" fill={colorNeutral} fillOpacity={0.15} stroke="none" />
              <Line
                type="linear"
                dataKey="value"
                stroke={colorNeutral}
                strokeWidth={2}
                dot={(props) => {
                  const p = props.payload as { color: string };
                  return <circle cx={props.cx} cy={props.cy} r={3} fill={p.color} stroke="var(--card)" strokeWidth={1.5} />;
                }}
                activeDot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="dashboard-metrics-row">
          <span className="mini-metric positive">{metrics.insideCount} in</span>
          <span className="mini-metric caution">{metrics.outsideCount} out</span>
          <span className="mini-metric">Low {metrics.lowestValue ?? '-'}</span>
          <span className="mini-metric">High {metrics.highestValue ?? '-'}</span>
        </div>
      )}
    </article>
  );
}

/* ─── BP mini card ─── */

function BpModuleCard({
  readings,
  tags,
  filters,
  colorSystolic,
  colorDiastolic,
  colorNeutral
}: {
  readings: BpReading[];
  tags: BpTagDefinition[];
  filters: ReadingFilters;
  colorSystolic: string;
  colorDiastolic: string;
  colorNeutral: string;
}) {
  const meta = MODULE_META.bp;
  const filtered = useMemo(() => applyReadingFilters(readings, filters), [readings, filters]);
  const tagsById = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);
  const ascending = useMemo(() => sortReadingsAscending(filtered), [filtered]);
  const metrics = useMemo(() => buildBpReadingMetrics(filtered, tagsById), [filtered, tagsById]);

  const chartData = useMemo(
    () =>
      ascending.map((r) => ({
        label: chartDateFmt.format(new Date(r.readingDateTimeIso)),
        systolic: r.systolic,
        diastolic: r.diastolic
      })),
    [ascending]
  );

  const latest = readings.length > 0 ? sortReadingsDescending(readings)[0] : null;
  const trend = computeBpTrend(ascending);
  const isStale = latest ? Date.now() - new Date(latest.readingDateTimeIso).getTime() > 7 * 86_400_000 : false;
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a')) return;
    navigate(meta.chartRoute);
  };

  return (
    <article className="doc-card dashboard-card" role="button" tabIndex={0} onClick={handleCardClick} onKeyDown={(e) => { if (e.key === 'Enter') navigate(meta.chartRoute); }}>
      <div className="dashboard-card__header">
        <h2>{meta.label}</h2>
        <span className="dashboard-card__detail-hint">View details →</span>
      </div>

      {latest ? (
        <div className="dashboard-card__summary">
          <span className="dashboard-card__value">
            {latest.systolic}/{latest.diastolic} {meta.unit}
          </span>
          <span className={`dashboard-card__ago${isStale ? ' stale' : ''}`}>
            {relativeTimeAgo(latest.readingDateTimeIso)}
          </span>
          {trend !== 'none' && (
            <span className={`dashboard-card__trend trend-${trend}`}>
              {getTrendArrow(trend)}
            </span>
          )}
          <span className="dashboard-card__badge positive">{metrics.insidePercent}% in range</span>
        </div>
      ) : (
        <div className="empty-state compact">
          <p>No readings yet.</p>
          <Link to={meta.addRoute} className="primary-button inline-block">
            Add BP
          </Link>
        </div>
      )}

      {chartData.length > 1 && (
        <div className="dashboard-card__chart">
          <ResponsiveContainer width="100%" height={140}>
            <ComposedChart data={chartData}>
              <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="var(--ink-soft)" tick={{ fontSize: 10 }} />
              <YAxis stroke="var(--ink-soft)" tick={{ fontSize: 10 }} width={36} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="linear" dataKey="systolic" name="Sys" stroke={colorSystolic} strokeWidth={2} dot={{ r: 2.5, fill: colorSystolic }} activeDot={false} />
              <Line type="linear" dataKey="diastolic" name="Dia" stroke={colorDiastolic} strokeWidth={2} dot={{ r: 2.5, fill: colorDiastolic }} activeDot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="dashboard-metrics-row">
          <span className="mini-metric positive">{metrics.insideCount} in</span>
          <span className="mini-metric caution">{metrics.outsideCount} out</span>
          <span className="mini-metric">Sys {metrics.lowestSystolic ?? '-'}/{metrics.highestSystolic ?? '-'}</span>
          <span className="mini-metric">Dia {metrics.lowestDiastolic ?? '-'}/{metrics.highestDiastolic ?? '-'}</span>
        </div>
      )}
    </article>
  );
}

/* ─── main page ─── */

export function AnalysisPage() {
  const {
    readings,
    tags,
    weightReadings,
    weightTags,
    heightReadings,
    heightTags,
    bpReadings,
    bpTags,
    settings
  } = useAppData();

  const [activePreset, setActivePreset] = useState<ChartPreset | 'custom'>(settings.dashboardChartPreset);
  const [filters, setFilters] = useState<ReadingFilters>(() => buildPresetDateRange(settings.dashboardChartPreset));

  const enabledModules = settings.dashboardModules;

  const totalReadings = readings.length + weightReadings.length + heightReadings.length + bpReadings.length;
  const activeModuleCount = [readings, weightReadings, heightReadings, bpReadings].filter((arr) => arr.length > 0).length;

  if (enabledModules.length === 0) {
    return (
      <SiteShell title="Analysis" subtitle="Your vitals at a glance.">
        <section className="doc-card">
          <div className="empty-state">
            <p>All modules are disabled. Enable modules in <Link to="/settings">Settings</Link> to see your dashboard.</p>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell title="Analysis" subtitle="Your vitals at a glance.">
      {/* Summary banner */}
      <section className="dashboard-summary-banner">
        <span><strong>{totalReadings}</strong> readings across <strong>{activeModuleCount}</strong> modules</span>
      </section>

      {/* Global date filter */}
      <section className="doc-card section-stack compact-controls">
        <details className="compact-details" open>
          <summary>Date range</summary>
          <DateRangePicker
            filters={filters}
            onChange={(next) => {
              setActivePreset('custom');
              setFilters(next);
            }}
            activePreset={activePreset}
            onPresetChange={(preset) => {
              setActivePreset(preset);
              setFilters(buildPresetDateRange(preset));
            }}
            showPresets
          />
        </details>
      </section>

      {/* Module cards */}
      <section className="dashboard-grid">
        {enabledModules.includes('sugar') && (
          <ValueModuleCard
            mod="sugar"
            readings={readings}
            tags={tags}
            filters={filters}
            colorInside={settings.chartColorInside}
            colorOutside={settings.chartColorOutside}
            colorNeutral={settings.chartColorNeutral}
          />
        )}
        {enabledModules.includes('weight') && (
          <ValueModuleCard
            mod="weight"
            readings={weightReadings}
            tags={weightTags}
            filters={filters}
            colorInside={settings.weightChartColorInside}
            colorOutside={settings.weightChartColorOutside}
            colorNeutral={settings.weightChartColorNeutral}
          />
        )}
        {enabledModules.includes('height') && (
          <ValueModuleCard
            mod="height"
            readings={heightReadings}
            tags={heightTags}
            filters={filters}
            colorInside={settings.heightChartColorInside}
            colorOutside={settings.heightChartColorOutside}
            colorNeutral={settings.heightChartColorNeutral}
          />
        )}
        {enabledModules.includes('bp') && (
          <BpModuleCard
            readings={bpReadings}
            tags={bpTags}
            filters={filters}
            colorSystolic={settings.bpChartColorSystolic}
            colorDiastolic={settings.bpChartColorDiastolic}
            colorNeutral={settings.bpChartColorNeutral}
          />
        )}
      </section>
    </SiteShell>
  );
}
