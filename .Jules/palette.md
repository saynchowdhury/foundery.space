# Palette's Journal - Critical UX/Accessibility Learnings

## 2025-05-14 - [Mobile Navigation Breakpoint]
**Learning:** Changing the mobile navigation visibility breakpoint from `md:hidden` to `lg:hidden` was rejected as a 'major design change'. Palette should prioritize non-breaking accessibility improvements over layout overhauls.
**Action:** Stick to improving existing layouts with ARIA attributes and small micro-interactions rather than changing responsive breakpoints.

## 2025-05-14 - [Interactive Element Types]
**Learning:** Interactive elements like 'Clear' buttons within inputs or other utility buttons must be explicitly assigned `type="button"` to prevent accidental form submissions if wrapped in a `<form>`.
**Action:** Always include `type="button"` on non-submit buttons.

## 2025-05-14 - [Z-Index for Input Overlays]
**Learning:** When implementing absolute-positioned interactive elements within input fields (like a 'Clear' button), ensure a `z-index` (e.g., `z-10`) is applied to maintain visibility and interactivity over the input's background and styling.
**Action:** Use `z-10` or appropriate z-index for overlay buttons.
