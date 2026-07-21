import { describe, it, expect, vi } from "vitest";
import { cn, cleanDisplayText, formatFunding, normalizeTagDisplay, normalizeTagSlug, safeJsonLd } from "@/lib/utils";

describe("lib/utils", () => {
  describe("cn (className merger)", () => {
    it("merges class names", () => {
      const result = cn("foo", "bar");
      expect(result).toBe("foo bar");
    });

    it("handles conditional classes", () => {
      const result = cn("foo", false && "bar", "baz");
      expect(result).toBe("foo baz");
    });

    it("handles undefined values", () => {
      const result = cn("foo", undefined, "bar");
      expect(result).toBe("foo bar");
    });

    it("handles empty strings", () => {
      const result = cn("foo", "", "bar");
      expect(result).toBe("foo bar");
    });

    it("handles arrays", () => {
      const result = cn("foo", ["bar", "baz"]);
      expect(result).toBe("foo bar baz");
    });

    it("handles nested arrays", () => {
      const result = cn("foo", ["bar", ["baz", "qux"]]);
      expect(result).toBe("foo bar baz qux");
    });

    it("handles Tailwind conflicting classes (takes last)", () => {
      const result = cn("text-red-500 text-blue-500");
      expect(result).toBe("text-blue-500");
    });
  });

  describe("cleanDisplayText", () => {
    it("trims whitespace", () => {
      expect(cleanDisplayText("  hello  ")).toBe("hello");
    });

    it("normalizes multiple spaces to single space", () => {
      expect(cleanDisplayText("hello    world")).toBe("hello world");
    });

    it("preserves newlines", () => {
      expect(cleanDisplayText("hello\nworld")).toBe("hello\nworld");
    });

    it("normalizes tabs to spaces", () => {
      expect(cleanDisplayText("hello\tworld")).toBe("hello world");
    });

    it("handles mixed whitespace", () => {
      expect(cleanDisplayText("  hello  \t  world  ")).toBe("hello world");
    });

    it("returns empty string for null/undefined", () => {
      expect(cleanDisplayText("")).toBe("");
      expect(cleanDisplayText(null)).toBe("");
      expect(cleanDisplayText(undefined)).toBe("");
    });

    it("preserves normal text", () => {
      expect(cleanDisplayText("Hello World")).toBe("Hello World");
    });

    it("removes markdown formatting", () => {
      expect(cleanDisplayText("**bold** and *italic*")).toBe("bold and italic");
      expect(cleanDisplayText("~~strikethrough~~")).toBe("strikethrough");
    });

    it("decodes HTML entities", () => {
      expect(cleanDisplayText("Tom &amp; Jerry")).toBe("Tom & Jerry");
      expect(cleanDisplayText("&quot;quoted&quot;")).toBe('"quoted"');
    });
  });

  describe("formatFunding", () => {
    it("formats thousands with K suffix", () => {
      expect(formatFunding(50000)).toBe("$50K");
      expect(formatFunding(30000)).toBe("$30K");
    });

    it("formats millions with M suffix", () => {
      expect(formatFunding(1500000)).toBe("$1.5M");
      expect(formatFunding(1000000)).toBe("$1M");
    });

    it("formats small amounts with full number", () => {
      expect(formatFunding(500)).toBe("$500");
    });

    it("returns 'Varies' for zero or undefined", () => {
      expect(formatFunding(0)).toBe("Varies");
      expect(formatFunding(undefined)).toBe("Varies");
    });
  });

  describe("normalizeTagDisplay", () => {
    it("converts underscores to spaces", () => {
      expect(normalizeTagDisplay("machine_learning")).toBe("Machine Learning");
    });

    it("converts to title case", () => {
      expect(normalizeTagDisplay("artificial-intelligence")).toBe("Artificial Intelligence");
    });
  });

  describe("normalizeTagSlug", () => {
    it("converts to lowercase", () => {
      expect(normalizeTagSlug("Machine-Learning")).toBe("machine-learning");
    });

    it("replaces spaces and underscores with hyphens", () => {
      expect(normalizeTagSlug("machine learning")).toBe("machine-learning");
      expect(normalizeTagSlug("machine_learning")).toBe("machine-learning");
    });

    it("removes invalid characters", () => {
      expect(normalizeTagSlug("Tech!@#$%")).toBe("tech");
    });
  });

  describe("safeJsonLd", () => {
    it("returns empty string for null or undefined", () => {
      expect(safeJsonLd(null)).toBe("");
      expect(safeJsonLd(undefined)).toBe("");
    });

    it("escapes < and > characters", () => {
      const data = { xss: "</script><script>alert(1)</script>" };
      const result = safeJsonLd(data);
      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
      expect(result).toContain("\\u003c/script\\u003e\\u003cscript\\u003e");
    });

    it("handles objects and arrays correctly", () => {
      const data = { a: 1, b: [2, 3] };
      const result = safeJsonLd(data);
      expect(JSON.parse(result)).toEqual(data);
    });

    it("handles stringification errors gracefully", () => {
      const circular: any = {};
      circular.self = circular;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(safeJsonLd(circular)).toBe("");
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
