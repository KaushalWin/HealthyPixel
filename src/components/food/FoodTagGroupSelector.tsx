import { Link } from 'react-router-dom';
import { FOOD_TAG_CATEGORY_LABELS, FOOD_TAG_CATEGORY_ORDER, groupFoodTagsByCategory } from '../../lib/foodUtils';
import { sortTags } from '../../lib/readingUtils';
import type { AppSettings, FoodReading, FoodTagDefinition } from '../../lib/types';

const CATEGORY_HELPER_TEXT: Record<FoodTagDefinition['category'], string> = {
  planned: 'What you hoped to eat.',
  actual: 'What the meal turned into.',
  context: 'When or where it happened.',
  behavior: 'What drove the eating pattern.'
};

type FoodTagGroupSelectorProps = {
  tags: FoodTagDefinition[];
  readings: FoodReading[];
  settings: AppSettings;
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  label?: string;
  helperText?: string;
  manageLinkTo?: string;
  manageLinkLabel?: string;
};

export function FoodTagGroupSelector({
  tags,
  readings,
  settings,
  selectedTagIds,
  onChange,
  label = 'Food tags',
  helperText = 'Pick the tags that best describe the meal before and after it happened.',
  manageLinkTo,
  manageLinkLabel = 'Manage tags'
}: FoodTagGroupSelectorProps) {
  const groupedTags = groupFoodTagsByCategory(tags);
  const selectedLabels = tags
    .filter((tag) => selectedTagIds.includes(tag.id))
    .map((tag) => `${FOOD_TAG_CATEGORY_LABELS[tag.category]}: ${tag.label}`);

  return (
    <section className="tag-selector food-tag-group-selector" aria-label={label}>
      <div className="section-header-inline">
        <div>
          <h3>{label}</h3>
          <p>{helperText}</p>
        </div>
        {manageLinkTo ? (
          <Link to={manageLinkTo} className="text-link-button">
            {manageLinkLabel}
          </Link>
        ) : null}
      </div>

      <div className="food-tag-group-selector__groups">
        {FOOD_TAG_CATEGORY_ORDER.map((category) => {
          const categoryTags = sortTags(groupedTags[category], settings, readings);
          if (categoryTags.length === 0) {
            return null;
          }

          return (
            <section key={category} className="food-tag-group-selector__category">
              <div className="section-header-inline food-tag-group-selector__category-header">
                <div>
                  <h4>{FOOD_TAG_CATEGORY_LABELS[category]}</h4>
                  <p>{CATEGORY_HELPER_TEXT[category]}</p>
                </div>
              </div>
              <div className="tag-chip-grid">
                {categoryTags.map((tag) => {
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
                          {tag.rangeMin ?? '-'} to {tag.rangeMax ?? '-'} cal
                        </small>
                      ) : (
                        <small>{FOOD_TAG_CATEGORY_LABELS[category]}</small>
                      )}
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
          ? 'No food tags selected.'
          : `${selectedLabels.length} selected: ${selectedLabels.join(', ')}`}
      </p>
    </section>
  );
}