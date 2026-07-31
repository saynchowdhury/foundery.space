## 2026-06-18 - Accessibility for Interactive Toggles and Search
**Learning:** Icon-only buttons and stateful toggles (like mobile menus) require explicit ARIA attributes (`aria-label`, `aria-expanded`, `aria-controls`) to be usable by screen reader users. Decorative icons should be marked with `aria-hidden="true"` to reduce noise.
**Action:** Always include ARIA labels for buttons without text and manage `aria-expanded` state for menu toggles.

## 2026-06-18 - Usability for Long Lists
**Learning:** For pages with infinite scroll or long content (like the Browse page), a "Back to Top" button significantly improves the user experience by providing a quick way to return to navigation/filters.
**Action:** Implement "Back to Top" buttons on search or directory pages that exceed 2x viewport height.
