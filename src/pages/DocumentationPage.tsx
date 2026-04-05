import { SiteShell } from '../components/SiteShell';
import type { ReactNode } from 'react';

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
            <li>HealthyPixel is a privacy-first health tracker.</li>
            <li>Core data stays on your device and is not used for profiling or ads.</li>
            <li>The app is designed for low friction and fast daily usage.</li>
          </ul>
        </DocBlock>

        <DocBlock title="Install As PWA">
          <h3>Android (Chrome)</h3>
          <ol>
            <li>Open HealthyPixel in Chrome.</li>
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
            <li>Open HealthyPixel in Safari.</li>
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
            <li>Help / Documentation</li>
            <li>Quick Reading</li>
            <li>Open Charts</li>
            <li>Open Settings / Help</li>
          </ul>
          <p>
            This build includes a direct <strong>Help / Documentation</strong> shortcut that opens
            <strong> /#/help</strong> after install.
          </p>
          <p>
            If launcher quick actions are not available on your device, use in-app shortcuts from
            the home screen and settings menu.
          </p>
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
            HealthyPixel includes a dedicated <strong>Tests</strong> page for trying shared
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
            <li>New features</li>
            <li>Behavior changes</li>
            <li>Bug fixes</li>
            <li>Any migration steps if needed</li>
          </ul>
        </DocBlock>
      </div>
    </SiteShell>
  );
}
