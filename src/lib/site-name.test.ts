import { describe, it, expect } from "vitest";
import { splitSiteName } from "./site-name";

describe("splitSiteName", () => {
  it("splits on & separator", () => {
    const result = splitSiteName("Mercy & Health");
    expect(result.before).toBe("Mercy");
    expect(result.after).toBe("Health");
  });

  it("handles name without separator", () => {
    const result = splitSiteName("Mercy");
    expect(result.before).toBe("Mercy");
    expect(result.after).toBe("");
  });

  it("handles empty string", () => {
    const result = splitSiteName("");
    expect(result.before).toBe("");
    expect(result.after).toBe("");
  });
});
