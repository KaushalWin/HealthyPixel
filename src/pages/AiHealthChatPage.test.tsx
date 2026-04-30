import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEYS } from '../lib/defaults';
import { AiHealthChatExperience } from './AiHealthChatPage';

function createJsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function configureChat(user: ReturnType<typeof userEvent.setup>, provider: string, model: string, apiKey: string) {
  await user.selectOptions(screen.getAllByLabelText('Provider')[0], provider);
  await user.selectOptions(screen.getByLabelText('Model'), model);
  await user.type(
    screen.getByLabelText(provider === 'deepseek' ? 'DeepSeek API key' : 'OpenAI API key'),
    apiKey
  );
}

describe('AiHealthChatExperience', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('updates the model dropdown and API key label based on provider selection', async () => {
    const user = userEvent.setup();
    render(<AiHealthChatExperience />);

    const modelSelect = screen.getByLabelText('Model');
    expect(modelSelect).toBeDisabled();
    expect(screen.queryByLabelText('DeepSeek API key')).not.toBeInTheDocument();

    await user.selectOptions(screen.getAllByLabelText('Provider')[0], 'deepseek');
    expect(modelSelect).not.toBeDisabled();

    await user.selectOptions(modelSelect, 'deepseek-reasoner');
    expect(screen.getByLabelText('DeepSeek API key')).toBeInTheDocument();
  });

  it('keeps the composer disabled until provider, model, and API key are ready', async () => {
    const user = userEvent.setup();
    render(<AiHealthChatExperience />);

    const messageField = screen.getByLabelText('Message');
    expect(messageField).toBeDisabled();

    await user.selectOptions(screen.getAllByLabelText('Provider')[0], 'openai');
    await user.selectOptions(screen.getByLabelText('Model'), 'gpt-4o');
    expect(messageField).toBeDisabled();

    await user.type(screen.getByLabelText('OpenAI API key'), 'sk-openai');
    expect(messageField).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();

    await user.type(messageField, 'How should I track a mild fever?');
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
  });

  it('shows Thinking while waiting, then renders the assistant reply', async () => {
    const user = userEvent.setup();
    let resolveFetch!: (value: Response) => void;
    const fetchMock = vi.fn().mockImplementation(
      () => new Promise<Response>((resolve) => {
        resolveFetch = resolve;
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    render(<AiHealthChatExperience />);

    await configureChat(user, 'deepseek', 'deepseek-chat', 'deepseek-key');
    await user.type(screen.getByLabelText('Message'), 'I feel a little dehydrated.');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(screen.getByText('Thinking...')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.deepseek.com/chat/completions',
      expect.objectContaining({ method: 'POST' })
    );

    resolveFetch(createJsonResponse({ choices: [{ message: { content: 'Start with water and rest.' } }] }));

    expect(await screen.findByText('Start with water and rest.')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
    });
  });

  it('renders provider API errors', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createJsonResponse({ error: { message: 'Invalid API key.' } }, 401)
      )
    );

    render(<AiHealthChatExperience />);

    await configureChat(user, 'openai', 'gpt-4o-mini', 'bad-key');
    await user.type(screen.getByLabelText('Message'), 'Please help me brainstorm questions for my doctor.');
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('Invalid API key.')).toBeInTheDocument();
  });

  it('clears the chat transcript on demand', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createJsonResponse({ choices: [{ message: { content: 'Track the symptom timing for a day.' } }] })
      )
    );

    render(<AiHealthChatExperience />);

    await configureChat(user, 'openai', 'gpt-4o', 'sk-openai');
    await user.type(screen.getByLabelText('Message'), 'How do I track headaches better?');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(await screen.findByText('Track the symptom timing for a day.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear chat' }));
    expect(screen.queryByText('Track the symptom timing for a day.')).not.toBeInTheDocument();
    expect(screen.getByText('No messages yet.')).toBeInTheDocument();
  });

  it('resets the conversation when the model changes and keeps the key in memory', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createJsonResponse({ choices: [{ message: { content: 'Monitor the symptom and rest.' } }] })
      )
    );

    render(<AiHealthChatExperience />);

    await configureChat(user, 'openai', 'gpt-4o', 'sk-openai');
    await user.type(screen.getByLabelText('Message'), 'I feel run down.');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(await screen.findByText('Monitor the symptom and rest.')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Model'), 'gpt-4o-mini');
    expect(screen.queryByText('Monitor the symptom and rest.')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('sk-openai')).toBeInTheDocument();
    expect(screen.getByText('No messages yet.')).toBeInTheDocument();
  });

  it('keeps the API key memory-only unless save is clicked', async () => {
    const user = userEvent.setup();
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        createJsonResponse({ choices: [{ message: { content: 'Log your hydration and urine color.' } }] })
      )
    );

    render(<AiHealthChatExperience />);

    await configureChat(user, 'deepseek', 'deepseek-reasoner', 'deepseek-key');
    await user.type(screen.getByLabelText('Message'), 'What should I pay attention to for hydration?');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    await screen.findByText('Log your hydration and urine color.');

    expect(window.localStorage.getItem(STORAGE_KEYS.aiDeepSeekApiKey)).toBeNull();
    expect(setItemSpy).not.toHaveBeenCalledWith(STORAGE_KEYS.aiDeepSeekApiKey, expect.any(String));
  });

  it('saves and reloads a provider key only after explicit save', async () => {
    const user = userEvent.setup();
    render(<AiHealthChatExperience />);

    await configureChat(user, 'openai', 'gpt-4o', 'sk-openai');
    await user.click(screen.getByRole('button', { name: 'Save in this browser' }));

    expect(window.localStorage.getItem(STORAGE_KEYS.aiOpenAiApiKey)).toBe('sk-openai');

    await user.selectOptions(screen.getAllByLabelText('Provider')[0], 'deepseek');
    await user.selectOptions(screen.getAllByLabelText('Provider')[0], 'openai');
    await user.selectOptions(screen.getByLabelText('Model'), 'gpt-4o-mini');

    expect(screen.getByDisplayValue('sk-openai')).toBeInTheDocument();
    expect(screen.getByText('Saved key loaded from this browser for the selected provider.')).toBeInTheDocument();
  });

  it('clears the saved provider key from local browser storage', async () => {
    const user = userEvent.setup();
    render(<AiHealthChatExperience />);

    await configureChat(user, 'openai', 'gpt-4o', 'sk-openai');
    await user.click(screen.getByRole('button', { name: 'Save in this browser' }));
    expect(window.localStorage.getItem(STORAGE_KEYS.aiOpenAiApiKey)).toBe('sk-openai');

    await user.click(screen.getByRole('button', { name: 'Clear saved key' }));

    expect(window.localStorage.getItem(STORAGE_KEYS.aiOpenAiApiKey)).toBeNull();
    expect(screen.getByLabelText('OpenAI API key')).toHaveValue('');
  });
});


