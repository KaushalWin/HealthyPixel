import { SiteShell } from '../components/SiteShell';
import type { ReactNode } from 'react';
import { APP_NAME } from '../lib/branding';

function DocBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="doc-card" aria-labelledby={title.replace(/\s+/g, '-').toLowerCase()}>
      <h2 id={title.replace(/\s+/g, '-').toLowerCase()}>{title}</h2>
      {children}
    </section>
  );
}

export function DocumentationPage() {
  return (
    <SiteShell
      title="In-App Documentation"
      subtitle="Everything users need: install, quick actions, accessibility, and feature usage."
    >
      <div className="doc-grid">
        <DocBlock title="What This App Is">
          <ul>
            <li>{APP_NAME} is a privacy-first health tracker.</li>
            <li>Core data stays on your device and is not used for profiling or ads.</li>
            <li>The app is designed for low friction and fast daily usage.</li>
            <li>Sugar readings, tags, settings, and chart preferences are stored locally only.</li>
          </ul>
        </DocBlock>

        <DocBlock title="Install As PWA">
          <h3>Android (Chrome)</h3>
          <ol>
            <li>{`Open ${APP_NAME} in Chrome.`}</li>
            <li>Tap the menu icon.</li>
            <li>Tap Install app.</li>
            <li>Confirm Install.</li>
          </ol>
          <p>
            Important: use <strong>Install app</strong> on Android. The plain
            <strong> Add to Home screen</strong> shortcut may not provide long-press quick actions.
          </p>
          <p>
            Launcher shortcuts are typically available only for an installed PWA from a secure
            origin (HTTPS). Local network HTTP URLs often show only Add to Home screen behavior.
          </p>
          <h3>iPhone (Safari)</h3>
          <ol>
            <li>{`Open ${APP_NAME} in Safari.`}</li>
            <li>Tap the Share icon.</li>
            <li>Tap Add to Home Screen.</li>
            <li>Tap Add.</li>
          </ol>
        </DocBlock>

        <DocBlock title="Quick Actions (Long Press)">
          <p>
            On supported launchers, long-press the app icon to open quick actions directly, for
            example:
          </p>
          <ul>
            <li>Add Sugar</li>
          </ul>
          <p>
            This build includes a direct <strong>Add Sugar</strong> shortcut that opens the sugar
            reading entry page after install.
          </p>
          <p>
            If launcher quick actions are not available on your device, use in-app shortcuts from
            the compact menu and the + quick-action button inside the app.
          </p>
        </DocBlock>

        <DocBlock title="Compact Navigation Model">
          <ul>
            <li>The app now uses one main menu button in the header.</li>
            <li>Sub-categories are grouped under that single collapsible menu.</li>
            <li>A small + button opens a quick-action popup for Add Sugar.</li>
            <li>This keeps the first screen compact on mobile and reduces scrolling.</li>
          </ul>
        </DocBlock>

        <DocBlock title="Sugar Reading Flow">
          <ol>
            <li>Open <strong>Add Sugar</strong>.</li>
            <li>Enter the reading value (required).</li>
            <li>Save directly for the fastest flow.</li>
            <li>Open More options only when you need time, tags, or note changes.</li>
            <li>Save to open the filtered Sugar List with the new row highlighted.</li>
          </ol>
        </DocBlock>

        <DocBlock title="Sugar List and Editing">
          <ul>
            <li>The Sugar List page is a direct route in the navigation.</li>
            <li>Readings are shown in descending date-time order.</li>
            <li>Use date filters and tag filters to narrow the list.</li>
            <li>Use the Add New Entry action at the top for repeated logging.</li>
            <li>Edit opens the reading in-place without leaving the local-first workflow.</li>
          </ul>
        </DocBlock>

        <DocBlock title="Chart and Insights">
          <ul>
            <li>The chart uses straight line segments with points and an area fill below the line.</li>
            <li>Default date range comes from Settings.</li>
            <li>Chart filters are placed below the chart to keep the main chart view first.</li>
            <li>Filters and list remain aligned with chart results.</li>
            <li>Inside-range, outside-range, and neutral readings use different colors.</li>
            <li>Tag ranges come from Settings, and untagged readings stay neutral.</li>
          </ul>
        </DocBlock>

        <DocBlock title="Settings Overview">
          <ul>
            <li>Settings includes tag management, chart defaults, and chart colors.</li>
            <li>Tags can be added, edited, renamed, ranged, sorted, and removed locally.</li>
            <li>Chart defaults include preset date range and inside/outside/neutral colors.</li>
            <li>Delete all local data restores the app to default local bootstrap state.</li>
          </ul>
        </DocBlock>

        <DocBlock title="Accessibility and Speed Standards">
          <ul>
            <li>Minimal taps for frequent actions.</li>
            <li>Readable contrast and large touch targets.</li>
            <li>Keyboard-accessible core navigation and controls.</li>
            <li>Reduced-motion-friendly transitions.</li>
          </ul>
        </DocBlock>

        <DocBlock title="Tests Page Workflow">
          <p>
            {APP_NAME} includes a dedicated <strong>Tests</strong> page for trying shared
            components and small features before they are placed in production screens.
          </p>
          <ol>
            <li>Open <strong>Tests</strong> from the top navigation or quick actions.</li>
            <li>Add new demos to the top of the test registry on the page so the newest work stays first.</li>
            <li>Keep each demo focused and reusable, then migrate stable pieces into live flows.</li>
          </ol>
        </DocBlock>

        <DocBlock title="Date-Time Picker Standard">
          <ul>
            <li>Use the shared date-time picker for new date/time entry flows.</li>
            <li>Default to the current date and time.</li>
            <li>Use the compact reset control to jump back to now when needed.</li>
            <li>Use native browser date and time selectors instead of custom drag controls.</li>
            <li>Keep time input in 24-hour format to avoid AM/PM follow-up taps.</li>
          </ul>
        </DocBlock>

        <DocBlock title="Feature Updates and What Is New">
          <p>
            Every release should include a short What is New summary inside the app so users can
            understand new behavior quickly.
          </p>
          <ul>
            <li>Sugar reading entry, editing, and filtered list</li>
            <li>Tag management and local chart settings</li>
            <li>Chart insights with range-aware coloring</li>
            <li>Expanded Tests page demos for shared components</li>
          </ul>
        </DocBlock>
      </div>
    </SiteShell>
  );
}
