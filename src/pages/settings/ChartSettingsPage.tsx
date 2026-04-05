import { SiteShell } from '../../components/SiteShell';
import { useAppData } from '../../context/AppDataContext';
import type { ChartPreset } from '../../lib/types';

export function ChartSettingsPage() {
  const { settings, updateSettings } = useAppData();

  return (
    <SiteShell
      title="Chart Settings"
      subtitle="Choose the default chart date preset and the inside, outside, and neutral chart colors."
    >
      <section className="doc-card section-stack">
        <label className="date-time-picker__field">
          <span>Default chart range</span>
          <select
            className="form-select"
            value={settings.defaultChartPreset}
            onChange={(event) =>
              updateSettings({ defaultChartPreset: event.target.value as ChartPreset })
            }
          >
            <option value="today">Today</option>
            <option value="lastWeek">Last week</option>
            <option value="lastMonth">Last month</option>
            <option value="thisMonth">This month</option>
            <option value="thisYear">This year</option>
          </select>
        </label>
      </section>

      <section className="doc-card section-stack">
        <div className="section-header-inline">
          <div>
            <h2>Chart colors</h2>
            <p>These colors are reused for chart points and range badges.</p>
          </div>
        </div>

        <div className="three-column-grid">
          <label className="date-time-picker__field color-field">
            <span>Inside range</span>
            <input
              type="color"
              value={settings.chartColorInside}
              onChange={(event) => updateSettings({ chartColorInside: event.target.value })}
            />
          </label>
          <label className="date-time-picker__field color-field">
            <span>Outside range</span>
            <input
              type="color"
              value={settings.chartColorOutside}
              onChange={(event) => updateSettings({ chartColorOutside: event.target.value })}
            />
          </label>
          <label className="date-time-picker__field color-field">
            <span>Neutral / no tag range</span>
            <input
              type="color"
              value={settings.chartColorNeutral}
              onChange={(event) => updateSettings({ chartColorNeutral: event.target.value })}
            />
          </label>
        </div>
      </section>
    </SiteShell>
  );
}