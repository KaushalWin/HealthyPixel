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
import { SiteShell } from '../components/SiteShell';
import { FoodFilterPanel } from '../components/food/FoodFilterPanel';
import { FoodReadingList } from '../components/food/FoodReadingList';
import { useAppData } from '../context/AppDataContext';
import {
  applyFoodReadingFilters,
  buildFoodCategoryBreakdown,
  buildFoodMetrics,
  buildFoodTagBreakdown,
  classifyFoodReading,
  createFoodReadingFilters
} from '../lib/foodUtils';
import { buildPresetDateRange, sortReadingsAscending, sortReadingsDescending } from '../lib/readingUtils';
import type { ChartPreset } from '../lib/types';

const chartDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short'
});

const tooltipFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  hour12: false
});

const FOOD_CATEGORY_CHART_COLORS = {
  planned: '#2364aa',
  actual: '#d35400',
  context: '#14804f',
  behavior: '#8c2f39'
} as const;

type TrendDatum = {
  id: string;
  label: string;
  calories: number;
  mealName: string;
  dateTime: string;
  color: string;
};

export function FoodChartPage() {
  const { foodReadings, foodTags, settings } = useAppData();
  const [activePreset, setActivePreset] = useState<ChartPreset | 'custom'>(settings.defaultChartPreset);
  const [filters, setFilters] = useState(() =>
    createFoodReadingFilters(buildPresetDateRange(settings.defaultChartPreset))
  );

  const hasInvalidRange =
    filters.startDate !== '' && filters.endDate !== '' && filters.startDate > filters.endDate;

  const tagsById = useMemo(() => new Map(foodTags.map((tag) => [tag.id, tag])), [foodTags]);

  const filteredReadings = useMemo(() => {
    if (hasInvalidRange) {
      return [];
    }

    return applyFoodReadingFilters(foodReadings, filters, tagsById);
  }, [filters, foodReadings, hasInvalidRange, tagsById]);

  const statusColors = {
    inside: settings.foodChartColorInside,
    outside: settings.foodChartColorOutside,
    neutral: settings.foodChartColorNeutral
  };

  const trendData = useMemo<TrendDatum[]>(() => {
    return sortReadingsAscending(filteredReadings).map((reading) => {
      const readingTags = reading.tagIds
        .map((tagId) => tagsById.get(tagId))
        .filter(Boolean) as typeof foodTags;
      const status = classifyFoodReading(reading, readingTags).status;
      const color =
        status === 'inside'
          ? statusColors.inside
          : status === 'outside'
            ? statusColors.outside
            : statusColors.neutral;

      return {
        id: reading.id,
        label: chartDateFormatter.format(new Date(reading.readingDateTimeIso)),
        calories: reading.calories,
        mealName: reading.mealName,
        dateTime: reading.readingDateTimeIso,
        color
      };
    });
  }, [filteredReadings, statusColors.inside, statusColors.neutral, statusColors.outside, tagsById]);

  const metrics = useMemo(() => buildFoodMetrics(filteredReadings, tagsById), [filteredReadings, tagsById]);

  const tagBreakdown = useMemo(
    () => buildFoodTagBreakdown(filteredReadings, tagsById, filters.categories).slice(0, 8),
    [filteredReadings, filters.categories, tagsById]
  );

  const categoryBreakdown = useMemo(
    () => buildFoodCategoryBreakdown(filteredReadings, tagsById),
    [filteredReadings, tagsById]
  );

  return (
    <SiteShell title="Food Insights" subtitle="Calories over time, top matched tags, and category-aware meal patterns.">
      <section className="doc-card chart-card" aria-label="Food calorie trend chart">
        <div className="section-header-inline">
          <div>
            <h2>Calorie trend</h2>
            <p>Each point uses range-aware coloring based on the selected meal tags.</p>
          </div>
        </div>

        {trendData.length === 0 ? (
          <div className="empty-state">
            <p>{hasInvalidRange ? 'Fix the date range to view the chart.' : 'No food entries match the chart filters yet.'}</p>
          </div>
        ) : (
          <div className="chart-shell">
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={trendData}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" stroke="var(--ink-soft)" />
                <YAxis stroke="var(--ink-soft)" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) {
                      return null;
                    }

                    const point = payload[0]?.payload as TrendDatum;
                    return (
                      <div className="chart-tooltip">
                        <p>{tooltipFormatter.format(new Date(point.dateTime))}</p>
                        <strong>{point.mealName}</strong>
                        <p>{point.calories} cal</p>
                      </div>
                    );
                  }}
                />
                <Area
                  type="linear"
                  dataKey="calories"
                  fill={statusColors.neutral}
                  fillOpacity={0.18}
                  stroke="none"
                />
                <Line
                  type="linear"
                  dataKey="calories"
                  stroke={statusColors.neutral}
                  strokeWidth={3}
                  dot={(props) => {
                    const payload = props.payload as TrendDatum;
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
            <p>Within range</p>
            <strong>{metrics.insidePercent}%</strong>
            <span>{metrics.insideCount} meals</span>
          </article>
          <article className="metric-card caution">
            <p>Outside range</p>
            <strong>{metrics.outsidePercent}%</strong>
            <span>{metrics.outsideCount} meals</span>
          </article>
          <article className="metric-card neutral">
            <p>Average calories</p>
            <strong>{metrics.averageCalories}</strong>
            <span>{metrics.totalCalories} cal total</span>
          </article>
          <article className="metric-card">
            <p>Low / high</p>
            <strong>
              {metrics.lowestCalories ?? '-'} / {metrics.highestCalories ?? '-'}
            </strong>
            <span>Calories within the selected filters</span>
          </article>
        </div>
      </section>

      <section className="doc-card chart-card" aria-label="Food tag breakdown chart">
        <div className="section-header-inline">
          <div>
            <h2>Top matching tags</h2>
            <p>The breakdown below helps spot which meal patterns show up most often after your filters are applied.</p>
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
                        <p>{point.count} meals</p>
                        <p>{point.averageCalories} cal avg</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {tagBreakdown.map((entry) => (
                    <Cell key={entry.key} fill={FOOD_CATEGORY_CHART_COLORS[entry.category]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="metrics-grid">
          {categoryBreakdown.map((item) => (
            <article key={item.key} className="metric-card food-category-card">
              <p>{item.label}</p>
              <strong>{item.count}</strong>
              <span>{item.averageCalories} cal avg</span>
            </article>
          ))}
        </div>
      </section>

      <section className="doc-card section-stack compact-controls">
        <details className="compact-details">
          <summary>Chart filters</summary>

          <FoodFilterPanel
            filters={filters}
            onChange={(nextFilters) => {
              setActivePreset('custom');
              setFilters(nextFilters);
            }}
            tags={foodTags}
            readings={foodReadings}
            settings={settings}
            activePreset={activePreset}
            onPresetChange={(preset) => {
              const nextRange = buildPresetDateRange(preset);
              setActivePreset(preset);
              setFilters((current) => ({
                ...current,
                startDate: nextRange.startDate,
                endDate: nextRange.endDate
              }));
            }}
            showPresets
            errorMessage={hasInvalidRange ? 'Start date cannot be after end date.' : null}
            manageLinkTo="/settings/tags"
          />

          <div className="action-row compact">
            <button
              type="button"
              className="secondary-button small"
              onClick={() => {
                setActivePreset(settings.defaultChartPreset);
                setFilters(createFoodReadingFilters(buildPresetDateRange(settings.defaultChartPreset)));
              }}
            >
              Reset chart filters
            </button>
          </div>
        </details>
      </section>

      <FoodReadingList
        title="Meals in this chart"
        readings={sortReadingsDescending(filteredReadings)}
        tagsById={tagsById}
        emptyMessage="No food entries are available for the chart filters."
        colors={statusColors}
      />
    </SiteShell>
  );
}