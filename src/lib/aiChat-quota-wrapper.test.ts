/**
 * aiChat-quota-wrapper.test.ts
 *
 * Tests for the HealthyPixel AI quota wrapper.
 * Run: npx vitest run src/lib/aiChat-quota-wrapper.test.ts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  callAiApi,
  isApiEnabled,
  isQuotaExceeded,
  getMonitoringSummary,
  _resetState,
} from './aiChat-quota-wrapper';

// ==================== MOCK SETUP ====================

// Mock localStorage for Node/jsdom environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

function mockFetch(status: number, body: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  }));
}

// ==================== TESTS ====================

describe('AI quota wrapper — HealthyPixel', () => {

  beforeEach(() => {
    _resetState();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // 1. Kill switch
  it('blocks all API calls when AI API is disabled', async () => {
    // Simulate kill switch by patching isApiEnabled
    vi.spyOn({ isApiEnabled } as any, 'isApiEnabled').mockReturnValue(false);

    // We test the actual env pathway by writing to localStorage
    localStorage.setItem('aiApiEnabled', 'false');
    mockFetch(200, { choices: [{ message: { content: 'hi' } }] });

    // Should throw because kill switch is active
    await expect(
      callAiApi('deepseek', 'https://api.deepseek.com/chat/completions',
        { model: 'deepseek-chat', messages: [] },
        { apiKey: 'sk-test' })
    ).rejects.toThrow(/disabled/i);
  });

  // 2. Daily quota exceeded
  it('blocks requests when daily quota is reached', async () => {
    // Manually set quota to max in localStorage
    const today = new Date().toISOString().split('T')[0];
    const fullState = {
      date: today,
      count: 100,
      requests: [],
      lastError: '',
    };
    localStorage.setItem('aiQuotaState', JSON.stringify(fullState));

    mockFetch(200, { choices: [{ message: { content: 'hi' } }] });

    await expect(
      callAiApi('deepseek', 'https://api.deepseek.com/chat/completions',
        { model: 'deepseek-chat', messages: [] },
        { apiKey: 'sk-test' })
    ).rejects.toThrow(/quota/i);
  });

  // 3. Counter increments on success
  it('increments daily counter after successful API call', async () => {
    mockFetch(200, { choices: [{ message: { content: 'hello' } }] });

    const before = getMonitoringSummary().used;

    await callAiApi('deepseek', 'https://api.deepseek.com/chat/completions',
      { model: 'deepseek-chat', messages: [{ role: 'user', content: 'q1' }] },
      { apiKey: 'sk-test', skipCache: true });

    const after = getMonitoringSummary().used;
    expect(after).toBe(before + 1);
  });

  // 4. Per-minute throttle
  it('blocks burst requests exceeding per-minute limit', async () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    // Set 5 recent requests in the last minute
    const state = {
      date: today,
      count: 5,
      requests: Array(5).fill({
        timestamp: now,
        provider: 'deepseek',
        project: 'test',
        status: 'success',
      }),
      lastError: '',
    };
    localStorage.setItem('aiQuotaState', JSON.stringify(state));

    mockFetch(200, { choices: [{ message: { content: 'hi' } }] });

    await expect(
      callAiApi('deepseek', 'https://api.deepseek.com/chat/completions',
        { model: 'deepseek-chat', messages: [] },
        { apiKey: 'sk-test' })
    ).rejects.toThrow(/rate limit|too many/i);
  });

  // 5. Cache hit — no real fetch
  it('returns cached response for identical requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ choices: [{ message: { content: 'cached' } }] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const payload = { model: 'deepseek-chat', messages: [{ role: 'user', content: 'same' }] };

    await callAiApi('deepseek', 'https://api.deepseek.com/chat/completions', payload, { apiKey: 'sk-test' });
    await callAiApi('deepseek', 'https://api.deepseek.com/chat/completions', payload, { apiKey: 'sk-test' });

    expect(fetchMock).toHaveBeenCalledTimes(1); // Second call should hit cache
  });

  // 6. skipCache bypasses cache
  it('skipCache=true forces a fresh API call', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ choices: [{ message: { content: 'fresh' } }] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const payload = { model: 'deepseek-chat', messages: [{ role: 'user', content: 'same' }] };

    await callAiApi('deepseek', 'https://api.deepseek.com/chat/completions', payload, { apiKey: 'sk-test' });
    await callAiApi('deepseek', 'https://api.deepseek.com/chat/completions', payload, { apiKey: 'sk-test', skipCache: true });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  // 7. 4xx error propagates without retry
  it('does not retry on 4xx errors', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: () => Promise.resolve({ error: { message: 'Invalid API key' } }),
      text: () => Promise.resolve('{"error":{"message":"Invalid API key"}}'),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      callAiApi('deepseek', 'https://api.deepseek.com/chat/completions',
        { model: 'deepseek-chat', messages: [] },
        { apiKey: 'bad-key', skipCache: true })
    ).rejects.toThrow();

    expect(fetchMock).toHaveBeenCalledTimes(1); // no retry
  });

  // 8. isQuotaExceeded returns false when under limit
  it('isQuotaExceeded returns false when under daily limit', () => {
    expect(isQuotaExceeded()).toBe(false);
  });

  // 9. isQuotaExceeded returns true when at limit
  it('isQuotaExceeded returns true when daily limit reached', () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('aiQuotaState', JSON.stringify({
      date: today, count: 100, requests: [], lastError: '',
    }));

    expect(isQuotaExceeded()).toBe(true);
  });

  // 10. Monitoring summary is correct
  it('getMonitoringSummary returns correct daily usage', async () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('aiQuotaState', JSON.stringify({
      date: today, count: 23, requests: [], lastError: '',
    }));

    const summary = getMonitoringSummary();
    expect(summary.used).toBe(23);
    expect(summary.remaining).toBe(77);
    expect(summary.dailyLimit).toBe(100);
  });
});
