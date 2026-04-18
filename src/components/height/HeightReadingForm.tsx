import { Link } from 'react-router-dom';
import { useState } from 'react';
import { DateTimePicker } from '../DateTimePicker';
import { TagChipSelector } from '../TagChipSelector';
import type { AppSettings, HeightReading, ReadingDraft, TagDefinition } from '../../lib/types';

type HeightReadingFormProps = {
  title: string;
  submitLabel: string;
  initialValue: ReadingDraft;
  tags: TagDefinition[];
  readings: HeightReading[];
  settings: AppSettings;
  onSubmit: (draft: ReadingDraft) => void;
  listPath: string;
};

export function HeightReadingForm({
  title,
  submitLabel,
  initialValue,
  tags,
  readings,
  settings,
  onSubmit,
  listPath
}: HeightReadingFormProps) {
  const [draft, setDraft] = useState<ReadingDraft>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (Number.isNaN(draft.value)) {
      setError('Height value is required.');
      return;
    }
    if (draft.value < 0 || draft.value > 300) {
      setError('Height must stay between 0 and 300 cm.');
      return;
    }
    setError(null);
    onSubmit(draft);
  };

  return (
    <section className="form-card" aria-labelledby="height-form-title">
      <div className="section-header-inline">
        <div>
          <h2 id="height-form-title">{title}</h2>
          <p>Enter height in cm, then save.</p>
        </div>
      </div>

      <label className="date-time-picker__field">
        <span>Height (cm) *</span>
        <input
          type="number"
          step="0.1"
          min="0"
          max="300"
          autoFocus
          value={Number.isNaN(draft.value) ? '' : draft.value}
          onChange={(event) => {
            const value = event.target.value;
            setDraft((current) => ({ ...current, value: value === '' ? Number.NaN : Number(value) }));
          }}
          placeholder="Enter height"
        />
      </label>

      <TagChipSelector
        tags={tags}
        readings={readings}
        settings={settings}
        selectedTagIds={draft.tagIds}
        onChange={(tagIds) => setDraft((current) => ({ ...current, tagIds }))}
        manageLinkTo="/settings/tags"
        manageLinkLabel="Manage tags"
      />

      {error ? <p className="field-error">{error}</p> : null}

      <div className="action-row">
        <button type="button" className="primary-button" onClick={handleSubmit}>
          {submitLabel}
        </button>
        <Link to={listPath} className="secondary-button">
          Open Height List
        </Link>
      </div>

      <details className="compact-details">
        <summary>More options (time, note)</summary>
        <DateTimePicker
          label="Reading date and time"
          description="Defaults to now. Use reset when needed."
          value={new Date(draft.readingDateTimeIso)}
          onChange={(value) => setDraft((current) => ({ ...current, readingDateTimeIso: value.toISOString() }))}
          compact
          showSummary={false}
        />
        <label className="date-time-picker__field">
          <span>Note</span>
          <textarea
            className="form-textarea"
            value={draft.note ?? ''}
            onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
            placeholder="Optional note"
            rows={2}
          />
        </label>
      </details>
    </section>
  );
}
