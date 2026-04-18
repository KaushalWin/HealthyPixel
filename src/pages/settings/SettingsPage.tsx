import { Link } from 'react-router-dom';
import { SiteShell } from '../../components/SiteShell';
import { useAppData } from '../../context/AppDataContext';
import type { VitalModule } from '../../lib/types';

const MODULE_LABELS: { key: VitalModule; label: string }[] = [
  { key: 'sugar', label: 'Sugar' },
  { key: 'weight', label: 'Weight' },
  { key: 'height', label: 'Height' },
  { key: 'bp', label: 'Blood Pressure' }
];

export function SettingsPage() {
  const { resetAllData, settings, updateSettings, tags, readings, weightReadings, weightTags, heightReadings, heightTags, bpReadings, bpTags } = useAppData();

  const toggleModule = (mod: VitalModule) => {
    const current = settings.dashboardModules;
    const next = current.includes(mod) ? current.filter((m) => m !== mod) : [...current, mod];
    updateSettings({ dashboardModules: next });
  };

  return (
    <SiteShell
      title="Settings"
      subtitle="Manage tags, chart defaults, colors, and local reset actions from one place."
    >
      <section className="doc-grid settings-grid">
        <article className="doc-card settings-card">
          <h2>Dashboard modules</h2>
          <p>Choose which vitals appear on the Analysis page.</p>
          <div className="dashboard-toggles">
            {MODULE_LABELS.map(({ key, label }) => (
              <label key={key} className="toggle-row">
                <input
                  type="checkbox"
                  checked={settings.dashboardModules.includes(key)}
                  onChange={() => toggleModule(key)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </article>

        <article className="doc-card settings-card">
          <h2>Tag management</h2>
          <p>Manage built-in and custom tags, ranges, and selector ordering.</p>
          <Link to="/settings/tags" className="primary-button inline-block">
            Open tag settings
          </Link>
        </article>

        <article className="doc-card settings-card">
          <h2>Chart defaults and colors</h2>
          <p>
            Default preset: <strong>{settings.defaultChartPreset}</strong>
          </p>
          <Link to="/settings/chart" className="primary-button inline-block">
            Open chart settings
          </Link>
        </article>

        <article className="doc-card settings-card">
          <h2>Current local data</h2>
          <ul>
            <li><strong>Sugar:</strong> {readings.length} readings, {tags.length} tags</li>
            <li><strong>Weight:</strong> {weightReadings.length} readings, {weightTags.length} tags</li>
            <li><strong>Height:</strong> {heightReadings.length} readings, {heightTags.length} tags</li>
            <li><strong>BP:</strong> {bpReadings.length} readings, {bpTags.length} tags</li>
            <li>{settings.popularWindowDays}-day popular tag window</li>
          </ul>
        </article>

        <article className="doc-card settings-card danger-zone">
          <h2>Danger zone</h2>
          <p>Delete all local data and restore default tags and settings.</p>
          <button
            type="button"
            className="secondary-button danger"
            onClick={() => {
              if (window.confirm('Delete all local readings, tags, and settings?')) {
                resetAllData();
              }
            }}
          >
            Delete all local data
          </button>
        </article>
      </section>
    </SiteShell>
  );
}