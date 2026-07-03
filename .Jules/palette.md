## 2025-05-15 - [Search Input Enhancement]
**Learning:** Adding a functional 'Clear Search' button improves usability, and using a bracketed aesthetic `[ X ]` preserves the technical/hacker theme of the application while providing accessible interactions.
**Action:** Always check for missing clear buttons on search inputs and ensure they are accessible with `aria-label` and `type="button"`.

## 2025-05-15 - [Interactive State Visibility]
**Learning:** Using `aria-pressed` on custom toggle buttons (like the filter status buttons) and `aria-expanded` on the mobile menu ensures that screen reader users can programmatically perceive the active state of interactive elements.
**Action:** Audit custom buttons for state-revealing ARIA attributes.
