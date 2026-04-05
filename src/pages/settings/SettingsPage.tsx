import { Link } from 'react-router-dom';
import { SiteShell } from '../../components/SiteShell';
import { useAppData } from '../../context/AppDataContext';

export function SettingsPage() {
  const { resetAllData, settings, tags } = useAppData();

  return (
    <SiteShell
      title="Settings"
      subtitle="Manage tags, chart defaults, colors, and local reset actions from one place."
    >
      <section className="doc-grid settings-grid">
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
            <li>{tags.length} tags stored locally</li>
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