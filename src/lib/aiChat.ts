export const AI_SYSTEM_PROMPT = `You are a concise health-tracking assistant. Reply like a knowledgeable friend texting back — short, direct, no fluff.

Rules:
- 1–4 sentences max per reply (as chat assistant) unless the user explicitly asks for more detail.
- No bullet walls, no long preambles, no "Great question!" filler.
- Stay calm and practical; never catastrophise.
- Suggest a doctor or test only when genuinely warranted, not as a reflex.
- This is general wellness guidance, not medical advice.`;

export const AI_PROVIDER_OPTIONS = [
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'openai', label: 'OpenAI (ChatGPT)' }
] as const;

export const AI_MODELS_BY_PROVIDER = {
  deepseek: ['deepseek-chat', 'deepseek-reasoner'],
  openai: ['gpt-4o', 'gpt-4o-mini']
} as const;

export type AiProvider = keyof typeof AI_MODELS_BY_PROVIDER;
export type AiModel = (typeof AI_MODELS_BY_PROVIDER)[AiProvider][number];
export type AiRole = 'user' | 'assistant';

export type AiChatMessage = {
  role: AiRole;
  content: string;
};

type ChatRequestParams = {
  apiKey: string;
  provider: AiProvider;
  model: AiModel;
  messages: AiChatMessage[];
};

type OpenAiMessage = {
  role: 'system' | AiRole;
  content: string;
};

export type ChatCompletionResponse = {
  error?: {
    message?: string;
  };
  choices?: Array<{
    message?: {
      content?: string | Array<{ type?: string; text?: string }>;
    };
  }>;
};

export function getModelsForProvider(provider: AiProvider) {
  return [...AI_MODELS_BY_PROVIDER[provider]];
}

export function getDefaultModelForProvider(provider: AiProvider) {
  return AI_MODELS_BY_PROVIDER[provider][0];
}

export function getApiKeyLabel(provider: AiProvider) {
  return provider === 'deepseek' ? 'DeepSeek API key' : 'OpenAI API key';
}

export function getApiEndpoint(provider: AiProvider) {
  return provider === 'deepseek'
    ? 'https://api.deepseek.com/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
}

export function buildChatCompletionRequest({ apiKey, provider, model, messages }: ChatRequestParams) {
  const payloadMessages: OpenAiMessage[] = [
    { role: 'system', content: AI_SYSTEM_PROMPT },
    ...messages.map((message) => ({ role: message.role, content: message.content }))
  ];

  return {
    url: getApiEndpoint(provider),
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: payloadMessages,
        stream: false
      })
    }
  };
}

export function parseChatCompletionResponse(payload: unknown) {
  const typedPayload = payload as ChatCompletionResponse;
  const content = typedPayload.choices?.[0]?.message?.content;

  if (typeof content === 'string') {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .filter((part) => typeof part.text === 'string' && part.text.trim().length > 0)
      .map((part) => part.text!.trim())
      .join('\n')
      .trim();
  }

  return '';
}

export function getApiErrorMessage(status: number, payload: unknown) {
  if (typeof payload === 'object' && payload !== null && 'error' in payload) {
    const error = (payload as ChatCompletionResponse).error;

    if (error?.message) {
      return error.message;
    }
  }

  if (status === 401) {
    return 'Authentication failed. Check that the API key matches the selected provider.';
  }

  if (status === 429) {
    return 'The provider rejected the request due to rate limits or quota. Try again later.';
  }

  return 'The AI provider request failed. Check the selected model, API key, and browser network access.';
}