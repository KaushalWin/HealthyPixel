import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../lib/defaults';
import type { AppDataShape } from '../lib/types';
import { createFixtureAppData } from '../test/fixtures/appData';
import { AppDataProvider, useAppData } from './AppDataContext';

function ContextHarness({ importedData, onExport }: { importedData: AppDataShape; onExport: (data: AppDataShape) => void }) {
  const { replaceAllAppData, exportAppData, readings, tags } = useAppData();
  const fastingTag = tags.find((tag) => tag.id === 'fasting');

  return (
    <>
      <p data-testid="sugar-count">{readings.length}</p>
      <p data-testid="fasting-usage">{fastingTag?.usageCount ?? -1}</p>
      <button type="button" onClick={() => replaceAllAppData(importedData)}>
        Replace data
      </button>
      <button type="button" onClick={() => onExport(exportAppData())}>
        Export data
      </button>
    </>
  );
}

describe('AppDataContext', () => {
  it('replaces all app data, normalizes tag stats, and leaves saved AI keys untouched', async () => {
    const user = userEvent.setup();
    const importedData = createFixtureAppData();
    const onExport = vi.fn();

    window.localStorage.clear();
    window.localStorage.setItem(STORAGE_KEYS.aiOpenAiApiKey, 'sk-openai');

    render(
      <AppDataProvider>
        <ContextHarness importedData={importedData} onExport={onExport} />
      </AppDataProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Replace data' }));

    await waitFor(() => {
      expect(screen.getByTestId('sugar-count')).toHaveTextContent('1');
      expect(screen.getByTestId('fasting-usage')).toHaveTextContent('1');
    });

    expect(window.localStorage.getItem(STORAGE_KEYS.aiOpenAiApiKey)).toBe('sk-openai');

    await user.click(screen.getByRole('button', { name: 'Export data' }));

    const exportedData = onExport.mock.calls[0]?.[0] as AppDataShape;
    expect(exportedData.readings).toEqual(importedData.readings);
    expect(exportedData.settings.dashboardModules).toEqual(['food', 'sugar', 'bp']);
    expect(exportedData.tags.find((tag) => tag.id === 'fasting')?.usageCount).toBe(1);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.readings) ?? '[]')).toEqual(importedData.readings);
  });

  it('migrates legacy categorized tags during replaceAllAppData', async () => {
    const user = userEvent.setup();
    const importedData = createFixtureAppData();
    const onExport = vi.fn();

    const legacyData = {
      ...importedData,
      tags: [
        ...importedData.tags.map(({ category, ...tag }) => tag),
        {
          id: 'sugar-custom-legacy',
          label: 'Travel day',
          type: 'custom' as const,
          createdAtIso: importedData.tags[0].createdAtIso,
          updatedAtIso: importedData.tags[0].updatedAtIso,
          usageCount: 0,
          lastUsedAtIso: null,
          rangeMin: null,
          rangeMax: null
        }
      ],
      weightTags: importedData.weightTags.map(({ category, ...tag }) => tag),
      bpTags: importedData.bpTags.map(({ category, ...tag }) => tag)
    } as unknown as AppDataShape;

    render(
      <AppDataProvider>
        <ContextHarness importedData={legacyData} onExport={onExport} />
      </AppDataProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Replace data' }));
    await user.click(screen.getByRole('button', { name: 'Export data' }));

    const exportedData = onExport.mock.calls[0]?.[0] as AppDataShape;
    expect(exportedData.tags.find((tag) => tag.id === 'fasting')?.category).toBe('timing');
    expect(exportedData.tags.find((tag) => tag.id === 'sugar-custom-legacy')?.category).toBe('general');
    expect(exportedData.weightTags.find((tag) => tag.id === 'w-morning')?.category).toBe('timing');
    expect(exportedData.bpTags.find((tag) => tag.id === 'bp-random')?.category).toBe('context');
  });
});