import { describe, it, expect } from "vitest";
import {
  CATEGORIES,
  PRIMARY,
  CATEGORY_LABELS,
  LEGACY_ALIASES,
  toCanonicalCategory,
  categoryLabel,
  categoryLabelSingular,
  categorySlug,
  categorySlugs,
  isCategory,
} from "@/lib/categories";

describe("lib/categories", () => {
  describe("CATEGORIES", () => {
    it("contains 'all' plus all primary categories", () => {
      expect(CATEGORIES[0]).toBe("all");
      expect(CATEGORIES.length).toBe(12);
    });

    it("has exactly 12 categories", () => {
      expect(CATEGORIES).toHaveLength(12);
    });
  });

  describe("PRIMARY", () => {
    it("contains 11 primary categories (excluding 'all')", () => {
      expect(PRIMARY).toHaveLength(11);
      expect(PRIMARY).not.toContain("all");
    });

    it("all primary categories are in CATEGORIES", () => {
      PRIMARY.forEach((cat) => {
        expect(CATEGORIES).toContain(cat);
      });
    });
  });

  describe("CATEGORY_LABELS", () => {
    it("has labels for all primary categories", () => {
      PRIMARY.forEach((cat) => {
        expect(CATEGORY_LABELS).toHaveProperty(cat);
      });
    });

    it("each category has singular, plural, and slug", () => {
      PRIMARY.forEach((cat) => {
        const label = CATEGORY_LABELS[cat];
        expect(label).toHaveProperty("singular");
        expect(label).toHaveProperty("plural");
        expect(label).toHaveProperty("slug");
        expect(typeof label.singular).toBe("string");
        expect(typeof label.plural).toBe("string");
        expect(typeof label.slug).toBe("string");
      });
    });

    it("some categories have different slugs than their key", () => {
      expect(CATEGORY_LABELS.venture_capital.slug).toBe("venture-capital");
      expect(CATEGORY_LABELS.developer_program.slug).toBe("developer-program");
    });
  });

  describe("LEGACY_ALIASES", () => {
    it("maps legacy names to canonical categories", () => {
      expect(LEGACY_ALIASES).toHaveProperty("developer_programs");
      expect(LEGACY_ALIASES["developer_programs"]).toBe("developer_program");
    });
  });

  describe("toCanonicalCategory", () => {
    it("returns canonical category for valid input", () => {
      expect(toCanonicalCategory("fellowship")).toBe("fellowship");
      expect(toCanonicalCategory("accelerator")).toBe("accelerator");
      expect(toCanonicalCategory("developer_program")).toBe("developer_program");
    });

    it("converts legacy alias to canonical", () => {
      expect(toCanonicalCategory("developer_programs")).toBe("developer_program");
    });

    it("returns null for invalid input", () => {
      expect(toCanonicalCategory("invalid_category")).toBeNull();
      expect(toCanonicalCategory("")).toBeNull();
      expect(toCanonicalCategory("FELLOWSHIP")).toBeNull();
    });
  });

  describe("categoryLabel", () => {
    it("returns plural label for valid category", () => {
      expect(categoryLabel("fellowship")).toBe("Fellowships");
      expect(categoryLabel("accelerator")).toBe("Accelerators");
      expect(categoryLabel("grant")).toBe("Grants");
    });

    it("returns fallback for invalid category", () => {
      expect(categoryLabel("invalid")).toBe("invalid");
    });
  });

  describe("categoryLabelSingular", () => {
    it("returns singular label for valid category", () => {
      expect(categoryLabelSingular("fellowship")).toBe("Fellowship");
      expect(categoryLabelSingular("accelerator")).toBe("Accelerator");
      expect(categoryLabelSingular("grant")).toBe("Grant");
    });

    it("returns fallback for invalid category", () => {
      expect(categoryLabelSingular("invalid")).toBe("invalid");
    });
  });

  describe("categorySlug", () => {
    it("returns slug for valid category", () => {
      expect(categorySlug("fellowship")).toBe("fellowship");
      expect(categorySlug("venture_capital")).toBe("venture-capital");
      expect(categorySlug("developer_program")).toBe("developer-program");
    });

    it("returns fallback for invalid category", () => {
      expect(categorySlug("invalid")).toBe("invalid");
    });
  });

  describe("categorySlugs", () => {
    it("returns slug array for valid category", () => {
      expect(categorySlugs("fellowship")).toEqual(["fellowship"]);
    });

    it("returns multiple slugs for developer_program", () => {
      const slugs = categorySlugs("developer_program");
      expect(slugs).toContain("developer-program");
      expect(slugs).toContain("developer-programs");
    });
  });

  describe("isCategory", () => {
    it("returns true for valid primary categories", () => {
      expect(isCategory("fellowship")).toBe(true);
      expect(isCategory("accelerator")).toBe(true);
      expect(isCategory("grant")).toBe(true);
    });

    it("returns false for invalid categories", () => {
      expect(isCategory("invalid")).toBe(false);
      expect(isCategory("")).toBe(false);
      expect(isCategory("FELLOWSHIP")).toBe(false);
    });
  });
});
