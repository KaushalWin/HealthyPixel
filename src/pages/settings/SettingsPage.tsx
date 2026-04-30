import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteShell } from '../../components/SiteShell';
import { useAppData } from '../../context/AppDataContext';
import { AppDataImportError, buildAppDataExportFileName, parseAppDataImportJson, serializeAppDataExport } from '../../lib/dataPortability';
import type { VitalModule } from '../../lib/types';

const MODULE_LABELS: { key: VitalModule; label: string }[] = [
  { key: 'sugar', label: 'Sugar' },
  { key: 'weight', label: 'Weight' },
  { key: 'height', label: 'Height' },
  { key: 'bp', label: 'Blood Pressure' },
  { key: 'food', label: 'Food' }
];

function readFileAsText(file: Blob & { text?: () => Promise<string> }) {
  if (typeof file.text === 'function') {
    return file.text();
  }

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Import file could not be read as text.'));
    };
    reader.onerror = () => reject(reader.error ?? new Error('Import file could not be read.'));
    reader.readAsText(file);
  });
}

export function SettingsPage() {
  const {
    bpReadings,
    bpTags,
    exportAppData,
    foodReadings,
    foodTags,
    heightReadings,
    heightTags,
    readings,
    replaceAllAppData,
    resetAllData,
    settings,
    tags,
    updateSettings,
    weightReadings,
    weightTags
  } = useAppData();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [portabilityMessage, setPortabilityMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

  const toggleModule = (mod: VitalModule) => {
    const current = settings.dashboardModules;
    const next = current.includes(mod) ? current.filter((m) => m !== mod) : [...current, mod];
    updateSettings({ dashboardModules: next });
  };

  const handleExport = () => {
    const exportedAt = new Date();
    const payload = serializeAppDataExport(exportAppData(), exportedAt);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = buildAppDataExportFileName(exportedAt);
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 0);

    setPortabilityMessage({ tone: 'success', text: 'Exported the current app data as JSON. Saved AI keys were not included.' });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      const parsedData = parseAppDataImportJson(await readFileAsText(file));
      const shouldReplace = window.confirm(
        'Import this JSON file and replace all current local readings, tags, and settings? Saved AI keys in this browser will stay untouched.'
      );
      if (!shouldReplace) {
        setPortabilityMessage({ tone: 'success', text: 'Import cancelled. Your current local data was left unchanged.' });
        return;
      }

      replaceAllAppData(parsedData);
      setPortabilityMessage({ tone: 'success', text: `Imported ${file.name} and replaced the current local app data.` });
    } catch (error) {
      const text = error instanceof AppDataImportError ? error.message : 'Import failed. Please try another JSON export file.';
      setPortabilityMessage({ tone: 'error', text });
    }
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
            <li><strong>Food:</strong> {foodReadings.length} meals, {foodTags.length} tags</li>
            <li>{settings.popularWindowDays}-day popular tag window</li>
          </ul>
        </article>

        <article className="doc-card settings-card">
          <h2>Export and import</h2>
          <p>Download a full JSON backup or replace the current local app data from a previous PixieTrack export.</p>
          <p className="settings-portability__note">Saved AI provider keys are never included in exported files and are not changed by import.</p>
          <div className="action-row">
            <button type="button" className="primary-button" onClick={handleExport}>
              Export JSON
            </button>
            <button type="button" className="secondary-button" onClick={handleImportClick}>
              Import JSON
            </button>
          </div>
          <input
            ref={fileInputRef}
            className="settings-portability__file-input"
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
          />
          <p className="settings-portability__note">Import replaces current readings, tags, and settings on this device. It does not merge data.</p>
          {portabilityMessage ? (
            <p className={portabilityMessage.tone === 'error' ? 'field-error' : 'status-note success'}>
              {portabilityMessage.text}
            </p>
          ) : null}
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