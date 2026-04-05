import { useState } from 'react';
import { SiteShell } from '../../components/SiteShell';
import { useAppData } from '../../context/AppDataContext';
import { sortTags } from '../../lib/readingUtils';
import type { TagSortMode } from '../../lib/types';

function parseNullableNumber(value: string) {
  if (value.trim() === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function TagManagementPage() {
  const { addTag, readings, removeTag, settings, tags, updateSettings, updateTag } = useAppData();
  const [newLabel, setNewLabel] = useState('');
  const [rangeMin, setRangeMin] = useState('');
  const [rangeMax, setRangeMax] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const orderedTags = sortTags(tags, settings, readings);

  return (
    <SiteShell
      title="Tag Settings"
      subtitle="Control tag order, ranges, removal, and custom-tag creation from one screen."
    >
      <section className="doc-card section-stack">
        <div className="section-header-inline">
          <div>
            <h2>Selector ordering</h2>
            <p>Tag ordering affects the reading form, list filters, and chart filters.</p>
          </div>
        </div>

        <label className="date-time-picker__field">
          <span>Sort tags by</span>
          <select
            className="form-select"
            value={settings.tagSortMode}
            onChange={(event) =>
              updateSettings({ tagSortMode: event.target.value as TagSortMode })
            }
          >
            <option value="recentlyUsed">Recently used</option>
            <option value="popular">Popular</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="creationDate">Creation date</option>
          </select>
        </label>

        <label className="date-time-picker__field">
          <span>Popular timeframe in days</span>
          <input
            type="number"
            min="1"
            max="365"
            value={settings.popularWindowDays}
            onChange={(event) => updateSettings({ popularWindowDays: Number(event.target.value) || 14 })}
          />
        </label>
      </section>

      <section className="doc-card section-stack">
        <div className="section-header-inline">
          <div>
            <h2>Add custom tag</h2>
            <p>Create a custom label and optional healthy range.</p>
          </div>
        </div>

        <div className="three-column-grid">
          <label className="date-time-picker__field">
            <span>Label</span>
            <input value={newLabel} onChange={(event) => setNewLabel(event.target.value)} />
          </label>
          <label className="date-time-picker__field">
            <span>Range min</span>
            <input type="number" value={rangeMin} onChange={(event) => setRangeMin(event.target.value)} />
          </label>
          <label className="date-time-picker__field">
            <span>Range max</span>
            <input type="number" value={rangeMax} onChange={(event) => setRangeMax(event.target.value)} />
          </label>
        </div>

        <div className="action-row compact">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              const trimmedLabel = newLabel.trim();
              const nextMin = parseNullableNumber(rangeMin);
              const nextMax = parseNullableNumber(rangeMax);

              if (!trimmedLabel) {
                setFormError('Custom tag label is required.');
                return;
              }

              if (
                tags.some((tag) => tag.label.toLowerCase() === trimmedLabel.toLowerCase())
              ) {
                setFormError('Tag labels must be unique.');
                return;
              }

              if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
                setFormError('Range min cannot be greater than range max.');
                return;
              }

              setFormError(null);
              addTag(trimmedLabel, nextMin, nextMax);
              setNewLabel('');
              setRangeMin('');
              setRangeMax('');
            }}
          >
            Add tag
          </button>
        </div>

        {formError ? <p className="field-error">{formError}</p> : null}
      </section>

      <section className="doc-card section-stack">
        <div className="section-header-inline">
          <div>
            <h2>Edit existing tags</h2>
            <p>Built-in tags can be removed. Custom tags can be renamed and re-ranged.</p>
          </div>
        </div>

        <div className="settings-list-grid">
          {orderedTags.map((tag) => (
            <article key={tag.id} className="settings-list-item">
              <div className="three-column-grid align-end">
                {tag.type === 'custom' ? (
                  <label className="date-time-picker__field">
                    <span>Label</span>
                    <input
                      value={tag.label}
                      onChange={(event) => updateTag(tag.id, { label: event.target.value })}
                    />
                  </label>
                ) : (
                  <div className="tag-static-field">
                    <span>Built-in label</span>
                    <strong>{tag.label}</strong>
                  </div>
                )}

                <label className="date-time-picker__field">
                  <span>Range min</span>
                  <input
                    type="number"
                    value={tag.rangeMin ?? ''}
                    onChange={(event) => {
                      const nextMin = parseNullableNumber(event.target.value);
                      const resolvedMax =
                        tag.rangeMax !== null && nextMin !== null && nextMin > tag.rangeMax
                          ? nextMin
                          : tag.rangeMax;

                      updateTag(tag.id, {
                        rangeMin: nextMin,
                        rangeMax: resolvedMax
                      });
                    }}
                  />
                </label>

                <label className="date-time-picker__field">
                  <span>Range max</span>
                  <input
                    type="number"
                    value={tag.rangeMax ?? ''}
                    onChange={(event) =>
                      updateTag(tag.id, {
                        rangeMax: parseNullableNumber(event.target.value)
                      })
                    }
                  />
                </label>
              </div>

              <div className="action-row compact">
                <button
                  type="button"
                  className="secondary-button danger small"
                  onClick={() => removeTag(tag.id)}
                >
                  Remove tag
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}