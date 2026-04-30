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
            <li>Sugar, weight, height, blood pressure, food entries, tags, settings, and chart preferences are stored locally only.</li>
            <li>Settings includes full-app JSON export/import so you can make a manual backup or restore local app data on another device.</li>
            <li>AI Health Chat is optional and sends only the chat text you type directly to the provider you selected.</li>
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
            <li>Add Food</li>
            <li>Add Weight</li>
            <li>Add Height</li>
            <li>Add BP</li>
          </ul>
          <p>
            These shortcuts open the corresponding entry page after install.
          </p>
          <p>
            If launcher quick actions are not available on your device, use in-app shortcuts from
            the compact menu and the + quick-action button inside the app.
          </p>
        </DocBlock>

        <DocBlock title="Compact Navigation Model">
          <ul>
            <li>The app uses one main menu button in the header.</li>
            <li>Help now includes Documentation, AI Health Chat, About Us, and Tests.</li>
            <li>Vitals are grouped under a single section with subsections: Sugar, Food, Weight, Height, Blood Pressure.</li>
            <li>A small + button opens a quick-action popup for Add Sugar, Add Food, Add Weight, Add Height, Add BP.</li>
            <li>This keeps the first screen compact on mobile and reduces scrolling.</li>
          </ul>
        </DocBlock>

        <DocBlock title="AI Health Chat">
          <ol>
            <li>Open <strong>AI Health Chat</strong> from the Help section in the main menu.</li>
            <li>Choose a provider: DeepSeek or OpenAI (ChatGPT).</li>
            <li>Choose the model you want to use for this session.</li>
            <li>Paste the matching provider API key. The key stays in memory unless you explicitly save it in this browser.</li>
            <li>Ask a wellness or tracking question. The app sends the chat directly from your browser to the selected provider.</li>
          </ol>
          <p>If you click Save in this browser, the key is stored only in local browser data on this device. PixieTrack does not store or sync it on any server.</p>
          <p>The page is for brainstorming and general guidance only. It is not medical advice and should not replace a qualified doctor.</p>
          <p>Switching provider clears the key and chat history. Switching model resets the chat so replies stay tied to the current model.</p>
        </DocBlock>

        <DocBlock title="Data Backup and Restore">
          <ol>
            <li>Open <strong>Settings</strong>.</li>
            <li>Use <strong>Export JSON</strong> to download a full backup of your readings, tags, and settings.</li>
            <li>Store that file somewhere safe if you want a manual backup before changing devices or clearing browser data.</li>
            <li>Use <strong>Import JSON</strong> to restore from a previous PixieTrack export.</li>
            <li>Import replaces the current local readings, tags, and settings on this device. It does not merge data.</li>
          </ol>
          <p>Saved AI provider keys are intentionally excluded from exported files and are not changed by import.</p>
          <p>Older exports are upgraded during import so legacy Sugar, Weight, and BP tags gain the current category model automatically.</p>
        </DocBlock>

        <DocBlock title="Food Tracking">
          <ol>
            <li>Open <strong>Add Food</strong> from the menu or the quick-action + button.</li>
            <li>Enter the meal name and calories.</li>
            <li>Tag the meal in four groups: planned, actual, context, and behavior.</li>
            <li>Use More options only when you need to adjust date/time or add a note.</li>
            <li>Save to open the Food List and review the meal in charts later.</li>
          </ol>
          <p>The Food Chart includes a calorie trend view plus a top-tag breakdown chart. Filters can combine selected categories and selected tags with AND or OR logic.</p>
        </DocBlock>

        <DocBlock title="Sugar Reading Flow">
          <ol>
            <li>Open <strong>Add Sugar</strong>.</li>
            <li>Enter the reading value (required).</li>
            <li>Save directly for the fastest flow, or open More options for time, grouped tags, and note changes.</li>
            <li>Sugar tags are grouped by timing, activity, context, and general so related choices stay together.</li>
            <li>Leaving tags empty is allowed when you want to log a neutral reading quickly.</li>
            <li>Save to open the filtered Sugar List with the new row highlighted.</li>
          </ol>
        </DocBlock>

        <DocBlock title="Sugar List and Editing">
          <ul>
            <li>The Sugar List page is a direct route in the navigation.</li>
            <li>Readings are shown in descending date-time order.</li>
            <li>Use date, category, and tag filters to narrow the list.</li>
            <li>Use the Add New Entry action at the top for repeated logging.</li>
            <li>Edit opens the reading in-place without leaving the local-first workflow.</li>
          </ul>
        </DocBlock>

        <DocBlock title="Weight Tracking">
          <ol>
            <li>Open <strong>Add Weight</strong> from the menu or quick-action +.</li>
            <li>Enter weight in kilograms (0–700 kg).</li>
            <li>Select grouped tags by timing, body state, routine, or general, or leave tags empty for a quick save.</li>
            <li>Optionally expand More options for time and note.</li>
            <li>Save — the reading appears in the Weight List.</li>
          </ol>
          <p>The Weight List and Weight Chart both support category-aware filtering, and the chart keeps the inside/outside/neutral range coloring based on your tag ranges.</p>
        </DocBlock>

        <DocBlock title="Height Tracking">
          <ol>
            <li>Open <strong>Add Height</strong> from the menu or quick-action +.</li>
            <li>Enter height in centimetres (0–300 cm).</li>
            <li>Select tags and save.</li>
          </ol>
          <p>The Height Chart follows the same pattern as the Weight Chart.</p>
        </DocBlock>

        <DocBlock title="Blood Pressure Tracking">
          <ol>
            <li>Open <strong>Add BP</strong> from the menu or quick-action +.</li>
            <li>Enter systolic (upper, 40–300 mmHg) and diastolic (lower, 20–200 mmHg).</li>
            <li>Diastolic must be less than systolic.</li>
            <li>Select grouped tags by timing, body state, context, or general, or leave tags empty for a quick save.</li>
            <li>BP tags define healthy ranges for both systolic and diastolic.</li>
            <li>Save to record.</li>
          </ol>
          <p>The BP Chart shows two lines, supports category-aware filtering, and includes a top-tag breakdown chart for the filtered readings.</p>
        </DocBlock>

        <DocBlock title="Chart and Insights">
          <ul>
            <li>The chart uses straight line segments with points and an area fill below the line.</li>
            <li>Default date range comes from Settings.</li>
            <li>Chart filters are placed below the chart to keep the main chart view first.</li>
            <li>Filters and list remain aligned with chart results.</li>
            <li>Inside-range, outside-range, and neutral readings use different colors.</li>
            <li>Tag ranges come from Settings, and untagged readings stay neutral.</li>
            <li>Sugar and BP charts include top-tag breakdown summaries for the currently filtered results.</li>
          </ul>
        </DocBlock>

        <DocBlock title="Settings Overview">
          <ul>
            <li>Settings includes per-module tag management, chart defaults, and chart colors.</li>
            <li>Settings also includes full-app JSON export/import for manual backup and restore.</li>
            <li>Tag management uses module tabs (Sugar, Food, Weight, Height, BP) to manage tags independently.</li>
            <li>Sugar, Weight, and BP custom tags include a category field so grouped selectors and filters stay organized.</li>
            <li>BP tags have 4 range fields (systolic min/max, diastolic min/max).</li>
            <li>Food tags include a category field, and duplicate food labels are only blocked inside the same category.</li>
            <li>Blank labels and control characters are rejected before a tag or meal name can be saved.</li>
            <li>Chart settings include preset date range and per-module inside/outside/neutral colors.</li>
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
            <li>Sugar reading entry, editing, and category-aware filtered list</li>
            <li>Food tracking with calorie charts and grouped tag categories</li>
            <li>Weight and blood pressure tracking with grouped tags and category-aware chart filters</li>
            <li>Sugar and blood pressure top-tag breakdown charts</li>
            <li>Legacy tag imports upgraded into the current category model</li>
            <li>JSON export/import in Settings for manual full-app backup and restore</li>
            <li>AI Health Chat with memory-first API keys and optional browser-local save for OpenAI and DeepSeek</li>
            <li>Per-module tag management and chart color settings</li>
            <li>Chart insights with range-aware coloring</li>
            <li>Expanded Tests page demos for shared components</li>
          </ul>
        </DocBlock>
      </div>
    </SiteShell>
  );
}
