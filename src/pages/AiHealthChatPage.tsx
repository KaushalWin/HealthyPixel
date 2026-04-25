import { useState } from 'react';
import { ApiKeyInput } from '../components/ai/ApiKeyInput';
import { ChatWindow, type ChatWindowMessage } from '../components/ai/ChatWindow';
import { ModelSelector } from '../components/ai/ModelSelector';
import { SiteShell } from '../components/SiteShell';
import {
  buildChatCompletionRequest,
  getApiErrorMessage,
  parseChatCompletionResponse,
  type AiModel,
  type AiProvider
} from '../lib/aiChat';
import { createStableId } from '../lib/platform';

function getComposerDisabledReason(provider: AiProvider | '', model: AiModel | '', apiKey: string) {
  if (!provider) {
    return 'Choose a provider to unlock the model list.';
  }

  if (!model) {
    return 'Choose a model before adding an API key.';
  }

  if (apiKey.trim().length === 0) {
    return 'Add the provider API key to unlock the chat composer.';
  }

  return 'Type a message to begin the conversation.';
}

export function AiHealthChatExperience() {
  const [provider, setProvider] = useState<AiProvider | ''>('');
  const [model, setModel] = useState<AiModel | ''>('');
  // Frontend-only API keys are intentionally kept in memory only. This avoids persistence,
  // but any browser-exposed key is still not production-secure for a production app.
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState<ChatWindowMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const inputDisabled = !provider || !model || apiKey.trim().length === 0 || isLoading;
  const disabledReason = getComposerDisabledReason(provider, model, apiKey);

  const handleProviderChange = (nextProvider: AiProvider | '') => {
    setProvider(nextProvider);
    setModel('');
    setApiKey('');
    setMessages([]);
    setDraft('');
    setErrorMessage(null);
    setIsLoading(false);
  };

  const handleModelChange = (nextModel: AiModel | '') => {
    setModel(nextModel);
    setMessages([]);
    setDraft('');
    setErrorMessage(null);
    setIsLoading(false);
  };

  const handleClearChat = () => {
    setMessages([]);
    setDraft('');
    setErrorMessage(null);
  };

  const handleSend = async () => {
    const trimmedDraft = draft.trim();

    if (!provider || !model || apiKey.trim().length === 0 || trimmedDraft.length === 0 || isLoading) {
      return;
    }

    const nextMessages: ChatWindowMessage[] = [
      ...messages,
      { id: createStableId(), role: 'user', content: trimmedDraft }
    ];

    setMessages(nextMessages);
    setDraft('');
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const { url, init } = buildChatCompletionRequest({
        apiKey: apiKey.trim(),
        provider,
        model,
        messages: nextMessages.map(({ role, content }) => ({ role, content }))
      });
      const response = await fetch(url, init);

      let payload: unknown = null;

      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(getApiErrorMessage(response.status, payload));
      }

      const assistantMessage = parseChatCompletionResponse(payload);

      if (!assistantMessage) {
        throw new Error('The AI provider returned an empty reply. Try again or switch models.');
      }

      setMessages([
        ...nextMessages,
        { id: createStableId(), role: 'assistant', content: assistantMessage }
      ]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'The AI request failed unexpectedly. Check your API key and network access.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-stack">
      <article className="doc-card ai-chat-disclaimer" aria-label="Medical disclaimer">
        <p className="date-time-picker__eyebrow">Medical Disclaimer</p>
        <p>
          ⚠️ This tool is NOT medical advice. It is for general guidance and brainstorming only. Always consult a qualified doctor for medical concerns.
        </p>
      </article>

      <article className="doc-card ai-chat-disclaimer ai-chat-disclaimer--secondary" aria-label="Privacy note">
        <p className="date-time-picker__eyebrow">Privacy Note</p>
        <p>
          PixieTrack does not store your API key or chat transcript. If you use this page, the message content you type is sent directly from your browser to the AI provider you selected.
        </p>
      </article>

      <ModelSelector
        provider={provider}
        model={model}
        onProviderChange={handleProviderChange}
        onModelChange={handleModelChange}
      />

      {provider && model ? (
        <ApiKeyInput provider={provider} value={apiKey} onChange={setApiKey} />
      ) : null}

      <ChatWindow
        messages={messages}
        draft={draft}
        onDraftChange={setDraft}
        onSend={handleSend}
        onClearChat={handleClearChat}
        isLoading={isLoading}
        errorMessage={errorMessage}
        inputDisabled={inputDisabled}
        disabledReason={disabledReason}
      />

      <p className="ai-chat-credit">Developed by Krisha Khamar</p>
    </section>
  );
}

export function AiHealthChatPage() {
  return (
    <SiteShell
      title="AI Health Chat"
      subtitle="Client-side wellness brainstorming with your own OpenAI or DeepSeek API key."
    >
      <AiHealthChatExperience />
    </SiteShell>
  );
}