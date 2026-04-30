import { Link } from 'react-router-dom';
import { useState } from 'react';
import { DateTimePicker } from '../DateTimePicker';
import { BpTagGroupSelector } from './BpTagGroupSelector';
import type { AppSettings, BpDraft, BpReading, BpTagDefinition } from '../../lib/types';

type BpReadingFormProps = {
  title: string;
  submitLabel: string;
  initialValue: BpDraft;
  tags: BpTagDefinition[];
  readings: BpReading[];
  settings: AppSettings;
  onSubmit: (draft: BpDraft) => void;
  listPath: string;
};

export function BpReadingForm({
  title,
  submitLabel,
  initialValue,
  tags,
  readings,
  settings,
  onSubmit,
  listPath
}: BpReadingFormProps) {
  const [draft, setDraft] = useState<BpDraft>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (Number.isNaN(draft.systolic)) {
      setError('Systolic value is required.');
      return;
    }
    if (Number.isNaN(draft.diastolic)) {
      setError('Diastolic value is required.');
      return;
    }
    if (draft.systolic < 40 || draft.systolic > 300) {
      setError('Systolic must be between 40 and 300 mmHg.');
      return;
    }
    if (draft.diastolic < 20 || draft.diastolic > 200) {
      setError('Diastolic must be between 20 and 200 mmHg.');
      return;
    }
    if (draft.diastolic >= draft.systolic) {
      setError('Diastolic must be lower than systolic.');
      return;
    }
    setError(null);
    onSubmit(draft);
  };

  return (
    <section className="form-card" aria-labelledby="bp-form-title">
      <div className="section-header-inline">
        <div>
          <h2 id="bp-form-title">{title}</h2>
          <p>Enter systolic/diastolic in mmHg, then save.</p>
        </div>
      </div>

      <div className="bp-value-row">
        <label className="date-time-picker__field">
          <span>Systolic *</span>
          <input
            type="number"
            step="1"
            min="40"
            max="300"
            autoFocus
            value={Number.isNaN(draft.systolic) ? '' : draft.systolic}
            onChange={(event) => {
              const value = event.target.value;
              setDraft((current) => ({ ...current, systolic: value === '' ? Number.NaN : Number(value) }));
            }}
            placeholder="e.g. 120"
          />
        </label>
        <span className="bp-value-separator">/</span>
        <label className="date-time-picker__field">
          <span>Diastolic *</span>
          <input
            type="number"
            step="1"
            min="20"
            max="200"
            value={Number.isNaN(draft.diastolic) ? '' : draft.diastolic}
            onChange={(event) => {
              const value = event.target.value;
              setDraft((current) => ({ ...current, diastolic: value === '' ? Number.NaN : Number(value) }));
            }}
            placeholder="e.g. 80"
          />
        </label>
      </div>

      <BpTagGroupSelector
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
          Open BP List
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
