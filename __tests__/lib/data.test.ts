import { describe, it, expect, beforeEach } from "vitest";
import {
  getDaysUntilDeadline,
  getDeadlineUrgency,
  filterOpportunities,
  type Opportunity,
} from "@/lib/data";

describe("lib/data", () => {
  describe("getDaysUntilDeadline", () => {
    it("returns positive days for future dates", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const result = getDaysUntilDeadline(futureDate.toISOString());
      expect(result).toBe(30);
    });

    it("returns negative days for past dates", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 10);
      const result = getDaysUntilDeadline(pastDate.toISOString());
      expect(result).toBe(-10);
    });

    it("returns NaN for invalid dates", () => {
      const result = getDaysUntilDeadline("not-a-date");
      expect(Number.isNaN(result)).toBe(true);
    });

    it("returns 0 for today's date", () => {
      const today = new Date().toISOString().split("T")[0];
      const result = getDaysUntilDeadline(today);
      expect(result).toBeLessThanOrEqual(1);
    });
  });

  describe("getDeadlineUrgency", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-07-15T12:00:00Z"));
    });

    it("returns urgent for deadlines within 7 days", () => {
      const nearDeadline = new Date("2026-07-20").toISOString();
      expect(getDeadlineUrgency(nearDeadline)).toBe("urgent");
    });

    it("returns warning for deadlines within 8-30 days", () => {
      const warningDeadline = new Date("2026-08-05").toISOString();
      expect(getDeadlineUrgency(warningDeadline)).toBe("warning");
    });

    it("returns safe for deadlines more than 30 days away", () => {
      const safeDeadline = new Date("2026-09-15").toISOString();
      expect(getDeadlineUrgency(safeDeadline)).toBe("safe");
    });

    it("returns safe for invalid dates", () => {
      expect(getDeadlineUrgency("not-a-date")).toBe("safe");
    });
  });

  describe("filterOpportunities", () => {
    const createOpportunity = (overrides: Partial<Opportunity> = {}): Opportunity => ({
      id: "test-1",
      name: "Test Program",
      logoUrl: "",
      description: "A test opportunity",
      fullDescription: "",
      openDate: null,
      closeDate: "2026-12-31",
      tags: ["tech", "startup"],
      category: "fellowship",
      region: "Global",
      country: null,
      eligibility: "",
      applyLink: "https://example.com",
      benefits: [],
      organizer: "Test Org",
      votes: 10,
      ...overrides,
    });

    const mockOpportunities: Opportunity[] = [
      createOpportunity({
        id: "1",
        name: "Fellowship Alpha",
        category: "fellowship",
        region: "Global",
        tags: ["tech"],
        funding: { amount: 50000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" },
        duration: { value: 3, unit: "months" },
      }),
      createOpportunity({
        id: "2",
        name: "Accelerator Beta",
        category: "accelerator",
        region: "United States",
        tags: ["startup", "tech"],
        funding: { amount: 150000, currency: "USD", equityPercentage: 7, fundingType: "equity-based" },
        duration: { value: 6, unit: "months" },
      }),
      createOpportunity({
        id: "3",
        name: "Grant Gamma",
        category: "grant",
        region: "Europe",
        tags: ["research", "science"],
        funding: { amount: 25000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" },
      }),
      createOpportunity({
        id: "4",
        name: "Residency Delta",
        category: "residency",
        region: "Asia",
        tags: ["art", "creative"],
        funding: { amount: 10000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" },
        duration: { value: 1, unit: "years" },
      }),
    ];

    describe("category filtering", () => {
      it("filters by single category", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: ["fellowship"],
          regions: [],
          tags: [],
        });
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Fellowship Alpha");
      });

      it("filters by multiple categories", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: ["fellowship", "accelerator"],
          regions: [],
          tags: [],
        });
        expect(result).toHaveLength(2);
      });

      it("returns all when no categories specified", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: [],
          regions: [],
          tags: [],
        });
        expect(result).toHaveLength(4);
      });
    });

    describe("region filtering", () => {
      it("filters by single region", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: [],
          regions: ["United States"],
          tags: [],
        });
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Accelerator Beta");
      });

      it("filters by multiple regions", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: [],
          regions: ["United States", "Europe"],
          tags: [],
        });
        expect(result).toHaveLength(2);
      });

      it("returns all when no regions specified", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: [],
          regions: [],
          tags: [],
        });
        expect(result).toHaveLength(4);
      });
    });

    describe("tag filtering", () => {
      it("filters by single tag", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: [],
          regions: [],
          tags: ["tech"],
        });
        expect(result).toHaveLength(2);
      });

      it("filters by multiple tags AND logic", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: [],
          regions: [],
          tags: ["startup", "tech"],
        });
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Accelerator Beta");
      });

      it("returns all when no tags specified", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: [],
          regions: [],
          tags: [],
        });
        expect(result).toHaveLength(4);
      });
    });

    describe("funding amount filtering", () => {
      it("filters by funding amount range", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: [],
          regions: [],
          tags: [],
          fundingAmount: { min: 100000, max: 200000 },
        });
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Accelerator Beta");
      });

      it("excludes opportunities without funding when funding filter is applied", () => {
        const opportunitiesWithoutFunding = [
          createOpportunity({ id: "no-funding", name: "No Funding Program", funding: undefined }),
        ];
        const result = filterOpportunities(opportunitiesWithoutFunding, {
          categories: [],
          regions: [],
          tags: [],
          fundingAmount: { min: 1000, max: 100000 },
        });
        expect(result).toHaveLength(0);
      });
    });

    describe("equity percentage filtering", () => {
      it("filters by equity percentage range", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: [],
          regions: [],
          tags: [],
          equityPercentage: { min: 5, max: 10 },
        });
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Accelerator Beta");
      });
    });

    describe("duration filtering", () => {
      it("filters by duration range in months", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: [],
          regions: [],
          tags: [],
          duration: { min: 1, max: 6, unit: "months" },
        });
        expect(result).toHaveLength(2);
      });
    });

    describe("combined filtering", () => {
      it("applies multiple filters together", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: [],
          regions: ["Global", "United States"],
          tags: ["tech"],
          fundingAmount: { min: 10000, max: 200000 },
        });
        expect(result).toHaveLength(2);
      });

      it("returns empty array when no matches", () => {
        const result = filterOpportunities(mockOpportunities, {
          categories: ["nonexistent"],
          regions: ["Antarctica"],
          tags: ["nonexistent-tag"],
        });
        expect(result).toHaveLength(0);
      });
    });
  });
});
