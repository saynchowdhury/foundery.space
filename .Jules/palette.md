## 2025-05-15 - Floating Element Layering
**Learning:** Multiple floating action buttons (FABs) on the same side of the screen require vertical staggering to prevent overlap and maintain accessibility. In this app, the feedback button occupies `bottom-6 right-6`, so secondary actions should start at `bottom-24`.
**Action:** Always check for existing fixed/floating elements before positioning new ones. Stagger vertically by ~72px (18 units) minimum.

## 2025-05-15 - ARIA Label Redundancy
**Learning:** Screen readers announce both the `aria-label` and the inner text of a button. Adding an `aria-label` that matches or describes the visible text (e.g., "Send" button) creates redundant announcements.
**Action:** Only use `aria-label` for icon-only buttons or when the visible text is insufficient to describe the action context.
