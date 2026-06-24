## 2025-05-15 - [Accessibility: Icon-only Buttons & Interactive States]
**Learning:** Icon-only buttons (like mobile menu toggles and clear buttons) and state-dependent filters require explicit ARIA attributes (`aria-label`, `aria-expanded`, `aria-pressed`) to be accessible to screen reader users, as their visual-only cues are not captured by assistive technology.
**Action:** Always include descriptive `aria-label` for icon-only buttons and use `aria-expanded` or `aria-pressed` for components with toggleable or active states.
