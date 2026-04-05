import { useState } from 'react';
import type { ReactNode } from 'react';
import { DateTimePicker } from '../components/DateTimePicker';
import { SiteShell } from '../components/SiteShell';

type TestEntry = {
  id: string;
  title: string;
  summary: string;
  content: ReactNode;
};

const previewFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'full',
  timeStyle: 'short',
  hour12: false
});

export function TestsPage() {
  const [selectedDateTime, setSelectedDateTime] = useState(() => new Date());

  const testEntries: TestEntry[] = [
    {
      id: 'date-time-picker',
      title: 'Common Date-Time Picker',
      summary: 'Native date and 24-hour time inputs with default value set to now.',
      content: (
        <div className="test-demo-stack">
          <DateTimePicker
            label="Schedule reading"
            description="Uses native browser pickers for both date and 24-hour time."
            value={selectedDateTime}
            onChange={setSelectedDateTime}
          />
          <div className="test-result-card" aria-live="polite">
            <p className="test-result-label">Current value</p>
            <p className="test-result-value">{previewFormatter.format(selectedDateTime)}</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <SiteShell
      title="Tests Page"
      subtitle="A live playground for validating shared components and small features before they move into production screens."
    >
      <section className="tests-intro doc-card">
        <h2>How to use this page</h2>
        <ol>
          <li>Add each new component or feature demo to the top of the `testEntries` array in this page.</li>
          <li>Keep demos isolated so the page stays safe for experimentation.</li>
          <li>Once a feature is stable, move the component into a production screen and keep a lightweight demo here.</li>
        </ol>
      </section>

      <section className="tests-grid" aria-label="Feature tests">
        {testEntries.map((entry) => (
          <article key={entry.id} className="doc-card test-card">
            <div className="test-card__header">
              <div>
                <p className="test-card__eyebrow">Feature demo</p>
                <h2>{entry.title}</h2>
              </div>
              <p className="test-card__summary">{entry.summary}</p>
            </div>
            {entry.content}
          </article>
        ))}
      </section>
    </SiteShell>
  );
}