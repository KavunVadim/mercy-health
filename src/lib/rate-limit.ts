const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(options: {
  interval: number;
  max: number;
  key: string;
}): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const entry = store.get(options.key);

  if (!entry || now > entry.resetAt) {
    store.set(options.key, { count: 1, resetAt: now + options.interval });
    return { allowed: true, remaining: options.max - 1, resetInMs: options.interval };
  }

  entry.count++;

  if (entry.count > options.max) {
    return { allowed: false, remaining: 0, resetInMs: entry.resetAt - now };
  }

  return { allowed: true, remaining: options.max - entry.count, resetInMs: entry.resetAt - now };
}
