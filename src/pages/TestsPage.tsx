import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { DateTimePicker } from '../components/DateTimePicker';
import { DateRangePicker } from '../components/sugar/DateRangePicker';
import { SugarReadingForm } from '../components/sugar/SugarReadingForm';
import { SugarReadingList } from '../components/sugar/SugarReadingList';
import { TagSelector } from '../components/sugar/TagSelector';
import { TagChipSelector } from '../components/TagChipSelector';
import { WeightReadingForm } from '../components/weight/WeightReadingForm';
import { WeightReadingList } from '../components/weight/WeightReadingList';
import { HeightReadingForm } from '../components/height/HeightReadingForm';
import { HeightReadingList } from '../components/height/HeightReadingList';
import { BpReadingForm } from '../components/bp/BpReadingForm';
import { BpReadingList } from '../components/bp/BpReadingList';
import { ApiKeyInput } from '../components/ai/ApiKeyInput';
import { ChatWindow, type ChatWindowMessage } from '../components/ai/ChatWindow';
import { ModelSelector } from '../components/ai/ModelSelector';
import { SiteShell } from '../components/SiteShell';
import { useAppData } from '../context/AppDataContext';
import { buildPresetDateRange, createReadingDraft, createWeightDraft, createHeightDraft, createBpDraft, sortReadingsDescending } from '../lib/readingUtils';
import type { AiModel, AiProvider } from '../lib/aiChat';
import type { ReadingFilters, VitalModule } from '../lib/types';

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

function AiHealthChatTestDemo() {
  const [provider, setProvider] = useState<AiProvider | ''>('openai');
  const [model, setModel] = useState<AiModel | ''>('gpt-4o-mini');
  const [apiKey, setApiKey] = useState('demo-key');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatWindowMessage[]>([
    { id: 'demo-1', role: 'assistant' as const, content: 'This demo uses static replies so you can inspect the shared chat UI safely.' }
  ]);

  return (
    <div className="test-demo-stack">
      <ModelSelector
        provider={provider}
        model={model}
        onProviderChange={(nextProvider) => {
          setProvider(nextProvider);
          setModel('');
          setApiKey('');
          setMessages([]);
        }}
        onModelChange={(nextModel) => {
          setModel(nextModel);
          setMessages([]);
        }}
      />

      {provider && model ? (
        <ApiKeyInput
          provider={provider}
          value={apiKey}
          onChange={setApiKey}
          onSaveLocally={() => undefined}
          onClearSavedKey={() => undefined}
          hasSavedKey={false}
          statusMessage="Demo mode only. The full AI Health Chat page wires local save and clear behavior."
        />
      ) : null}

      <ChatWindow
        messages={messages}
        draft={draft}
        onDraftChange={setDraft}
        onSend={() => {
          const trimmedDraft = draft.trim();

          if (!trimmedDraft) {
            return;
          }

          setMessages((current) => [
            ...current,
            { id: `${current.length + 1}`, role: 'user', content: trimmedDraft },
            { id: `${current.length + 2}`, role: 'assistant', content: `Demo reply for ${model}: keep the real network call on the AI Health Chat page.` }
          ]);
          setDraft('');
        }}
        onClearChat={() => {
          setMessages([]);
          setDraft('');
        }}
        isLoading={false}
        errorMessage={null}
        inputDisabled={!provider || !model || apiKey.trim().length === 0}
        disabledReason="Choose a provider, model, and API key to enable the demo composer."
      />
    </div>
  );
}

