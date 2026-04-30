import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { BpReadingForm } from './bp/BpReadingForm';
import { FoodReadingForm } from './food/FoodReadingForm';
import { SugarReadingForm } from './sugar/SugarReadingForm';
import { WeightReadingForm } from './weight/WeightReadingForm';
import { DEFAULT_SETTINGS, createDefaultBpTags, createDefaultFoodTags, createDefaultTags, createDefaultWeightTags } from '../lib/defaults';
import { createFoodDraft } from '../lib/foodUtils';
import { createBpDraft, createReadingDraft, createWeightDraft } from '../lib/readingUtils';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('Reading forms', () => {
  it('allows saving a sugar reading with no tags selected', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithRouter(
      <SugarReadingForm
        title="Add sugar"
        submitLabel="Save"
        initialValue={createReadingDraft(new Date('2026-04-29T12:00:00.000Z'))}
        tags={createDefaultTags('2026-04-29T12:00:00.000Z')}
        readings={[]}
        settings={DEFAULT_SETTINGS}
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText('Reading value *'), '108');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].tagIds).toEqual([]);
  });

  it('allows saving a weight reading with no tags selected', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithRouter(
      <WeightReadingForm
        title="Add weight"
        submitLabel="Save"
        initialValue={createWeightDraft(new Date('2026-04-29T12:00:00.000Z'))}
        tags={createDefaultWeightTags('2026-04-29T12:00:00.000Z')}
        readings={[]}
        settings={DEFAULT_SETTINGS}
        onSubmit={onSubmit}
        listPath="/weight"
      />
    );

    await user.type(screen.getByLabelText('Weight (kg) *'), '78.5');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].tagIds).toEqual([]);
  });

  it('allows saving a blood pressure reading with no tags selected', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithRouter(
      <BpReadingForm
        title="Add BP"
        submitLabel="Save"
        initialValue={createBpDraft(new Date('2026-04-29T12:00:00.000Z'))}
        tags={createDefaultBpTags('2026-04-29T12:00:00.000Z')}
        readings={[]}
        settings={DEFAULT_SETTINGS}
        onSubmit={onSubmit}
        listPath="/bp"
      />
    );

    await user.type(screen.getByLabelText('Systolic *'), '120');
    await user.type(screen.getByLabelText('Diastolic *'), '80');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].tagIds).toEqual([]);
  });

  it('rejects an invalid blood pressure combination', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithRouter(
      <BpReadingForm
        title="Add BP"
        submitLabel="Save"
        initialValue={createBpDraft(new Date('2026-04-29T12:00:00.000Z'))}
        tags={createDefaultBpTags('2026-04-29T12:00:00.000Z')}
        readings={[]}
        settings={DEFAULT_SETTINGS}
        onSubmit={onSubmit}
        listPath="/bp"
      />
    );

    await user.type(screen.getByLabelText('Systolic *'), '110');
    await user.type(screen.getByLabelText('Diastolic *'), '120');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Diastolic must be lower than systolic.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects a blank food meal name', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithRouter(
      <FoodReadingForm
        title="Add food"
        submitLabel="Save"
        initialValue={createFoodDraft(new Date('2026-04-29T12:00:00.000Z'))}
        tags={createDefaultFoodTags('2026-04-29T12:00:00.000Z')}
        readings={[]}
        settings={DEFAULT_SETTINGS}
        onSubmit={onSubmit}
        listPath="/food"
      />
    );

    await user.type(screen.getByLabelText('Calories *'), '250');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Meal name is required.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects control characters in a food meal name', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithRouter(
      <FoodReadingForm
        title="Add food"
        submitLabel="Save"
        initialValue={createFoodDraft(new Date('2026-04-29T12:00:00.000Z'))}
        tags={createDefaultFoodTags('2026-04-29T12:00:00.000Z')}
        readings={[]}
        settings={DEFAULT_SETTINGS}
        onSubmit={onSubmit}
        listPath="/food"
      />
    );

    fireEvent.change(screen.getByLabelText('Meal name *'), { target: { value: 'Bad\u0007Meal' } });
    await user.type(screen.getByLabelText('Calories *'), '250');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Meal name cannot contain control characters.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});