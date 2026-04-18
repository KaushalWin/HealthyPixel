import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { classifyReading } from '../../lib/readingUtils';
import type { AppSettings, HeightReading, TagDefinition } from '../../lib/types';

type HeightReadingListProps = {
  title: string;
  readings: HeightReading[];
  tagsById: Map<string, TagDefinition>;
  settings: AppSettings;
  emptyMessage: string;
  highlightReadingId?: string | null;
};

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  hour12: false
});

function statusLabel(status: 'inside' | 'outside' | 'neutral') {
  if (status === 'inside') return 'Inside range';
  if (status === 'outside') return 'Outside range';
  return 'No range';
}

export function HeightReadingList({
  title,
  readings,
  tagsById,
  settings,
  emptyMessage,
  highlightReadingId = null
}: HeightReadingListProps) {
  return (
    <section className="list-card" aria-labelledby="height-list-title">
      <div className="section-header-inline">
        <div>
          <h2 id="height-list-title">{title}</h2>
          <p>Sorted by reading date and time in descending order.</p>
        </div>
      </div>

      {readings.length === 0 ? (
        <div className="empty-state"><p>{emptyMessage}</p></div>
      ) : (
        <div className="reading-list-grid">
          {readings.map((reading) => {
            const readingTags = reading.tagIds.map((id) => tagsById.get(id)).filter(Boolean) as TagDefinition[];
            const classification = classifyReading(reading as any, readingTags);
            const accentColor =
              classification.status === 'inside'
                ? settings.heightChartColorInside
                : classification.status === 'outside'
                  ? settings.heightChartColorOutside
                  : settings.heightChartColorNeutral;

            return (
              <article
                key={reading.id}
                className={highlightReadingId === reading.id ? 'reading-card highlight' : 'reading-card'}
                style={{ '--reading-accent': accentColor } as CSSProperties}
              >
                <div className="reading-card__topline">
                  <div>
                    <p className="reading-card__value">{reading.value} cm</p>
                    <p className="reading-card__meta">{dateFormatter.format(new Date(reading.readingDateTimeIso))}</p>
                  </div>
                  <span className="status-badge">{statusLabel(classification.status)}</span>
                </div>
                <div className="tag-inline-list">
                  {readingTags.length === 0 ? (
                    <span className="tag-pill muted">No tags</span>
                  ) : (
                    readingTags.map((tag) => <span key={tag.id} className="tag-pill">{tag.label}</span>)
                  )}
                </div>
                {reading.note ? <p className="reading-card__note">{reading.note}</p> : null}
                <div className="action-row compact">
                  <Link to={`/height/edit/${reading.id}`} className="secondary-button small">Edit</Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