export function TestsPage() {
  const { readings, settings, updateSettings, tags, weightReadings, weightTags, heightReadings, heightTags, bpReadings, bpTags } = useAppData();
  const [selectedDateTime, setSelectedDateTime] = useState(() => new Date());
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [chipTags, setChipTags] = useState<string[]>([]);
  const [dateFilters, setDateFilters] = useState<ReadingFilters>(() => buildPresetDateRange('lastWeek'));
  const tagsById = useMemo(() => new Map(tags.map((tag) => [tag.id, tag])), [tags]);
  const weightTagsById = useMemo(() => new Map(weightTags.map((t) => [t.id, t])), [weightTags]);
  const heightTagsById = useMemo(() => new Map(heightTags.map((t) => [t.id, t])), [heightTags]);
  const bpTagsById = useMemo(() => new Map(bpTags.map((t) => [t.id, t])), [bpTags]);

  const testEntries: TestEntry[] = [
    {
      id: 'ai-health-chat',
      title: 'AI Health Chat',
      summary: 'Provider/model selection, optional local-save API key UI, and the shared chat window without live network calls.',
      content: <AiHealthChatTestDemo />
    },
    {
      id: 'analysis-dashboard',
      title: 'Analysis Dashboard',
      summary: 'Live dashboard module toggles and summary. Toggle modules here then visit the dashboard to verify.',
      content: (
        <div className="test-demo-stack">
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
            <strong>Enabled modules:</strong> {settings.dashboardModules.length === 0 ? 'None' : settings.dashboardModules.join(', ')}
          </p>
          <div className="dashboard-toggles">
            {(['sugar', 'weight', 'height', 'bp', 'food'] as VitalModule[]).map((mod) => (
              <label key={mod} className="toggle-row">
                <input
                  type="checkbox"
                  checked={settings.dashboardModules.includes(mod)}
                  onChange={() => {
                    const current = settings.dashboardModules;
                    const next = current.includes(mod) ? current.filter((m) => m !== mod) : [...current, mod];
                    updateSettings({ dashboardModules: next });
                  }}
                />
                <span>{mod.charAt(0).toUpperCase() + mod.slice(1)}</span>
              </label>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: '0.5rem' }}>
            <strong>Preset:</strong> {settings.dashboardChartPreset}
          </p>
          <div className="test-result-card" aria-live="polite">
            <p className="test-result-label">Data counts</p>
            <p className="test-result-value">
              Sugar: {readings.length} · Weight: {weightReadings.length} · Height: {heightReadings.length} · BP: {bpReadings.length}
            </p>
          </div>
          <Link to="/analysis" className="primary-button inline-block" style={{ marginTop: '0.5rem' }}>
            Open Analysis Dashboard →
          </Link>
        </div>
      )
    },
    {
      id: 'tag-chip-selector',
      title: 'Tag Chip Selector',
      summary: 'Shared chip-based multi-select tag component used across all vital modules.',
      content: (
        <TagChipSelector
          tags={tags}
          readings={readings}
          settings={settings}
          selectedTagIds={chipTags}
          onChange={setChipTags}
          manageLinkTo="/settings/tags"
        />
      )
    },
    {
      id: 'bp-reading-form',
      title: 'BP Reading Form',
      summary: 'Dual-input form for systolic/diastolic blood pressure with validation.',
      content: (
        <BpReadingForm
          title="BP form demo"
          submitLabel="Demo save"
          initialValue={createBpDraft()}
          tags={bpTags}
          readings={bpReadings}
          settings={settings}
          listPath="/bp"
          onSubmit={() => undefined}
        />
      )
    },
    {
      id: 'bp-reading-list',
      title: 'BP Reading List',
      summary: 'Reusable BP list with systolic/diastolic display and classification badges.',
      content: (
        <BpReadingList
          title="Demo BP list"
          readings={sortReadingsDescending(bpReadings).slice(0, 3)}
          tagsById={bpTagsById}
          settings={settings}
          emptyMessage="Add a BP reading to see this demo."
        />
      )
    },
    {
      id: 'weight-reading-form',
      title: 'Weight Reading Form',
      summary: 'Weight entry form with chip tags and collapsible options.',
      content: (
        <WeightReadingForm
          title="Weight form demo"
          submitLabel="Demo save"
          initialValue={createWeightDraft()}
          tags={weightTags}
          readings={weightReadings}
          settings={settings}
          listPath="/weight"
          onSubmit={() => undefined}
        />
      )
    },
    {
      id: 'weight-reading-list',
      title: 'Weight Reading List',
      summary: 'Reusable weight reading list with status badges.',
      content: (
        <WeightReadingList
          title="Demo weight list"
          readings={sortReadingsDescending(weightReadings).slice(0, 3)}
          tagsById={weightTagsById}
          settings={settings}
          emptyMessage="Add a weight reading to see this demo."
        />
      )
    },
    {
      id: 'height-reading-form',
      title: 'Height Reading Form',
      summary: 'Height entry form in centimetres with chip tags.',
      content: (
        <HeightReadingForm
          title="Height form demo"
          submitLabel="Demo save"
          initialValue={createHeightDraft()}
          tags={heightTags}
          readings={heightReadings}
          settings={settings}
          listPath="/height"
          onSubmit={() => undefined}
        />
      )
    },
    {
      id: 'height-reading-list',
      title: 'Height Reading List',
      summary: 'Reusable height reading list with status badges.',
      content: (
        <HeightReadingList
          title="Demo height list"
          readings={sortReadingsDescending(heightReadings).slice(0, 3)}
          tagsById={heightTagsById}
          settings={settings}
          emptyMessage="Add a height reading to see this demo."
        />
      )
    },
    {
      id: 'sugar-reading-list',
      title: 'Sugar Reading List',
      summary: 'Reusable list component with status colors, tags, notes, and edit action.',
      content: (
        <SugarReadingList
          title="Demo reading list"
          readings={sortReadingsDescending(readings).slice(0, 3)}
          tagsById={tagsById}
          settings={settings}
          emptyMessage="Create a few readings to populate this demo list."
        />
      )
    },
    {
      id: 'sugar-reading-form',
      title: 'Sugar Reading Form',
      summary: 'Shared create/edit form with native date-time input, tags, and note support.',
      content: (
        <SugarReadingForm
          title="Form demo"
          submitLabel="Demo save"
          initialValue={createReadingDraft()}
          tags={tags}
          readings={readings}
          settings={settings}
          onSubmit={() => undefined}
        />
      )
    },
    {
      id: 'date-range-picker',
      title: 'Date Range Picker',
      summary: 'Reusable date-only range selector with optional preset support and validation states.',
      content: (
        <DateRangePicker
          filters={dateFilters}
          onChange={setDateFilters}
          activePreset="lastWeek"
          onPresetChange={(preset) => setDateFilters(buildPresetDateRange(preset))}
          showPresets
        />
      )
    },
    {
      id: 'tag-selector',
      title: 'Tag Selector',
      summary: 'Multi-select tag control ordered by current Settings logic and shared across pages.',
      content: (
        <TagSelector
          tags={tags}
          readings={readings}
          settings={settings}
          selectedTagIds={selectedTags}
          onChange={setSelectedTags}
          manageLinkTo="/settings/tags"
          helperText="This demo uses the same sorting and tag metadata as the production forms."
        />
      )
    },
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