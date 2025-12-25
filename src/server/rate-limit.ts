// Einfaches In-Memory Rate Limiting
// Für Production: Redis oder ähnliches verwenden

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Konfiguration
const WINDOW_MS = 60 * 60 * 1000; // 1 Stunde
const MAX_REQUESTS = 5; // Max 5 Anfragen pro Stunde pro IP

// Cleanup alte Einträge (alle 5 Minuten)
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

  // Kein Eintrag oder abgelaufen -> neues Fenster
  if (!entry || entry.resetAt < now) {
    const resetAt = now + WINDOW_MS;
    rateLimitStore.set(identifier, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: new Date(resetAt),
    };
  }

  // Limit erreicht?
  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(entry.resetAt),
    };
  }

  // Anfrage zählen
  entry.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetAt: new Date(entry.resetAt),
  };
}


