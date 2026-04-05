import type { ChartPreset, ReadingFilters } from '../../lib/types';

type DateRangePickerProps = {
  filters: ReadingFilters;
  onChange: (nextFilters: ReadingFilters) => void;
  activePreset?: ChartPreset | 'custom';
  onPresetChange?: (preset: ChartPreset) => void;
  showPresets?: boolean;
  errorMessage?: string | null;
};

const PRESET_OPTIONS: Array<{ value: ChartPreset; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'lastWeek', label: 'Last week' },
  { value: 'lastMonth', label: 'Last month' },
  { value: 'thisMonth', label: 'This month' },
  { value: 'thisYear', label: 'This year' }
];

export function DateRangePicker({
  filters,
  onChange,
  activePreset = 'custom',
  onPresetChange,
  showPresets = false,
  errorMessage = null
}: DateRangePickerProps) {
  return (
    <section className="filter-card" aria-label="Date range filter">
      <div className="section-header-inline">
        <div>
          <h3>Date range</h3>
          <p>Date-only filtering for list and chart views.</p>
        </div>
      </div>

      {showPresets ? (
        <div className="preset-chip-row">
          {PRESET_OPTIONS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={activePreset === preset.value ? 'tag-chip active' : 'tag-chip'}
              onClick={() => onPresetChange?.(preset.value)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="date-time-picker__field-group compact">
        <label className="date-time-picker__field">
          <span>Start date</span>
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => onChange({ ...filters, startDate: event.target.value })}
          />
        </label>

        <label className="date-time-picker__field">
          <span>End date</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => onChange({ ...filters, endDate: event.target.value })}
          />
        </label>
      </div>

      {errorMessage ? <p className="field-error">{errorMessage}</p> : null}
    </section>
  );
}