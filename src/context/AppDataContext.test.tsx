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
});