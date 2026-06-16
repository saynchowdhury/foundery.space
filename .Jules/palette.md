## 2026-06-16 - [Accessibility] Descriptive labels for icon-only buttons
**Learning:** Icon-only buttons (Menu, Search Clear) often lack descriptive ARIA labels, making them unusable for screen reader users. State-dependent labels for toggles are particularly important.
**Action:** Always provide descriptive `aria-label` to icon-only buttons, using dynamic labels for toggle states (e.g., "Open menu" vs "Close menu").
