import { getApiKeyLabel, type AiProvider } from '../../lib/aiChat';

type ApiKeyInputProps = {
  provider: AiProvider;
  value: string;
  onChange: (value: string) => void;
  onSaveLocally: () => void;
  onClearSavedKey: () => void;
  hasSavedKey: boolean;
  statusMessage?: string | null;
  disabled?: boolean;
};

export function ApiKeyInput({ provider, value, onChange, onSaveLocally, onClearSavedKey, hasSavedKey, statusMessage = null, disabled = false }: ApiKeyInputProps) {
  const label = getApiKeyLabel(provider);

  return (
    <section className="form-card ai-chat-config-card" aria-labelledby="ai-chat-api-key-heading">
      <div className="section-header-inline">
        <div>
          <h2 id="ai-chat-api-key-heading">API Key</h2>
          <p>The key stays in memory unless you explicitly save it in this browser for this provider.</p>
        </div>
      </div>
      <label className="date-time-picker__field ai-chat-api-key-field">
        <span>{label}</span>
        <input
          type="password"
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`Paste ${label}`}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          disabled={disabled}
        />
      </label>
      <div className="action-row compact ai-chat-api-key-actions">
        <button
          type="button"
          className="secondary-button small"
          onClick={onSaveLocally}
          disabled={disabled || value.trim().length === 0}
        >
          Save in this browser
        </button>
        {hasSavedKey ? (
          <button
            type="button"
            className="secondary-button danger small"
            onClick={onClearSavedKey}
            disabled={disabled}
          >
            Clear saved key
          </button>
        ) : null}
      </div>
      <p className="field-error ai-chat-api-key-warning">
        Warning: saving stores this key in your browser data on this device. PixieTrack does not store, back up, or sync this key on our side.
      </p>
      <p className="tag-selector__selected-summary">
        {hasSavedKey
          ? 'A saved key exists for this provider in this browser.'
          : 'No saved key for this provider. The field is memory-only until you save it.'}
      </p>
      {statusMessage ? <p className="tag-selector__selected-summary">{statusMessage}</p> : null}
      <p className="tag-selector__selected-summary">
        PixieTrack does not persist or proxy this key. Requests go directly from your browser to the selected provider.
      </p>
    </section>
  );
}