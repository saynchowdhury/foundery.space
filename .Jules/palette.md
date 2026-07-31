# Palette's UX Journal

## 2025-05-15 - Header Breakpoint Visibility Gap
**Learning:** The `Header.tsx` has a visibility gap on medium screens (768px to 1024px). The mobile toggle is hidden at `md:hidden`, but the desktop navigation only appears at `lg:flex`. This leaves a window where no navigation is visible.
**Action:** When working on navigation, ensure breakpoints are synchronized. If a major design change is out of scope, prioritize non-breaking accessibility improvements instead.

## 2025-05-15 - Design Change Constraints
**Learning:** Changing core layout breakpoints (e.g., from `md` to `lg`) is considered a major design change and may be rejected if it significantly alters the UI beyond micro-UX improvements.
**Action:** Stick to micro-UX improvements (ARIA labels, state indicators, polish) unless specifically tasked with layout overhaul.
