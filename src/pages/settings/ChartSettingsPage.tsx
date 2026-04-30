import { SiteShell } from '../../components/SiteShell';
import { useAppData } from '../../context/AppDataContext';
import type { ChartPreset } from '../../lib/types';

export function ChartSettingsPage() {
  const { settings, updateSettings } = useAppData();

  return (
    <SiteShell
      title="Chart Settings"
      subtitle="Choose the default chart date preset and per-module chart colors."
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
        <div className="section-header-inline"><div><h2>Sugar chart colors</h2><p>Colors for sugar chart points and range badges.</p></div></div>
        <div className="three-column-grid">
          <label className="date-time-picker__field color-field"><span>Inside range</span><input type="color" value={settings.chartColorInside} onChange={(e) => updateSettings({ chartColorInside: e.target.value })} /></label>
          <label className="date-time-picker__field color-field"><span>Outside range</span><input type="color" value={settings.chartColorOutside} onChange={(e) => updateSettings({ chartColorOutside: e.target.value })} /></label>
          <label className="date-time-picker__field color-field"><span>Neutral</span><input type="color" value={settings.chartColorNeutral} onChange={(e) => updateSettings({ chartColorNeutral: e.target.value })} /></label>
        </div>
      </section>

      <section className="doc-card section-stack">
        <div className="section-header-inline"><div><h2>Weight chart colors</h2></div></div>
        <div className="three-column-grid">
          <label className="date-time-picker__field color-field"><span>Inside range</span><input type="color" value={settings.weightChartColorInside} onChange={(e) => updateSettings({ weightChartColorInside: e.target.value })} /></label>
          <label className="date-time-picker__field color-field"><span>Outside range</span><input type="color" value={settings.weightChartColorOutside} onChange={(e) => updateSettings({ weightChartColorOutside: e.target.value })} /></label>
          <label className="date-time-picker__field color-field"><span>Neutral</span><input type="color" value={settings.weightChartColorNeutral} onChange={(e) => updateSettings({ weightChartColorNeutral: e.target.value })} /></label>
        </div>
      </section>

      <section className="doc-card section-stack">
        <div className="section-header-inline"><div><h2>Height chart colors</h2></div></div>
        <div className="three-column-grid">
          <label className="date-time-picker__field color-field"><span>Inside range</span><input type="color" value={settings.heightChartColorInside} onChange={(e) => updateSettings({ heightChartColorInside: e.target.value })} /></label>
          <label className="date-time-picker__field color-field"><span>Outside range</span><input type="color" value={settings.heightChartColorOutside} onChange={(e) => updateSettings({ heightChartColorOutside: e.target.value })} /></label>
          <label className="date-time-picker__field color-field"><span>Neutral</span><input type="color" value={settings.heightChartColorNeutral} onChange={(e) => updateSettings({ heightChartColorNeutral: e.target.value })} /></label>
        </div>
      </section>

      <section className="doc-card section-stack">
        <div className="section-header-inline"><div><h2>Blood pressure chart colors</h2><p>Systolic and diastolic lines use separate colors.</p></div></div>
        <div className="three-column-grid">
          <label className="date-time-picker__field color-field"><span>Systolic line</span><input type="color" value={settings.bpChartColorSystolic} onChange={(e) => updateSettings({ bpChartColorSystolic: e.target.value })} /></label>
          <label className="date-time-picker__field color-field"><span>Diastolic line</span><input type="color" value={settings.bpChartColorDiastolic} onChange={(e) => updateSettings({ bpChartColorDiastolic: e.target.value })} /></label>
          <label className="date-time-picker__field color-field"><span>Neutral</span><input type="color" value={settings.bpChartColorNeutral} onChange={(e) => updateSettings({ bpChartColorNeutral: e.target.value })} /></label>
        </div>
      </section>

      <section className="doc-card section-stack">
        <div className="section-header-inline"><div><h2>Food chart colors</h2><p>Used for calorie trend points and food list range badges.</p></div></div>
        <div className="three-column-grid">
          <label className="date-time-picker__field color-field"><span>Inside range</span><input type="color" value={settings.foodChartColorInside} onChange={(e) => updateSettings({ foodChartColorInside: e.target.value })} /></label>
          <label className="date-time-picker__field color-field"><span>Outside range</span><input type="color" value={settings.foodChartColorOutside} onChange={(e) => updateSettings({ foodChartColorOutside: e.target.value })} /></label>
          <label className="date-time-picker__field color-field"><span>Neutral</span><input type="color" value={settings.foodChartColorNeutral} onChange={(e) => updateSettings({ foodChartColorNeutral: e.target.value })} /></label>
        </div>
      </section>
    </SiteShell>
  );
}