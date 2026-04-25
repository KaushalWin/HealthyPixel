import { describe, expect, it } from 'vitest';
import {
  AI_SYSTEM_PROMPT,
  buildChatCompletionRequest,
  getApiErrorMessage,
  getApiKeyLabel,
  getDefaultModelForProvider,
  getModelsForProvider,
  parseChatCompletionResponse
} from './aiChat';

describe('aiChat utility', () => {
  it('returns provider-specific models and labels', () => {
    expect(getModelsForProvider('deepseek')).toEqual(['deepseek-chat', 'deepseek-reasoner']);
    expect(getModelsForProvider('openai')).toEqual(['gpt-4o', 'gpt-4o-mini']);
    expect(getDefaultModelForProvider('deepseek')).toBe('deepseek-chat');
    expect(getApiKeyLabel('openai')).toBe('OpenAI API key');
  });

  it('builds an OpenAI-compatible request with the fixed system prompt', () => {
    const request = buildChatCompletionRequest({
      apiKey: 'test-key',
      provider: 'deepseek',
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: 'I have a headache.' },
        { role: 'assistant', content: 'When did it start?' }
      ]
    });

    expect(request.url).toBe('https://api.deepseek.com/chat/completions');
    expect(request.init.method).toBe('POST');
    expect(request.init.headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-key'
    });

    expect(JSON.parse(request.init.body)).toEqual({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        { role: 'user', content: 'I have a headache.' },
        { role: 'assistant', content: 'When did it start?' }
      ],
      stream: false
    });
  });

  it('parses assistant text from string and structured content payloads', () => {
    expect(
      parseChatCompletionResponse({
        choices: [{ message: { content: 'Stay hydrated and rest.' } }]
      })
    ).toBe('Stay hydrated and rest.');

    expect(
      parseChatCompletionResponse({
        choices: [
          {
            message: {
              content: [
                { type: 'output_text', text: 'Track symptoms for a day.' },
                { type: 'output_text', text: 'Consider a doctor if it persists.' }
              ]
            }
          }
        ]
      })
    ).toBe('Track symptoms for a day.\nConsider a doctor if it persists.');
  });

  it('prefers provider error payloads and falls back to friendly status messaging', () => {
    expect(getApiErrorMessage(400, { error: { message: 'Bad request from provider.' } })).toBe(
      'Bad request from provider.'
    );
    expect(getApiErrorMessage(401, {})).toBe(
      'Authentication failed. Check that the API key matches the selected provider.'
    );
    expect(getApiErrorMessage(429, null)).toBe(
      'The provider rejected the request due to rate limits or quota. Try again later.'
    );
  });
});