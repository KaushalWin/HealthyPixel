import { Link } from 'react-router-dom';
import { useState } from 'react';
import { DateTimePicker } from '../DateTimePicker';
import { WeightTagGroupSelector } from './WeightTagGroupSelector';
import type { AppSettings, ReadingDraft, WeightReading, WeightTagDefinition } from '../../lib/types';

type WeightReadingFormProps = {
  title: string;
  submitLabel: string;
  initialValue: ReadingDraft;
  tags: WeightTagDefinition[];
  readings: WeightReading[];
  settings: AppSettings;
  onSubmit: (draft: ReadingDraft) => void;
  listPath: string;
};

export function WeightReadingForm({
  title,
  submitLabel,
  initialValue,
  tags,
  readings,
  settings,
  onSubmit,
  listPath
}: WeightReadingFormProps) {
  const [draft, setDraft] = useState<ReadingDraft>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (Number.isNaN(draft.value)) {
      setError('Weight value is required.');
      return;
    }
    if (draft.value < 0 || draft.value > 700) {
      setError('Weight must stay between 0 and 700 kg.');
      return;
    }
    setError(null);
    onSubmit(draft);
  };

  return (
    <section className="form-card" aria-labelledby="weight-form-title">
      <div className="section-header-inline">
        <div>
          <h2 id="weight-form-title">{title}</h2>
          <p>Enter weight in kg, then save.</p>
        </div>
      </div>

      <label className="date-time-picker__field">
        <span>Weight (kg) *</span>
        <input
          type="number"
          step="0.1"
          min="0"
          max="700"
          autoFocus
          value={Number.isNaN(draft.value) ? '' : draft.value}
          onChange={(event) => {
            const value = event.target.value;
            setDraft((current) => ({ ...current, value: value === '' ? Number.NaN : Number(value) }));
          }}
          placeholder="Enter weight"
        />
      </label>

      <WeightTagGroupSelector
        tags={tags}
        readings={readings}
        settings={settings}
        selectedTagIds={draft.tagIds}
        onChange={(tagIds) => setDraft((current) => ({ ...current, tagIds }))}
        label="Tags"
        helperText="Pick grouped tags when they add context. Leaving tags empty is allowed."
        manageLinkTo="/settings/tags"
        manageLinkLabel="Manage tags"
      />

      {error ? <p className="field-error">{error}</p> : null}

      <div className="action-row">
        <button type="button" className="primary-button" onClick={handleSubmit}>
          {submitLabel}
        </button>
        <Link to={listPath} className="secondary-button">
          Open Weight List
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
