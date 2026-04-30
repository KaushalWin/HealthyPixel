import { Link } from 'react-router-dom';
import { useState } from 'react';
import { DateTimePicker } from '../DateTimePicker';
import { SugarTagGroupSelector } from './SugarTagGroupSelector';
import type { AppSettings, ReadingDraft, SugarReading, SugarTagDefinition } from '../../lib/types';

type SugarReadingFormProps = {
  title: string;
  submitLabel: string;
  initialValue: ReadingDraft;
  tags: SugarTagDefinition[];
  readings: SugarReading[];
  settings: AppSettings;
  onSubmit: (draft: ReadingDraft) => void;
};

export function SugarReadingForm({
  title,
  submitLabel,
  initialValue,
  tags,
  readings,
  settings,
  onSubmit
}: SugarReadingFormProps) {
  const [draft, setDraft] = useState<ReadingDraft>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (Number.isNaN(draft.value)) {
      setError('Reading value is required.');
      return;
    }

    if (draft.value < 0 || draft.value > 10000) {
      setError('Reading value must stay between 0 and 10000.');
      return;
    }

    setError(null);
    onSubmit(draft);
  };

  return (
    <section className="form-card" aria-labelledby="sugar-form-title">
      <div className="section-header-inline">
        <div>
          <h2 id="sugar-form-title">{title}</h2>
          <p>Start with the reading value, then save. Optional details are below.</p>
        </div>
      </div>

      <label className="date-time-picker__field">
        <span>Reading value *</span>
        <input
          type="number"
          step="0.1"
          min="0"
          max="10000"
          autoFocus
          value={Number.isNaN(draft.value) ? '' : draft.value}
          onChange={(event) => {
            const value = event.target.value;
            setDraft((current) => ({
              ...current,
              value: value === '' ? Number.NaN : Number(value)
            }));
          }}
          placeholder="Enter reading"
        />
      </label>

      <SugarTagGroupSelector
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
        <Link to="/sugar/list" className="secondary-button">
          Open Sugar List
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