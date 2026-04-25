import { useEffect, useRef } from 'react';
import type { AiRole } from '../../lib/aiChat';
import { MessageBubble } from './MessageBubble';

export type ChatWindowMessage = {
  id: string;
  role: AiRole;
  content: string;
};

type ChatWindowProps = {
  messages: ChatWindowMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onClearChat: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  inputDisabled: boolean;
  disabledReason: string;
};

export function ChatWindow({
  messages,
  draft,
  onDraftChange,
  onSend,
  onClearChat,
  isLoading,
  errorMessage,
  inputDisabled,
  disabledReason
}: ChatWindowProps) {
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const hasConversationState = messages.length > 0 || draft.trim().length > 0 || Boolean(errorMessage);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoading, errorMessage]);

  return (
    <section className="list-card ai-chat-shell" aria-labelledby="ai-chat-conversation-heading">
      <div className="section-header-inline">
        <div>
          <h2 id="ai-chat-conversation-heading">Conversation</h2>
          <p>Use your own provider key. The message history stays in this tab only.</p>
        </div>
        <div className="action-row compact">
          <button
            type="button"
            className="secondary-button"
            onClick={onClearChat}
            disabled={!hasConversationState || isLoading}
          >
            Clear chat
          </button>
        </div>
      </div>

      <div className="ai-chat-transcript" aria-live="polite">
        {messages.length === 0 ? (
          <div className="empty-state ai-chat-empty-state">
            <strong>No messages yet.</strong>
            <p>{inputDisabled ? disabledReason : 'Start with a question about symptoms, hydration, sleep, readings, or wellness tracking.'}</p>
          </div>
        ) : null}

        {messages.map((message) => (
          <MessageBubble key={message.id} role={message.role} content={message.content} />
        ))}

        {isLoading ? <MessageBubble role="assistant" content="Thinking..." isLoading /> : null}
        <div ref={transcriptEndRef} />
      </div>

      {errorMessage ? (
        <p className="field-error ai-chat-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <form
        className="ai-chat-composer"
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
      >
        <label className="date-time-picker__field">
          <span>Message</span>
          <textarea
            className="form-textarea ai-chat-textarea"
            aria-label="Message"
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            disabled={inputDisabled}
            placeholder={inputDisabled ? disabledReason : 'Describe your health question or what you want to brainstorm.'}
          />
        </label>

        <div className="action-row">
          <button
            type="submit"
            className="primary-button"
            disabled={inputDisabled || draft.trim().length === 0 || isLoading}
          >
            Send
          </button>
          <span className="tag-selector__selected-summary ai-chat-runtime-note">
            When you send a message, PixieTrack sends only this chat directly to the selected AI provider.
          </span>
        </div>
      </form>
    </section>
  );
}