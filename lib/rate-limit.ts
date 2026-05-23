// In-memory rate limiter for development.
// In production, swap for @upstash/ratelimit + @upstash/redis.

const attempts = new Map<string, { count: number; reset: number }>();

export function checkRateLimit(
  key: string,
  max = 5,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.reset) {
    attempts.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: max - entry.count };
}
