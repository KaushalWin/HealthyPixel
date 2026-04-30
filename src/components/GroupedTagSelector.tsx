import { Link } from 'react-router-dom';
import { sortTags } from '../lib/readingUtils';
import { groupTagsByCategory } from '../lib/tagCategories';
import type { AppSettings, BpTagDefinition, TagDefinition } from '../lib/types';

type BaseReading = { readingDateTimeIso: string; tagIds: string[] };

type GroupedTagSelectorProps<TCategory extends string, TTag extends { id: string; label: string; category: TCategory }> = {
  tags: TTag[];
  readings: BaseReading[];
  settings: AppSettings;
  categoryOrder: readonly TCategory[];
  categoryLabels: Record<TCategory, string>;
  categoryDescriptions?: Partial<Record<TCategory, string>>;
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  label?: string;
  helperText?: string;
  manageLinkTo?: string;
  manageLinkLabel?: string;
  getTagMeta?: (tag: TTag) => string | null;
};

export function GroupedTagSelector<
  TCategory extends string,
  TTag extends (TagDefinition | BpTagDefinition) & { category: TCategory }
>({
  tags,
  readings,
  settings,
  categoryOrder,
  categoryLabels,
  categoryDescriptions,
  selectedTagIds,
  onChange,
  label = 'Tags',
  helperText,
  manageLinkTo,
  manageLinkLabel = 'Manage tags',
  getTagMeta
}: GroupedTagSelectorProps<TCategory, TTag>) {
  const groupedTags = groupTagsByCategory(tags, categoryOrder);
  const selectedLabels = tags
    .filter((tag) => selectedTagIds.includes(tag.id))
    .map((tag) => `${categoryLabels[tag.category]}: ${tag.label}`);

  return (
    <section className="tag-selector food-tag-group-selector" aria-label={label}>
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

      <div className="food-tag-group-selector__groups">
        {categoryOrder.map((category) => {
          const categoryTags = sortTags(groupedTags[category], settings, readings);
          if (categoryTags.length === 0) {
            return null;
          }

          return (
            <section key={category} className="food-tag-group-selector__category">
              <div className="section-header-inline food-tag-group-selector__category-header">
                <div>
                  <h4>{categoryLabels[category]}</h4>
                  {categoryDescriptions?.[category] ? <p>{categoryDescriptions[category]}</p> : null}
                </div>
              </div>

              <div className="tag-chip-grid">
                {categoryTags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  const meta = getTagMeta?.(tag);

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
                      <small>{meta ?? categoryLabels[category]}</small>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <p className="tag-selector__selected-summary">
        {selectedLabels.length === 0
          ? 'No tags selected.'
          : `${selectedLabels.length} selected: ${selectedLabels.join(', ')}`}
      </p>
    </section>
  );
}