import { describe, it, expect } from "vitest";
import { siteUrl } from "./config";

describe("siteUrl", () => {
  it("returns base URL without path", () => {
    expect(siteUrl()).toBe("http://localhost:3000");
  });

  it("appends path correctly", () => {
    expect(siteUrl("/about")).toBe("http://localhost:3000/about");
  });

  it("strips trailing slash from base", () => {
    expect(siteUrl("/about")).toBe("http://localhost:3000/about");
  });
});
