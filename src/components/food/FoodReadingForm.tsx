import { Link } from 'react-router-dom';
import { useState } from 'react';
import { DateTimePicker } from '../DateTimePicker';
import { FoodTagGroupSelector } from './FoodTagGroupSelector';
import { getInlineTextValidationError } from '../../lib/textValidation';
import type { AppSettings, FoodReading, FoodReadingDraft, FoodTagDefinition } from '../../lib/types';

type FoodReadingFormProps = {
  title: string;
  submitLabel: string;
  initialValue: FoodReadingDraft;
  tags: FoodTagDefinition[];
  readings: FoodReading[];
  settings: AppSettings;
  onSubmit: (draft: FoodReadingDraft) => void;
  listPath: string;
};

export function FoodReadingForm({
  title,
  submitLabel,
  initialValue,
  tags,
  readings,
  settings,
  onSubmit,
  listPath
}: FoodReadingFormProps) {
  const [draft, setDraft] = useState<FoodReadingDraft>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const mealNameError = getInlineTextValidationError(draft.mealName, 'Meal name');
    if (mealNameError) {
      setError(mealNameError);
      return;
    }

    if (Number.isNaN(draft.calories)) {
      setError('Calories are required.');
      return;
    }

    if (draft.calories < 0 || draft.calories > 5000) {
      setError('Calories must stay between 0 and 5000.');
      return;
    }

    setError(null);
    onSubmit(draft);
  };

  return (
    <section className="form-card" aria-labelledby="food-form-title">
      <div className="section-header-inline">
        <div>
          <h2 id="food-form-title">{title}</h2>
          <p>Log the meal first, then add tags for plan, actual outcome, context, and behavior.</p>
        </div>
      </div>

      <div className="two-column-grid">
        <label className="date-time-picker__field">
          <span>Meal name *</span>
          <input
            value={draft.mealName}
            onChange={(event) =>
              setDraft((current) => ({ ...current, mealName: event.target.value }))
            }
            placeholder="Paneer Roti"
            autoFocus
          />
        </label>

        <label className="date-time-picker__field">
          <span>Calories *</span>
          <input
            type="number"
            min="0"
            max="5000"
            step="1"
            value={Number.isNaN(draft.calories) ? '' : draft.calories}
            onChange={(event) => {
              const value = event.target.value;
              setDraft((current) => ({
                ...current,
                calories: value === '' ? Number.NaN : Number(value)
              }));
            }}
            placeholder="650"
            inputMode="numeric"
          />
        </label>
      </div>

      <FoodTagGroupSelector
        tags={tags}
        readings={readings}
        settings={settings}
        selectedTagIds={draft.tagIds}
        onChange={(tagIds) => setDraft((current) => ({ ...current, tagIds }))}
        manageLinkTo="/settings/tags"
      />

      {error ? <p className="field-error">{error}</p> : null}

      <div className="action-row">
        <button type="button" className="primary-button" onClick={handleSubmit}>
          {submitLabel}
        </button>
        <Link to={listPath} className="secondary-button">
          Open Food List
        </Link>
      </div>

      <details className="compact-details">
        <summary>More options (time, note)</summary>
        <DateTimePicker
          label="Meal date and time"
          description="Defaults to now. Use reset when needed."
          value={new Date(draft.readingDateTimeIso)}
          onChange={(value) =>
            setDraft((current) => ({ ...current, readingDateTimeIso: value.toISOString() }))
          }
          compact
          showSummary={false}
        />

        <label className="date-time-picker__field">
          <span>Note</span>
          <textarea
            className="form-textarea"
            value={draft.note ?? ''}
            onChange={(event) =>
              setDraft((current) => ({ ...current, note: event.target.value }))
            }
            placeholder="Optional note about the meal or trigger"
            rows={2}
          />
        </label>
      </details>
    </section>
  );
}