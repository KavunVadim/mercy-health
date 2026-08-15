import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { rateLimit } from "./rate-limit";

let n = 0;

beforeEach(() => {
  vi.useFakeTimers();
  n++;
});

afterEach(() => {
  vi.useRealTimers();
});

describe("rateLimit", () => {
  it("allows first request", () => {
    const result = rateLimit({ interval: 1000, max: 3, key: `a-${n}` });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("allows up to max requests", () => {
    const key = `b-${n}`;
    const results = Array.from({ length: 3 }, () =>
      rateLimit({ interval: 1000, max: 3, key }),
    );
    expect(results.every((r) => r.allowed)).toBe(true);
  });

  it("blocks after max requests", () => {
    const key = `c-${n}`;
    for (let i = 0; i < 3; i++) rateLimit({ interval: 1000, max: 3, key });
    const blocked = rateLimit({ interval: 1000, max: 3, key });
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("resets after interval", () => {
    const key = `d-${n}`;
    rateLimit({ interval: 100, max: 1, key });
    const blocked = rateLimit({ interval: 100, max: 1, key });
    expect(blocked.allowed).toBe(false);

    vi.advanceTimersByTime(101);
    const allowed = rateLimit({ interval: 100, max: 1, key });
    expect(allowed.allowed).toBe(true);
  });

  it("tracks different keys independently", () => {
    const key1 = `e1-${n}`;
    const key2 = `e2-${n}`;
    rateLimit({ interval: 1000, max: 1, key: key1 });
    const blocked = rateLimit({ interval: 1000, max: 1, key: key1 });
    expect(blocked.allowed).toBe(false);

    const allowed = rateLimit({ interval: 1000, max: 1, key: key2 });
    expect(allowed.allowed).toBe(true);
  });
});
