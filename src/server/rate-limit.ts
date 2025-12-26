// Simple in-memory rate limiting
// For production: consider using Redis or similar

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5; // Max 5 requests per hour per IP

// Cleanup expired entries (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No entry or expired -> new window
  if (!entry || entry.resetAt < now) {
    const resetAt = now + WINDOW_MS;
    rateLimitStore.set(identifier, { count: 1, resetAt });
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
}


