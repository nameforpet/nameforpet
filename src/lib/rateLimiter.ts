// High-Performance Sliding Window Rate Limiter
// Protects endpoints from DDoS, credential stuffing, and quota exhaustion

interface RateLimitRecord {
  timestamps: number[];
}

declare global {
  // eslint-disable-next-line no-var
  var __rateLimitStore: Map<string, RateLimitRecord> | undefined;
}

if (!globalThis.__rateLimitStore) {
  globalThis.__rateLimitStore = new Map<string, RateLimitRecord>();
}

const rateLimitStore = globalThis.__rateLimitStore;

export interface RateLimitConfig {
  limit: number;      // Maximum allowed requests
  windowMs: number;   // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

/**
 * Checks and increments rate limit for a client identifier (e.g. IP + endpoint)
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter timestamps within the active sliding window
  const activeTimestamps = record.timestamps.filter(t => now - t < config.windowMs);

  if (activeTimestamps.length >= config.limit) {
    const oldest = activeTimestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + config.windowMs - now) / 1000));
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  activeTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: activeTimestamps });

  return {
    success: true,
    remaining: config.limit - activeTimestamps.length,
  };
}

/**
 * Helper to extract client IP from NextRequest headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}
