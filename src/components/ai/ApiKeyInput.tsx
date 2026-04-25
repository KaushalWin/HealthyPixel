import { getApiKeyLabel, type AiProvider } from '../../lib/aiChat';

type ApiKeyInputProps = {
  provider: AiProvider;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function ApiKeyInput({ provider, value, onChange, disabled = false }: ApiKeyInputProps) {
  const label = getApiKeyLabel(provider);

  return (
    <section className="form-card ai-chat-config-card" aria-labelledby="ai-chat-api-key-heading">
      <div className="section-header-inline">
        <div>
          <h2 id="ai-chat-api-key-heading">API Key</h2>
          <p>The key stays in memory only for this page session and is cleared on reload.</p>
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
      <p className="tag-selector__selected-summary">
        PixieTrack does not persist or proxy this key. Requests go directly from your browser to the selected provider.
      </p>
    </section>
  );
}