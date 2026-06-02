import type { OpportunityCardData } from "./data";

/**
 * Generate alt text for opportunity logos/images
 */
export function generateAltText(opportunity: OpportunityCardData): string {
  if (opportunity.organizer && opportunity.organizer !== opportunity.name) {
    return `${opportunity.name} - ${opportunity.organizer} logo`;
  }
  return `${opportunity.name} logo`;
}

