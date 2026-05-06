/**
 * aiChat-quota-wrapper.ts
 *
 * CENTRALIZED API SAFETY WRAPPER FOR REACT/TYPESCRIPT
 *
 * Enforces strict safeguards on AI API calls from HealthyPixel:
 * - Daily quota limit (hard stop)
 * - Per-minute request throttling (5 req/min max)
 * - Request caching (deduplicate identical requests)
 * - Monitoring and logging
 * - Emergency kill switch
 * - Loop detection
 *
 * Usage:
 *   const result = await quotaWrapper.callAiApi(provider, endpoint, payload, options);
 *
 * IMPORTANT: All AI API calls MUST go through this wrapper!
 */

// No Node.js crypto import — we use the browser-native Web Crypto API (window.crypto.subtle)

// ==================== TYPES ====================

export interface QuotaState {
  date: string;
  count: number;
  requests: RequestLog[];
  lastError: string;
}

export interface RequestLog {
  timestamp: string;
  provider: string;
  project: string;
  status: 'success' | 'error';
}

export interface CacheEntry {
  timestamp: string;
  response: unknown;
  hits: number;
}

export interface CallOptions {
  apiKey: string;
  project?: string;
  skipCache?: boolean;
  timeout?: number;
}

// ==================== IN-MEMORY STATE ====================
// Note: For browser environment, we use localStorage + memory

let quotaState: QuotaState = {
  date: new Date().toISOString().split('T')[0],
  count: 0,
  requests: [],
  lastError: '',
};

let cache: Record<string, CacheEntry> = {};

// ==================== CONFIGURATION ====================

const CONFIG = {
  DAILY_REQUEST_LIMIT: parseInt(
    typeof window !== 'undefined' ? 
    new URLSearchParams(window.location.search).get('aiQuotaDaily') || '100' :
    process.env.REACT_APP_AI_QUOTA_DAILY || '100'
  ),

  PER_MINUTE_LIMIT: 50,// changed manually by used (not ai)
  CACHE_TTL: 3600, // 1 hour (seconds)
  ENABLED: (typeof window !== 'undefined' ? 
    sessionStorage.getItem('aiApiEnabled') !== 'false' :
    process.env.REACT_APP_AI_API_ENABLED !== 'false'),
  LOOP_DETECTION_THRESHOLD: 10,
};

// ==================== STORAGE ====================

/**
 * Load quota state from localStorage
 */
function loadQuotaState(): QuotaState {
  try {
    const stored = localStorage.getItem('aiQuotaState');
    if (stored) {
      const data = JSON.parse(stored);
      
      // Reset if day changed
      const today = new Date().toISOString().split('T')[0];
      if (data.date !== today) {
        return {
          date: today,
          count: 0,
          requests: [],
          lastError: '',
        };
      }
      
      quotaState = data;
      return data;
    }
  } catch (err) {
    console.warn('[ApiQuota] Failed to load quota state:', err);
  }

  return {
    date: new Date().toISOString().split('T')[0],
    count: 0,
    requests: [],
    lastError: '',
  };
}

/**
 * Save quota state to localStorage
 */
function saveQuotaState(state: QuotaState): void {
  try {
    localStorage.setItem('aiQuotaState', JSON.stringify(state));
    quotaState = state;
  } catch (err) {
    console.error('[ApiQuota] Failed to save quota state:', err);
  }
}

/**
 * Load cache from localStorage
 */
function loadCache(): Record<string, CacheEntry> {
  try {
    const stored = localStorage.getItem('aiCache');
    if (stored) {
      cache = JSON.parse(stored);
      return cache;
    }
  } catch (err) {
    console.warn('[ApiQuota] Failed to load cache:', err);
  }
  return {};
}

/**
 * Save cache to localStorage
 */
function saveCache(newCache: Record<string, CacheEntry>): void {
  try {
    // Limit cache size to prevent localStorage overflow
    const entries = Object.entries(newCache);
    if (entries.length > 100) {
      // Keep only most recent 50 entries
      const sorted = entries.sort((a, b) => 
        new Date(b[1].timestamp).getTime() - new Date(a[1].timestamp).getTime()
      );
      newCache = Object.fromEntries(sorted.slice(0, 50));
    }
    
    localStorage.setItem('aiCache', JSON.stringify(newCache));
    cache = newCache;
  } catch (err) {
    console.error('[ApiQuota] Failed to save cache:', err);
  }
}

