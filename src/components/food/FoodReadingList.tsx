import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  FOOD_TAG_CATEGORY_LABELS,
  FOOD_TAG_CATEGORY_ORDER,
  classifyFoodReading
} from '../../lib/foodUtils';
import type { FoodReading, FoodTagDefinition } from '../../lib/types';

type FoodReadingListProps = {
  title: string;
  readings: FoodReading[];
  tagsById: Map<string, FoodTagDefinition>;
  emptyMessage: string;
  highlightReadingId?: string | null;
  colors: {
    inside: string;
    outside: string;
    neutral: string;
  };
};

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  hour12: false
});

function statusLabel(status: 'inside' | 'outside' | 'neutral') {
  if (status === 'inside') return 'Within calorie range';
  if (status === 'outside') return 'Outside calorie range';
  return 'No calorie range';
}

export function FoodReadingList({
  title,
  readings,
  tagsById,
  emptyMessage,
  highlightReadingId = null,
  colors
}: FoodReadingListProps) {
  return (
    <section className="list-card" aria-labelledby="food-list-title">
      <div className="section-header-inline">
        <div>
          <h2 id="food-list-title">{title}</h2>
          <p>Sorted by meal date and time in descending order.</p>
        </div>
      </div>

      {readings.length === 0 ? (
        <div className="empty-state">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="reading-list-grid">
          {readings.map((reading) => {
            const readingTags = reading.tagIds
              .map((tagId) => tagsById.get(tagId))
              .filter(Boolean) as FoodTagDefinition[];
            const orderedTags = FOOD_TAG_CATEGORY_ORDER.flatMap((category) =>
              readingTags.filter((tag) => tag.category === category)
            );
            const classification = classifyFoodReading(reading, readingTags);
            const accentColor =
              classification.status === 'inside'
                ? colors.inside
                : classification.status === 'outside'
                  ? colors.outside
                  : colors.neutral;

            return (
              <article
                key={reading.id}
                className={
                  highlightReadingId === reading.id ? 'reading-card highlight' : 'reading-card'
                }
                style={{ '--reading-accent': accentColor } as CSSProperties}
              >
                <div className="reading-card__topline">
                  <div>
                    <p className="reading-card__value">{reading.mealName}</p>
                    <p className="reading-card__meta">
                      {reading.calories} cal ·{' '}
                      {dateFormatter.format(new Date(reading.readingDateTimeIso))}
                    </p>
                  </div>
                  <span className="status-badge">{statusLabel(classification.status)}</span>
                </div>

                <div className="tag-inline-list food-reading-list__tags">
                  {orderedTags.length === 0 ? (
                    <span className="tag-pill muted">No tags</span>
                  ) : (
                    orderedTags.map((tag) => (
                      <span
                        key={tag.id}
                        className={`tag-pill food-tag-pill food-tag-pill--${tag.category}`}
                      >
                        {FOOD_TAG_CATEGORY_LABELS[tag.category]}: {tag.label}
                      </span>
                    ))
                  )}
                </div>

                {reading.note ? <p className="reading-card__note">{reading.note}</p> : null}

                <div className="action-row compact">
                  <Link to={`/food/edit/${reading.id}`} className="secondary-button small">
                    Edit
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}