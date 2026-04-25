import { AI_PROVIDER_OPTIONS, getModelsForProvider, type AiModel, type AiProvider } from '../../lib/aiChat';

type ModelSelectorProps = {
  provider: AiProvider | '';
  model: AiModel | '';
  onProviderChange: (value: AiProvider | '') => void;
  onModelChange: (value: AiModel | '') => void;
  disabled?: boolean;
};

export function ModelSelector({
  provider,
  model,
  onProviderChange,
  onModelChange,
  disabled = false
}: ModelSelectorProps) {
  const models = provider ? getModelsForProvider(provider) : [];

  return (
    <section className="form-card ai-chat-config-card" aria-labelledby="ai-chat-model-settings">
      <div className="section-header-inline">
        <div>
          <h2 id="ai-chat-model-settings">Model Settings</h2>
          <p>Choose a provider first, then select the model to use for this chat.</p>
        </div>
      </div>
      <div className="three-column-grid ai-chat-config-grid">
        <label className="date-time-picker__field">
          <span>Provider</span>
          <select
            className="form-select"
            aria-label="Provider"
            value={provider}
            onChange={(event) => onProviderChange(event.target.value as AiProvider | '')}
            disabled={disabled}
          >
            <option value="">Choose provider</option>
            {AI_PROVIDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="date-time-picker__field">
          <span>Model</span>
          <select
            className="form-select"
            aria-label="Model"
            value={model}
            onChange={(event) => onModelChange(event.target.value as AiModel | '')}
            disabled={!provider || disabled}
          >
            <option value="">{provider ? 'Choose model' : 'Select provider first'}</option>
            {models.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="tag-selector__selected-summary">
        Switching provider clears the API key and conversation. Switching model resets the chat so the next reply uses the new model cleanly.
      </p>
    </section>
  );
}