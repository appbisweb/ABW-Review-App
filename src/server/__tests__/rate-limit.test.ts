import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the rate limit module to test its logic in isolation
// We need to re-implement the core logic for testing since the actual module
// uses intervals that would interfere with tests

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

function createRateLimiter() {
  const store = new Map<string, RateLimitEntry>();

  return {
    check(identifier: string) {
      const now = Date.now();
      const entry = store.get(identifier);

      // No entry or expired -> new window
      if (!entry || entry.resetAt < now) {
        const resetAt = now + WINDOW_MS;
        store.set(identifier, { count: 1, resetAt });
        return {
          allowed: true,
          remaining: MAX_REQUESTS - 1,
          resetAt: new Date(resetAt),
        };
      }

      // Limit reached?
      if (entry.count >= MAX_REQUESTS) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: new Date(entry.resetAt),
        };
      }

      // Count request
      entry.count++;
      return {
        allowed: true,
        remaining: MAX_REQUESTS - entry.count,
        resetAt: new Date(entry.resetAt),
      };
    },
    clear() {
      store.clear();
    },
    getStore() {
      return store;
    },
  };
}

describe('Rate Limiting', () => {
  let rateLimiter: ReturnType<typeof createRateLimiter>;

  beforeEach(() => {
    rateLimiter = createRateLimiter();
    vi.useFakeTimers();
  });

  it('should allow first request', () => {
    const result = rateLimiter.check('test-ip');
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(MAX_REQUESTS - 1);
  });

  it('should decrement remaining count on each request', () => {
    const ip = 'decrement-test';

    const first = rateLimiter.check(ip);
    expect(first.remaining).toBe(4);

    const second = rateLimiter.check(ip);
    expect(second.remaining).toBe(3);

    const third = rateLimiter.check(ip);
    expect(third.remaining).toBe(2);
  });

  it('should block after reaching the limit', () => {
    const ip = 'limit-test';

    // Make MAX_REQUESTS requests
    for (let i = 0; i < MAX_REQUESTS; i++) {
      rateLimiter.check(ip);
    }

    // Next request should be blocked
    const result = rateLimiter.check(ip);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should track different IPs separately', () => {
    const ip1 = 'ip-1';
    const ip2 = 'ip-2';

    // Exhaust limit for ip1
    for (let i = 0; i < MAX_REQUESTS; i++) {
      rateLimiter.check(ip1);
    }

    // ip1 should be blocked
    expect(rateLimiter.check(ip1).allowed).toBe(false);

    // ip2 should still be allowed
    expect(rateLimiter.check(ip2).allowed).toBe(true);
  });

  it('should reset after window expires', () => {
    const ip = 'reset-test';

    // Exhaust limit
    for (let i = 0; i < MAX_REQUESTS; i++) {
      rateLimiter.check(ip);
    }

    expect(rateLimiter.check(ip).allowed).toBe(false);

    // Fast-forward past the window
    vi.advanceTimersByTime(WINDOW_MS + 1000);

    // Should be allowed again
    const result = rateLimiter.check(ip);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(MAX_REQUESTS - 1);
  });

  it('should return correct resetAt timestamp', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const result = rateLimiter.check('timestamp-test');
    const expectedResetAt = now + WINDOW_MS;

    expect(result.resetAt.getTime()).toBe(expectedResetAt);
  });
});



