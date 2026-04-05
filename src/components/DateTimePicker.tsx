import { useId, useState } from 'react';

type DateTimePickerProps = {
  label: string;
  description?: string;
  value?: Date;
  defaultValue?: Date;
  onChange?: (value: Date) => void;
};

const summaryFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

function normalizeInitialValue(value?: Date, fallback?: Date) {
  return new Date(value ?? fallback ?? new Date());
}

function isValidDate(value: Date) {
  return !Number.isNaN(value.getTime());
}

function toDateInputValue(value: Date) {
  const localValue = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
  return localValue.toISOString().slice(0, 10);
}

function toTimeInputValue(value: Date) {
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function setCalendarDate(source: Date, dateValue: string) {
  if (!dateValue) {
    return source;
  }

  const [year, month, day] = dateValue.split('-').map(Number);
  if (!year || !month || !day) {
    return source;
  }

  const nextValue = new Date(source);
  nextValue.setFullYear(year, month - 1, day);
  return isValidDate(nextValue) ? nextValue : source;
}

function setClockTime(source: Date, timeValue: string) {
  if (!timeValue) {
    return source;
  }

  const [hours, minutes] = timeValue.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return source;
  }

  const nextValue = new Date(source);
  nextValue.setHours(hours, minutes, 0, 0);
  return isValidDate(nextValue) ? nextValue : source;
}

export function DateTimePicker({
  label,
  description,
  value,
  defaultValue,
  onChange
}: DateTimePickerProps) {
  const [internalValue, setInternalValue] = useState(() => normalizeInitialValue(value, defaultValue));
  const pickerId = useId();
  const resolvedValue = value ?? internalValue;

  const commitValue = (nextValue: Date) => {
    if (!isValidDate(nextValue)) {
      return;
    }

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  };

  return (
    <section className="date-time-picker" aria-labelledby={`${pickerId}-label`}>
      <div className="date-time-picker__topline">
        <div>
          <p className="date-time-picker__eyebrow">Reusable date-time picker</p>
          <h3 id={`${pickerId}-label`} className="date-time-picker__label">
            {label}
          </h3>
        </div>
        <button
          type="button"
          className="picker-action"
          onClick={() => commitValue(new Date())}
        >
          Now
        </button>
      </div>

      {description ? (
        <p id={`${pickerId}-description`} className="date-time-picker__description">
          {description}
        </p>
      ) : null}

      <p className="date-time-picker__summary">{summaryFormatter.format(resolvedValue)}</p>

      <div className="date-time-picker__field-group">
        <label className="date-time-picker__field">
          <span>Date</span>
          <input
            type="date"
            aria-describedby={description ? `${pickerId}-description` : undefined}
            value={toDateInputValue(resolvedValue)}
            onChange={(event) => commitValue(setCalendarDate(resolvedValue, event.target.value))}
          />
        </label>

        <label className="date-time-picker__field">
          <span>Time (24-hour)</span>
          <input
            type="time"
            step={60}
            aria-describedby={description ? `${pickerId}-description` : undefined}
            value={toTimeInputValue(resolvedValue)}
            onChange={(event) => commitValue(setClockTime(resolvedValue, event.target.value))}
          />
        </label>
      </div>
    </section>
  );
}