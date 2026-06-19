import { describe, it, expect } from "vitest";
import { sanitizeHtml } from "./sanitize";

describe("sanitizeHtml", () => {
  it("removes script tags", () => {
    const result = sanitizeHtml('<p>hello</p><script>alert("xss")</script>');
    expect(result).not.toContain("script");
    expect(result).toContain("<p>hello</p>");
  });

  it("removes inline event handlers", () => {
    const result = sanitizeHtml('<button onclick="alert(1)">click</button>');
    expect(result).not.toContain("onclick");
    expect(result).toContain("<button>click</button>");
  });

  it("removes event handlers with single quotes", () => {
    const result = sanitizeHtml("<div onload='evil()'>content</div>");
    expect(result).not.toContain("onload");
  });

  it("preserves safe html", () => {
    const html = "<p><strong>Safe</strong> content</p>";
    expect(sanitizeHtml(html)).toBe(html);
  });
});
