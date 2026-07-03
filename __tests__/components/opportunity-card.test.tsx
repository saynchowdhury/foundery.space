"use client";

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { OpportunityCard } from "@/components/features/opportunity-card";
import type { OpportunityCardData } from "@/lib/data";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      initial?: object;
      whileInView?: object;
      viewport?: object;
    }) => <div data-testid="motion-div" {...props}>{children}</div>,
  },
}));

// Create a minimal test opportunity
const createTestOpportunity = (overrides: Partial<OpportunityCardData> = {}): OpportunityCardData => ({
  id: "test-opp-123",
  name: "SOMA CAPITAL FELLOWSHIP",
  logoUrl: "",
  description: "A fellowship program for founders",
  category: "fellowship",
  region: "Global",
  closeDate: "2026-12-31",
  tags: ["startup", "funding"],
  funding: { amount: 50000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" },
  organizer: "Soma Capital",
  applyLink: "https://example.com/apply",
  ...overrides,
});

describe("OpportunityCard", () => {
  describe("VIEW_DETAILS button navigation", () => {
    it("renders VIEW_DETAILS button as a link", () => {
      const opportunity = createTestOpportunity();
      render(<OpportunityCard opportunity={opportunity} />);

      const viewDetailsLink = screen.getByRole("link", { name: /VIEW_DETAILS/i });
      expect(viewDetailsLink).toBeInTheDocument();
      expect(viewDetailsLink).toHaveAttribute("href", `/opportunity/${opportunity.id}`);
    });

    it("VIEW_DETAILS button generates correct URL with opportunity id", () => {
      const opportunity = createTestOpportunity({ id: "unique-id-456" });
      render(<OpportunityCard opportunity={opportunity} />);

      const viewDetailsLink = screen.getByRole("link", { name: /VIEW_DETAILS/i });
      expect(viewDetailsLink).toHaveAttribute("href", "/opportunity/unique-id-456");
    });

    it("VIEW_DETAILS button includes external link icon", () => {
      const opportunity = createTestOpportunity();
      render(<OpportunityCard opportunity={opportunity} />);

      const viewDetailsLink = screen.getByRole("link", { name: /VIEW_DETAILS/i });
      expect(viewDetailsLink.querySelector("svg")).toBeInTheDocument();
    });

    it("VIEW_DETAILS button includes 'from' query parameter when provided", () => {
      const opportunity = createTestOpportunity();
      render(<OpportunityCard opportunity={opportunity} from="browse" />);

      const viewDetailsLink = screen.getByRole("link", { name: /VIEW_DETAILS/i });
      expect(viewDetailsLink).toHaveAttribute("href", `/opportunity/${opportunity.id}?from=browse`);
    });

    it("VIEW_DETAILS and title link navigate to the same URL", () => {
      const opportunity = createTestOpportunity({ id: "test-789", from: "guide" });
      render(<OpportunityCard opportunity={opportunity} from="guide" />);

      const viewDetailsLink = screen.getByRole("link", { name: /VIEW_DETAILS/i });
      const titleLink = screen.getByRole("link", { name: /SOMA CAPITAL FELLOWSHIP/i });

      const expectedHref = `/opportunity/test-789?from=guide`;
      expect(viewDetailsLink).toHaveAttribute("href", expectedHref);
      expect(titleLink).toHaveAttribute("href", expectedHref);
    });

    it("VIEW_DETAILS button is a proper anchor element", () => {
      const opportunity = createTestOpportunity();
      render(<OpportunityCard opportunity={opportunity} />);

      const viewDetailsLink = screen.getByRole("link", { name: /VIEW_DETAILS/i });
      
      // The link should be in the document and have the correct href
      expect(viewDetailsLink).toBeInTheDocument();
      expect(viewDetailsLink.tagName).toBe("A");
      
      // Verify it has a valid href
      expect(viewDetailsLink.getAttribute("href")).toBeTruthy();
    });
  });

  describe("Title link navigation", () => {
    it("renders title as a link", () => {
      const opportunity = createTestOpportunity();
      render(<OpportunityCard opportunity={opportunity} />);

      const titleLink = screen.getByRole("link", { name: /SOMA CAPITAL FELLOWSHIP/i });
      expect(titleLink).toBeInTheDocument();
      expect(titleLink).toHaveAttribute("href", `/opportunity/${opportunity.id}`);
    });

    it("title link includes 'from' query parameter when provided", () => {
      const opportunity = createTestOpportunity();
      render(<OpportunityCard opportunity={opportunity} from="search" />);

      const titleLink = screen.getByRole("link", { name: /SOMA CAPITAL FELLOWSHIP/i });
      expect(titleLink).toHaveAttribute("href", `/opportunity/${opportunity.id}?from=search`);
    });
  });

  describe("Card rendering", () => {
    it("renders opportunity name correctly", () => {
      const opportunity = createTestOpportunity({ name: "YCOMBINATOR ACCELERATOR" });
      render(<OpportunityCard opportunity={opportunity} />);

      expect(screen.getByText("YCOMBINATOR ACCELERATOR")).toBeInTheDocument();
    });

    it("renders description correctly", () => {
      const opportunity = createTestOpportunity({ 
        description: "An early-stage startup accelerator" 
      });
      render(<OpportunityCard opportunity={opportunity} />);

      expect(screen.getByText("An early-stage startup accelerator")).toBeInTheDocument();
    });

    it("renders region correctly", () => {
      const opportunity = createTestOpportunity({ region: "United States" });
      render(<OpportunityCard opportunity={opportunity} />);

      // Region is displayed in uppercase
      expect(screen.getByText("United States")).toBeInTheDocument();
    });

    it("renders category badge correctly", () => {
      const opportunity = createTestOpportunity({ category: "accelerator" });
      render(<OpportunityCard opportunity={opportunity} />);

      expect(screen.getByText("Accelerator")).toBeInTheDocument();
    });

    it("renders with default variant", () => {
      const opportunity = createTestOpportunity();
      const { container } = render(<OpportunityCard opportunity={opportunity} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with compact variant", () => {
      const opportunity = createTestOpportunity();
      const { container } = render(
        <OpportunityCard opportunity={opportunity} variant="compact" />
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("handles missing closeDate gracefully", () => {
      const opportunity = createTestOpportunity({ closeDate: undefined });
      render(<OpportunityCard opportunity={opportunity} />);

      expect(screen.getByText("ROLLING_CYCLE")).toBeInTheDocument();
    });

    it("shows urgent status for close deadlines", () => {
      // Set close date to 5 days from now
      const fiveDaysFromNow = new Date();
      fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
      
      const opportunity = createTestOpportunity({ 
        closeDate: fiveDaysFromNow.toISOString() 
      });
      render(<OpportunityCard opportunity={opportunity} />);

      expect(screen.getByText("PRIORITY_OMEGA")).toBeInTheDocument();
    });

    it("shows safe status for distant deadlines", () => {
      // Set close date to 60 days from now
      const sixtyDaysFromNow = new Date();
      sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
      
      const opportunity = createTestOpportunity({ 
        closeDate: sixtyDaysFromNow.toISOString() 
      });
      render(<OpportunityCard opportunity={opportunity} />);

      expect(screen.getByText("SYSTEM_STABLE")).toBeInTheDocument();
    });
  });

  describe("Memoization", () => {
    it("exports display name for debugging", () => {
      expect(OpportunityCard.displayName).toBe("OpportunityCard");
    });
  });
});