// ==================== MONITORING ====================

/**
 * Log monitoring event to console
 */
function logMonitoring(event: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [ApiQuota] ${event}`);
}

/**
 * Get monitoring summary
 */
export function getMonitoringSummary() {
  const state = loadQuotaState();
  const today = new Date().toISOString().split('T')[0];
  const used = state.count;
  const remaining = Math.max(0, CONFIG.DAILY_REQUEST_LIMIT - used);
  const cacheHits = Object.values(cache).reduce((sum, c) => sum + c.hits, 0);

  return {
    date: today,
    dailyLimit: CONFIG.DAILY_REQUEST_LIMIT,
    used,
    remaining,
    cacheHits,
    cacheSize: Object.keys(cache).length,
    providers: groupRequestsByProvider(state.requests),
  };
}

/**
 * Group requests by provider
 */
function groupRequestsByProvider(requests: RequestLog[]): Record<string, number> {
  const grouped: Record<string, number> = {};
  for (const req of requests) {
    const key = req.provider || 'unknown';
    grouped[key] = (grouped[key] || 0) + 1;
  }
  return grouped;
}

// ==================== QUOTA ENFORCEMENT ====================

/**
 * Check if API calls are enabled
 */
export function isApiEnabled(): boolean {
  return CONFIG.ENABLED;
}

/**
 * Check if daily quota is exceeded
 */
export function isQuotaExceeded(): boolean {
  const state = loadQuotaState();
  return state.count >= CONFIG.DAILY_REQUEST_LIMIT;
}

/**
 * Check per-minute rate limit
 */
function checkPerMinuteLimit(): boolean {
  const state = loadQuotaState();
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;

  const recentRequests = state.requests.filter(r => {
    const reqTime = new Date(r.timestamp).getTime();
    return reqTime > oneMinuteAgo;
  });

  return recentRequests.length >= CONFIG.PER_MINUTE_LIMIT;
}

/**
 * Detect accidental request loops
 */
function detectRequestLoops(): { detected: boolean; reason?: string } {
  const state = loadQuotaState();
  const now = Date.now();
  const fiveMinutesAgo = now - 5 * 60 * 1000;

  const recentRequests = state.requests.filter(r => {
    const reqTime = new Date(r.timestamp).getTime();
    return reqTime > fiveMinutesAgo;
  });

  if (recentRequests.length === 0) {
    return { detected: false };
  }

  const secondsDuration = (now - new Date(recentRequests[0].timestamp).getTime()) / 1000 || 1;
  const requestsPerSecond = recentRequests.length / secondsDuration;

  if (requestsPerSecond > CONFIG.LOOP_DETECTION_THRESHOLD) {
    return {
      detected: true,
      reason: `Burst detected: ${requestsPerSecond.toFixed(1)} req/sec (threshold: ${CONFIG.LOOP_DETECTION_THRESHOLD})`,
    };
  }

  return { detected: false };
}

/**
 * Increment daily request counter
 */
function incrementQuotaCounter(provider: string, project: string, status: 'success' | 'error' = 'success'): QuotaState {
  const state = loadQuotaState();
  
  state.count++;
  state.requests.push({
    timestamp: new Date().toISOString(),
    provider,
    project,
    status,
  });

  // Keep only last 1000 requests
  if (state.requests.length > 1000) {
    state.requests = state.requests.slice(-1000);
  }

  saveQuotaState(state);
  return state;
}

// ==================== CACHING ====================

/**
 * Generate cache key from request payload using the browser-native Web Crypto API.
 * Works in all modern browsers; does NOT require Node.js crypto module.
 */
async function generateCacheKey(provider: string, payload: unknown): Promise<string> {
  const text = JSON.stringify({ provider, payload });
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `${provider}:${hex.substring(0, 16)}`;
}

/**
 * Check cache for existing request
 */
async function checkCache(provider: string, payload: unknown): Promise<{ hit: boolean; response: unknown }> {
  const newCache = loadCache();
  const key = await generateCacheKey(provider, payload);
  const entry = newCache[key];

  if (!entry) {
    return { hit: false, response: null };
  }

  const age = (Date.now() - new Date(entry.timestamp).getTime()) / 1000;

  // Check TTL
  if (age > CONFIG.CACHE_TTL) {
    delete newCache[key];
    saveCache(newCache);
    return { hit: false, response: null };
  }

  // Cache hit!
  entry.hits = (entry.hits || 0) + 1;
  newCache[key] = entry;
  saveCache(newCache);

  logMonitoring(`CACHE_HIT | ${provider} | Age: ${age.toFixed(1)}s | Hits: ${entry.hits}`);

  return { hit: true, response: entry.response };
}

/**
 * Store response in cache
 */
async function storeInCache(provider: string, payload: unknown, response: unknown): Promise<void> {
  const newCache = loadCache();
  const key = await generateCacheKey(provider, payload);

  newCache[key] = {
    timestamp: new Date().toISOString(),
    response,
    hits: 0,
  };

  saveCache(newCache);
}

// ==================== MAIN API CALL WRAPPER ====================

/**
 * Make a safe AI API call
 */
export async function callAiApi(
  provider: string,
  endpoint: string,
  payload: unknown,
  options: CallOptions
): Promise<unknown> {
  const { apiKey, project = 'healthypixel', skipCache = false, timeout = 60000 } = options;

  // ===== SAFETY CHECK 1: API ENABLED? =====
  if (!isApiEnabled()) {
    logMonitoring(`BLOCKED | DISABLED | ${provider}`);
    throw new Error('AI API is currently disabled. Try again later.');
  }

  // ===== SAFETY CHECK 2: DAILY QUOTA? =====
  if (isQuotaExceeded()) {
    const state = loadQuotaState();
    logMonitoring(`BLOCKED | QUOTA_EXCEEDED | ${provider}`);
    throw new Error(
      `Daily API quota reached (${state.count}/${CONFIG.DAILY_REQUEST_LIMIT}). ` +
      `Try again tomorrow.`
    );
  }

  // ===== SAFETY CHECK 3: PER-MINUTE LIMIT? =====
  if (checkPerMinuteLimit()) {
    logMonitoring(`BLOCKED | RATE_LIMITED | ${provider}`);
    throw new Error(`Too many requests. Please wait a minute before trying again.`);
  }

  // ===== SAFETY CHECK 4: LOOP DETECTION? =====
  const loop = detectRequestLoops();
  if (loop.detected) {
    logMonitoring(`BLOCKED | LOOP_DETECTED | ${provider} | ${loop.reason}`);
    throw new Error(`Request pattern detected. Please wait before trying again.`);
  }

  // ===== SAFETY CHECK 5: CACHE? =====
  if (!skipCache) {
    const cachedResult = await checkCache(provider, payload);
    if (cachedResult.hit) {
      return cachedResult.response;
    }
  }

  // ===== VALID REQUEST: MAKE API CALL =====
  try {
    logMonitoring(`REQUEST_START | ${provider} | ${project}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = `${response.status}: ${JSON.stringify(errorData).slice(0, 200)}`;

      logMonitoring(`REQUEST_FAILED | ${provider} | ${error.slice(0, 100)}`);
      throw new Error(error);
    }

    const data = await response.json();
    const newState = incrementQuotaCounter(provider, project, 'success');
    logMonitoring(
      `REQUEST_SUCCESS | ${provider} | Daily: ${newState.count}/${CONFIG.DAILY_REQUEST_LIMIT}`
    );

    await storeInCache(provider, payload, data);
    return data;
  } catch (err) {
    incrementQuotaCounter(provider, project, 'error');
    
    const message = err instanceof Error ? err.message : String(err);
    logMonitoring(`REQUEST_ERROR | ${provider} | ${message.slice(0, 100)}`);

    throw err;
  }
}

// ==================== EXPORTS FOR TESTING ====================

export function _resetState(): void {
  saveQuotaState({
    date: new Date().toISOString().split('T')[0],
    count: 0,
    requests: [],
    lastError: '',
  });
  saveCache({});
}
