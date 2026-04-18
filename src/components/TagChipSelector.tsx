import { Link } from 'react-router-dom';
import { sortTags } from '../lib/readingUtils';
import type { AppSettings, BpTagDefinition, TagDefinition } from '../lib/types';

type BaseReading = { readingDateTimeIso: string; tagIds: string[] };

type TagChipSelectorProps = {
  tags: (TagDefinition | BpTagDefinition)[];
  readings: BaseReading[];
  settings: AppSettings;
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  manageLinkTo?: string;
  manageLinkLabel?: string;
};

export function TagChipSelector({
  tags,
  readings,
  settings,
  selectedTagIds,
  onChange,
  manageLinkTo,
  manageLinkLabel = 'Manage tags'
}: TagChipSelectorProps) {
  const orderedTags = sortTags(tags, settings, readings);

  return (
    <div className="tag-chip-selector" role="group" aria-label="Tags">
      <div className="tag-chip-selector__chips">
        {orderedTags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              className={isSelected ? 'chip-pill selected' : 'chip-pill'}
              onClick={() => {
                if (isSelected) {
                  onChange(selectedTagIds.filter((v) => v !== tag.id));
                } else {
                  onChange([...selectedTagIds, tag.id]);
                }
              }}
              aria-pressed={isSelected}
            >
              <span className="chip-pill__hash">#</span>
              <span className="chip-pill__label">{tag.label.toUpperCase()}</span>
              <span className="chip-pill__heart">{isSelected ? '♥' : '♡'}</span>
            </button>
          );
        })}
      </div>
      {manageLinkTo ? (
        <Link to={manageLinkTo} className="text-link-button chip-manage-link">
          {manageLinkLabel}
        </Link>
      ) : null}
    </div>
  );
}
