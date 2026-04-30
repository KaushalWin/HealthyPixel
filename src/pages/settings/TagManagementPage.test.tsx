import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppDataProvider } from '../../context/AppDataContext';
import { STORAGE_KEYS } from '../../lib/defaults';
import { TagManagementPage } from './TagManagementPage';

function renderTagManagementPage() {
  return render(
    <MemoryRouter>
      <AppDataProvider>
        <TagManagementPage />
      </AppDataProvider>
    </MemoryRouter>
  );
}

describe('TagManagementPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('rejects duplicate food labels within the same category', async () => {
    const user = userEvent.setup();
    renderTagManagementPage();

    await user.click(screen.getByRole('tab', { name: 'Food' }));
    await user.type(screen.getByLabelText('Label'), 'Healthy');
    await user.selectOptions(screen.getByLabelText('Category'), 'planned');
    await user.click(screen.getByRole('button', { name: 'Add tag' }));

    expect(screen.getByText('Food tag labels must be unique within the selected category.')).toBeInTheDocument();

    const foodTags = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.foodTags) ?? '[]') as Array<{ label: string; category: string }>;
    expect(foodTags.filter((tag) => tag.label === 'Healthy' && tag.category === 'planned')).toHaveLength(1);
  });

  it('allows the same food label in a different category', async () => {
    const user = userEvent.setup();
    renderTagManagementPage();

    await user.click(screen.getByRole('tab', { name: 'Food' }));
    await user.type(screen.getByLabelText('Label'), 'Healthy');
    await user.selectOptions(screen.getByLabelText('Category'), 'actual');
    await user.click(screen.getByRole('button', { name: 'Add tag' }));

    await waitFor(() => {
      const foodTags = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.foodTags) ?? '[]') as Array<{ label: string; category: string }>;
      expect(foodTags.filter((tag) => tag.label === 'Healthy')).toHaveLength(2);
      expect(foodTags.some((tag) => tag.label === 'Healthy' && tag.category === 'actual')).toBe(true);
    });

    expect(screen.queryByText('Food tag labels must be unique within the selected category.')).not.toBeInTheDocument();
  });
});