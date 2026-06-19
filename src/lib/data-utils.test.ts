import { describe, it, expect } from "vitest";
import { slugify, arrToText, textToArr } from "./data-utils";

describe("slugify", () => {
  it("slugifies latin text", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("slugifies ukrainian text", () => {
    expect(slugify("Новини фонду")).toBe("novyny-fondu");
  });

  it("handles ї and є", () => {
    expect(slugify("їжа єнота")).toBe("yizha-yenota");
  });

  it("removes ь and ъ", () => {
    expect(slugify("кілька об'єкт")).toBe("kilka-obyekt");
  });

  it("returns fallback for empty string", () => {
    expect(slugify("", "fallback")).toBe("fallback");
  });

  it("defaults to 'item' fallback", () => {
    expect(slugify("---")).toBe("item");
  });
});

describe("arrToText", () => {
  it("joins array with newlines", () => {
    expect(arrToText(["a", "b", "c"])).toBe("a\nb\nc");
  });

  it("returns string as-is", () => {
    expect(arrToText("hello")).toBe("hello");
  });

  it("returns empty string for undefined", () => {
    expect(arrToText(undefined)).toBe("");
  });

  it("returns empty string for empty array", () => {
    expect(arrToText([])).toBe("");
  });
});

describe("textToArr", () => {
  it("splits newlines into array", () => {
    expect(textToArr("a\nb\nc")).toEqual(["a", "b", "c"]);
  });

  it("skips empty lines", () => {
    expect(textToArr("a\n\nb")).toEqual(["a", "b"]);
  });

  it("returns empty array for empty text", () => {
    expect(textToArr("")).toEqual([]);
  });

  it("extracts html blocks", () => {
    const html = "<p>first</p><p>second</p>";
    const result = textToArr(html);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe("<p>first</p>");
  });
});
