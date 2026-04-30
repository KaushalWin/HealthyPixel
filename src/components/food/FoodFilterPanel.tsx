import { DateRangePicker } from '../sugar/DateRangePicker';
import {
  FOOD_TAG_CATEGORY_LABELS,
  FOOD_TAG_CATEGORY_ORDER
} from '../../lib/foodUtils';
import type {
  AppSettings,
  ChartPreset,
  FoodReading,
  FoodReadingFilters,
  FoodTagDefinition,
  LogicalMatchMode
} from '../../lib/types';
import { FoodTagGroupSelector } from './FoodTagGroupSelector';

type FoodFilterPanelProps = {
  filters: FoodReadingFilters;
  onChange: (nextFilters: FoodReadingFilters) => void;
  tags: FoodTagDefinition[];
  readings: FoodReading[];
  settings: AppSettings;
  activePreset?: ChartPreset | 'custom';
  onPresetChange?: (preset: ChartPreset) => void;
  showPresets?: boolean;
  errorMessage?: string | null;
  manageLinkTo?: string;
};

const MATCH_MODE_COPY: Record<LogicalMatchMode, string> = {
  and: 'Match all selected items',
  or: 'Match any selected item'
};

export function FoodFilterPanel({
  filters,
  onChange,
  tags,
  readings,
  settings,
  activePreset = 'custom',
  onPresetChange,
  showPresets = false,
  errorMessage = null,
  manageLinkTo
}: FoodFilterPanelProps) {
  return (
    <div className="section-stack food-filter-panel">
      <DateRangePicker
        filters={filters}
        onChange={(nextFilters) =>
          onChange({
            ...filters,
            startDate: nextFilters.startDate,
            endDate: nextFilters.endDate
          })
        }
        activePreset={activePreset}
        onPresetChange={onPresetChange}
        showPresets={showPresets}
        errorMessage={errorMessage}
      />

      <section className="filter-card" aria-label="Food category filters">
        <div className="section-header-inline">
          <div>
            <h3>Categories</h3>
            <p>Pick one or more food tag groups, then choose whether they match with AND or OR.</p>
          </div>
        </div>

        <div className="preset-chip-row">
          {FOOD_TAG_CATEGORY_ORDER.map((category) => {
            const isSelected = filters.categories.includes(category);

            return (
              <button
                key={category}
                type="button"
                className={isSelected ? 'tag-chip active' : 'tag-chip'}
                onClick={() => {
                  if (isSelected) {
                    onChange({
                      ...filters,
                      categories: filters.categories.filter((value) => value !== category)
                    });
                    return;
                  }

                  onChange({
                    ...filters,
                    categories: [...filters.categories, category]
                  });
                }}
              >
                {FOOD_TAG_CATEGORY_LABELS[category]}
              </button>
            );
          })}
        </div>

        <p className="tag-selector__selected-summary">
          {filters.categories.length === 0
            ? 'No food categories selected.'
            : `${filters.categories.length} categories selected: ${filters.categories
                .map((category) => FOOD_TAG_CATEGORY_LABELS[category])
                .join(', ')}`}
        </p>
      </section>

      <section className="filter-card" aria-label="Food filter matching logic">
        <div className="section-header-inline">
          <div>
            <h3>Match logic</h3>
            <p>AND means every selected item must match. OR means any selected item can match.</p>
          </div>
        </div>

        <div className="three-column-grid food-filter-panel__logic-grid">
          <label className="date-time-picker__field">
            <span>Specific tags</span>
            <select
              className="form-select"
              value={filters.tagMatchMode}
              onChange={(event) =>
                onChange({
                  ...filters,
                  tagMatchMode: event.target.value as LogicalMatchMode
                })
              }
            >
              <option value="or">{MATCH_MODE_COPY.or}</option>
              <option value="and">{MATCH_MODE_COPY.and}</option>
            </select>
          </label>

          <label className="date-time-picker__field">
            <span>Categories</span>
            <select
              className="form-select"
              value={filters.categoryMatchMode}
              onChange={(event) =>
                onChange({
                  ...filters,
                  categoryMatchMode: event.target.value as LogicalMatchMode
                })
              }
            >
              <option value="or">{MATCH_MODE_COPY.or}</option>
              <option value="and">{MATCH_MODE_COPY.and}</option>
            </select>
          </label>

          <label className="date-time-picker__field">
            <span>Mix tag + category results</span>
            <select
              className="form-select"
              value={filters.combinedMode}
              onChange={(event) =>
                onChange({
                  ...filters,
                  combinedMode: event.target.value as LogicalMatchMode
                })
              }
            >
              <option value="and">Narrow results with AND</option>
              <option value="or">Broaden results with OR</option>
            </select>
          </label>
        </div>
      </section>

      <FoodTagGroupSelector
        tags={tags}
        readings={readings}
        settings={settings}
        selectedTagIds={filters.tagIds}
        onChange={(tagIds) => onChange({ ...filters, tagIds })}
        label="Specific tags"
        helperText="Use tags alone or mix them with category filters above."
        manageLinkTo={manageLinkTo}
        manageLinkLabel="Manage food tags"
      />
    </div>
  );
}