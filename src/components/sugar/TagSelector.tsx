import { Link } from 'react-router-dom';
import type { ChangeEvent } from 'react';
import { sortTags } from '../../lib/readingUtils';
import type { AppSettings, SugarReading, TagDefinition } from '../../lib/types';

type TagSelectorProps = {
  tags: TagDefinition[];
  readings: SugarReading[];
  settings: AppSettings;
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  label?: string;
  helperText?: string;
  manageLinkTo?: string;
  manageLinkLabel?: string;
  mode?: 'dropdown' | 'chips';
};

export function TagSelector({
  tags,
  readings,
  settings,
  selectedTagIds,
  onChange,
  label = 'Tags',
  helperText,
  manageLinkTo,
  manageLinkLabel = 'Manage tags in Settings',
  mode = 'dropdown'
}: TagSelectorProps) {
  const orderedTags = sortTags(tags, settings, readings);
  const selectedLabels = orderedTags
    .filter((tag) => selectedTagIds.includes(tag.id))
    .map((tag) => tag.label);

  const updateSelectionFromSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextTagIds = Array.from(event.target.selectedOptions, (option) => option.value);
    onChange(nextTagIds);
  };

  return (
    <section className="tag-selector" aria-label={label}>
      <div className="section-header-inline">
        <div>
          <h3>{label}</h3>
          {helperText ? <p>{helperText}</p> : null}
        </div>
        {manageLinkTo ? (
          <Link to={manageLinkTo} className="text-link-button">
            {manageLinkLabel}
          </Link>
        ) : null}
      </div>

      {mode === 'chips' ? (
        <div className="tag-chip-grid">
          {orderedTags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                className={isSelected ? 'tag-chip active' : 'tag-chip'}
                onClick={() => {
                  if (isSelected) {
                    onChange(selectedTagIds.filter((value) => value !== tag.id));
                    return;
                  }

                  onChange([...selectedTagIds, tag.id]);
                }}
              >
                <span>{tag.label}</span>
                {tag.rangeMin !== null || tag.rangeMax !== null ? (
                  <small>
                    {tag.rangeMin ?? '-'} to {tag.rangeMax ?? '-'}
                  </small>
                ) : (
                  <small>No range</small>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="tag-selector__compact-controls">
          <label className="date-time-picker__field">
            <span>Select one or more tags</span>
            <select
              className="form-select tag-multi-select"
              multiple
              value={selectedTagIds}
              onChange={updateSelectionFromSelect}
            >
              {orderedTags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.label}
                  {tag.rangeMin !== null || tag.rangeMax !== null
                    ? ` (${tag.rangeMin ?? '-'} to ${tag.rangeMax ?? '-'})`
                    : ' (No range)'}
                </option>
              ))}
            </select>
          </label>
          <p className="tag-selector__selected-summary">
            {selectedLabels.length === 0
              ? 'No tags selected.'
              : `${selectedLabels.length} selected: ${selectedLabels.join(', ')}`}
          </p>
        </div>
      )}
    </section>
  );
}