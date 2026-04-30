import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppDataProvider } from '../../context/AppDataContext';
import { STORAGE_KEYS } from '../../lib/defaults';
import { serializeAppDataExport } from '../../lib/dataPortability';
import { createFixtureAppData, fixedNow } from '../../test/fixtures/appData';
import { SettingsPage } from './SettingsPage';

function renderSettingsPage() {
  return render(
    <MemoryRouter>
      <AppDataProvider>
        <SettingsPage />
      </AppDataProvider>
    </MemoryRouter>
  );
}

describe('SettingsPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('exports a json payload without saved AI keys', async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn().mockReturnValue('blob:pixie-track-export');
    const revokeObjectURL = vi.fn();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const originalBlob = globalThis.Blob;
    let exportedText = '';

    class MockBlob extends originalBlob {
      constructor(parts: BlobPart[], options?: BlobPropertyBag) {
        super(parts, options);
        exportedText = parts.map((part) => (typeof part === 'string' ? part : String(part))).join('');
      }
    }

    Object.defineProperty(globalThis, 'Blob', { configurable: true, value: MockBlob });
    Object.defineProperty(window.URL, 'createObjectURL', { configurable: true, value: createObjectURL });
    Object.defineProperty(window.URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL });
    window.localStorage.setItem(STORAGE_KEYS.aiOpenAiApiKey, 'sk-openai');

    renderSettingsPage();

    await user.click(screen.getByRole('button', { name: 'Export JSON' }));

    expect(clickSpy).toHaveBeenCalledTimes(1);

    expect(exportedText).toContain('"app": "pixie-track"');
    expect(exportedText).not.toContain('sk-openai');
    expect(screen.getByText('Exported the current app data as JSON. Saved AI keys were not included.')).toBeInTheDocument();

    await waitFor(() => {
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:pixie-track-export');
    });

    Object.defineProperty(globalThis, 'Blob', { configurable: true, value: originalBlob });
  });

  it('imports a json payload, replaces app data, and preserves saved AI keys', async () => {
    const user = userEvent.setup();
    const fixture = createFixtureAppData();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    window.localStorage.setItem(STORAGE_KEYS.aiOpenAiApiKey, 'sk-openai');

    renderSettingsPage();

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File([serializeAppDataExport(fixture, fixedNow)], 'pixie-track-export.json', {
      type: 'application/json'
    });

    await user.upload(input, file);

    expect(await screen.findByText('Imported pixie-track-export.json and replaced the current local app data.')).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEYS.aiOpenAiApiKey)).toBe('sk-openai');
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.readings) ?? '[]')).toEqual(fixture.readings);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.settings) ?? '{}')).toMatchObject({
      popularWindowDays: 21,
      dashboardModules: ['food', 'sugar', 'bp']
    });
  });
});